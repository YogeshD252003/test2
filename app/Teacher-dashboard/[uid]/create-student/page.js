"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Fingerprint } from "lucide-react";

/*
  Helper functions to convert ArrayBuffer <-> base64url
*/
function bufferToBase64Url(buffer) {
  // buffer -> binary string -> base64 -> base64url
  const bytes = new Uint8Array(buffer || []);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToBuffer(base64url) {
  // base64url -> base64 -> binary string -> ArrayBuffer
  const b64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  // pad
  const pad = b64.length % 4;
  const padded = b64 + (pad ? "=".repeat(4 - pad) : "");
  const binary = atob(padded);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export default function CreateStudentPage() {
  const { uid: teacherUid } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    usn: "",
    email: "",
    password: "",
    department: "",
    semester: "",
    section: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [processingFp, setProcessingFp] = useState(false);
  const [studentUid, setStudentUid] = useState(""); // the created student's uid in Auth
  const [fingerprintRegistered, setFingerprintRegistered] = useState(false);

  // Update form fields
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  // Create Auth user (if not created) - returns uid
  const createAuthUserIfNeeded = async () => {
    if (studentUid) return studentUid;
    // create user
    const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
    const user = userCredential.user;
    setStudentUid(user.uid);
    // also create initial student doc so we have a place to store webauthn
    await setDoc(doc(db, "students", user.uid), {
      uid: user.uid,
      email: form.email,
      createdAt: serverTimestamp(),
      teacherId: teacherUid,
    });
    return user.uid;
  };

  // Register fingerprint using WebAuthn (must be called from a secure context)
  const handleFingerprintRegister = async () => {
    if (!navigator.credentials || !navigator.credentials.create) {
      alert("WebAuthn not supported in this browser. Use Chrome/Edge/Safari on HTTPS or localhost.");
      return;
    }

    if (!form.email || !form.password) {
      alert("Please enter student's email and password first (they are needed to create student account).");
      return;
    }

    setProcessingFp(true);

    try {
      // 1) Ensure Auth user exists and Firestore doc exists
      const uid = await createAuthUserIfNeeded(); // will create Auth user & basic doc if not present

      // 2) Create a random challenge - in production get this from server
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // 3) Prepare publicKey options
      const pubKey = {
        challenge,
        rp: { name: "EduTrack" },
        user: {
          id: new TextEncoder().encode(uid), // MUST be ArrayBuffer tied to the student uid
          name: form.email,
          displayName: form.name || form.email,
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }], // ES256
        authenticatorSelection: {
          authenticatorAttachment: "platform", // prefer built-in platform (fingerprint)
          userVerification: "required",
        },
        timeout: 60000,
      };

      // 4) Call WebAuthn create (this triggers the OS biometric prompt on student's device)
      const credential = await navigator.credentials.create({ publicKey: pubKey });

      if (!credential) throw new Error("No credential created");

      // 5) Extract and encode fields we need to store
      const rawIdB64u = bufferToBase64Url(credential.rawId);
      // response is an AuthenticatorAttestationResponse for create()
      const attestationResponse = credential.response;
      const clientDataJSON = bufferToBase64Url(attestationResponse.clientDataJSON);
      const attestationObject = bufferToBase64Url(attestationResponse.attestationObject);

      // 6) Save credential fields in student's Firestore doc
      const studentRef = doc(db, "students", uid);
      await updateDoc(studentRef, {
        fingerprint: {
          id: credential.id,
          rawId: rawIdB64u,
          clientDataJSON,
          attestationObject,
          createdAt: serverTimestamp(),
        },
        fingerprintRegistered: true,
      });

      setStudentUid(uid);
      setFingerprintRegistered(true);
      alert("✅ Fingerprint registered and saved for student.");
    } catch (err) {
      console.error("Fingerprint register failed:", err);
      alert("❌ Fingerprint registration failed. See console for details.");
    } finally {
      setProcessingFp(false);
    }
  };

  // Final submit: create or update full student profile in Firestore and navigate back
  const handleSubmit = async (e) => {
    e.preventDefault();

    // simple validation
    if (!form.email || !form.password || !form.name) {
      alert("Please fill name, email and password.");
      return;
    }

    setLoading(true);
    try {
      let uidToUse = studentUid;

      // If fingerprint step didn't create auth user, create the auth user now
      if (!uidToUse) {
        const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
        uidToUse = userCredential.user.uid;
      }

      // set or update student doc under students/{uid}
      const studentRef = doc(db, "students", uidToUse);
      // If doc exists, update; else set (setDoc will create/overwrite)
      const existing = await getDoc(studentRef);
      const payload = {
        uid: uidToUse,
        name: form.name,
        usn: form.usn,
        email: form.email,
        department: form.department,
        semester: form.semester,
        section: form.section,
        phone: form.phone,
        teacherId: teacherUid,
        updatedAt: serverTimestamp(),
      };

      if (existing.exists()) {
        await updateDoc(studentRef, payload);
      } else {
        await setDoc(studentRef, { ...payload, createdAt: serverTimestamp() });
      }

      alert("✅ Student created/updated successfully.");
      router.push(`/Teacher-dashboard/${teacherUid}`);
    } catch (err) {
      console.error("Error creating/updating student:", err);
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-50 rounded-md">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Create Student</h1>
        <Link href={`/Teacher-dashboard/${teacherUid}`} className="text-sm text-blue-600 flex items-center gap-1">
          <ArrowLeft size={14} /> Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label>Full Name</Label>
          <Input name="name" value={form.name} onChange={handleChange} required />
        </div>

        <div>
          <Label>USN</Label>
          <Input name="usn" value={form.usn} onChange={handleChange} />
        </div>

        <div>
          <Label>Email</Label>
          <Input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>

        <div>
          <Label>Password</Label>
          <Input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>

        <div>
          <Label>Department</Label>
          <Input name="department" value={form.department} onChange={handleChange} />
        </div>

        <div>
          <Label>Semester</Label>
          <Input name="semester" value={form.semester} onChange={handleChange} />
        </div>

        <div>
          <Label>Section</Label>
          <Input name="section" value={form.section} onChange={handleChange} />
        </div>

        <div>
          <Label>Phone</Label>
          <Input name="phone" value={form.phone} onChange={handleChange} />
        </div>

        <div className="flex gap-2 mt-2">
          <Button
            type="button"
            onClick={handleFingerprintRegister}
            disabled={processingFp}
            className={`flex-1 ${fingerprintRegistered ? "bg-green-600" : "bg-gray-700"}`}
          >
            <Fingerprint size={16} className="mr-2" /> {fingerprintRegistered ? "Fingerprint Registered" : processingFp ? "Processing..." : "Register Fingerprint"}
          </Button>

          <Button type="submit" disabled={loading} className="flex-1 bg-blue-600">
            {loading ? "Saving..." : "Create Student"}
          </Button>
        </div>
      </form>
    </div>
  );
}
