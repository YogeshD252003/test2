"use client";

import React, { useState } from "react";
import { auth, db } from "@/app/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, User, Mail, Phone, Lock, BookOpen, Building, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function CreateTeacherPage() {
  const [teacher, setTeacher] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    department: "",
    subject: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setTeacher({ ...teacher, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Create in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        teacher.email,
        teacher.password
      );
      const uid = userCredential.user.uid;

      // 2️⃣ Save in Firestore with UID
      await setDoc(doc(db, "teachers", uid), {
        ...teacher,
        createdAt: new Date().toISOString(),
        uid,
      });

      alert("✅ Teacher created successfully in Auth & Firestore!");
      setTeacher({ name: "", email: "", phone: "", password: "", department: "", subject: "" });
    } catch (error) {
      console.error(error);
      alert("❌ Failed to create teacher: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Teacher</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <Label>Full Name</Label>
            <Input name="name" value={teacher.name} onChange={handleChange} required />
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input name="email" type="email" value={teacher.email} onChange={handleChange} required />
          </div>

          {/* Phone */}
          <div>
            <Label>Phone</Label>
            <Input name="phone" type="tel" value={teacher.phone} onChange={handleChange} required />
          </div>

          {/* Department */}
          <div>
            <Label>Department</Label>
            <Input name="department" value={teacher.department} onChange={handleChange} required />
          </div>

          {/* Subject */}
          <div>
            <Label>Subject</Label>
            <Input name="subject" value={teacher.subject} onChange={handleChange} required />
          </div>

          {/* Password */}
          <div>
            <Label>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={teacher.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 text-white py-2" disabled={loading}>
            {loading ? "Creating..." : "Create Teacher"}
          </Button>

          <Link href="/TeacherDashboard">
            <Button type="button" variant="outline" className="w-full mt-2">
              Back to Dashboard
            </Button>
          </Link>
        </form>
      </div>
    </div>
  );
}
