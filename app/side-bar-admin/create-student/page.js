"use client";

import React, { useState } from "react";
import { auth, db } from "../../../lib/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";

const allDepartments = [
  "CSE","ECE","ME","CE","EEE","IT","ISE","AIML","ET",
  "AI & DS","Cybersecurity","Biotechnology","Automobile","Aerospace","Biomedical","Mechatronics","Chemical"
];

export default function CreateStudentPage() {
  const [formData, setFormData] = useState({
    name: "", usn: "", email: "", password: "",
    department: "", semester: "", section: "", phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // 1️⃣ Create student in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const uid = userCredential.user.uid;

      // 2️⃣ Save student data in Firestore using UID as doc id
      await setDoc(doc(db, "students", uid), {
        ...formData,
        createdAt: new Date().toISOString(),
        uid
      });

      setMessage("✅ Student created successfully in Auth & Database!");
      setFormData({
        name: "", usn: "", email: "", password: "",
        department: "", semester: "", section: "", phone: ""
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create student: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Create Student</h1>
          <p className="text-gray-600">Fill in the student details below.</p>
        </div>
        <Link href="/Teacher-dashboard">
          <Button variant="outline" className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </Link>
      </div>

      <Card className="max-w-4xl mx-auto bg-white/80 p-6 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <UserPlus className="w-6 h-6 text-blue-600" />
            Student Registration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="usn">USN</Label>
              <Input id="usn" name="usn" value={formData.usn} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <select id="department" name="department" value={formData.department} onChange={handleChange} required className="w-full rounded-md border py-2 px-3">
                <option value="">Select Department</option>
                {allDepartments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="semester">Semester</Label>
              <select id="semester" name="semester" value={formData.semester} onChange={handleChange} required className="w-full rounded-md border py-2 px-3">
                <option value="">Select Semester</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="section">Section</Label>
              <Input id="section" name="section" placeholder="A/B/C/D" value={formData.section} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
            </div>

            <div className="sm:col-span-2">
              <Button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-xl">
                {loading ? "Creating..." : "Create Student"}
              </Button>
            </div>
          </form>

          {message && <p className="mt-4 text-center">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
