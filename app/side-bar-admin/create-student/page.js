"use client";

import React, { useState } from "react";

import { collection, addDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/firebaseConfig";

import { ArrowLeft, Fingerprint } from "lucide-react";
import Link from "next/link";

export default function CreateStudentPage() {
  const [form, setForm] = useState({
    name: "",
    usn: "",
    email: "",
    phone: "",
    password: "",
    department: "",
    section: "",
    semester: "",
  });
  const [loading, setLoading] = useState(false);
  const [fingerRegistered, setFingerRegistered] = useState(false);
  const [createdStudentId, setCreatedStudentId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "students"), {
        ...form,
        createdAt: serverTimestamp(),
      });
      setCreatedStudentId(docRef.id);
      alert("✅ Student created successfully!");
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Error adding student");
    } finally {
      setLoading(false);
    }
  };

  const handleFingerprintRegister = async () => {
    if (!createdStudentId) {
      alert("Please create the student first before adding fingerprint.");
      return;
    }

    try {
      const publicKey = {
        challenge: new Uint8Array(32),
        rp: { name: "EduTrack" },
        user: {
          id: new TextEncoder().encode(createdStudentId),
          name: form.email,
          displayName: form.name,
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "preferred",
        },
        timeout: 60000,
      };

      const credential = await navigator.credentials.create({ publicKey });

      const credentialData = {
        id: credential.id,
        type: credential.type,
        transports: credential.response.getTransports
          ? credential.response.getTransports()
          : [],
      };

      await updateDoc(doc(db, "students", createdStudentId), {
        fingerprintData: credentialData,
      });

      setFingerRegistered(true);
      alert("✅ Fingerprint registered successfully!");
    } catch (err) {
      console.error("Fingerprint registration failed:", err);
      alert("❌ Fingerprint registration failed. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Create Student</CardTitle>
          <Link href="/teacher/dashboard" className="text-sm text-blue-500 flex items-center gap-1">
            <ArrowLeft size={16} /> Back
          </Link>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {["name", "usn", "email", "phone", "password", "department", "section", "semester"].map((field) => (
              <div key={field}>
                <Label className="capitalize">{field}</Label>
                <Input
                  name={field}
                  type={field === "password" ? "password" : "text"}
                  value={form[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Student"}
            </Button>
          </form>

          {createdStudentId && (
            <div className="mt-6 text-center">
              <Button
                onClick={handleFingerprintRegister}
                variant={fingerRegistered ? "secondary" : "default"}
                className="flex items-center gap-2 mx-auto"
              >
                <Fingerprint size={18} />
                {fingerRegistered ? "Fingerprint Registered ✅" : "Register Fingerprint"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
