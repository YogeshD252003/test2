"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Eye, EyeOff, Lock, User, ArrowLeft } from "lucide-react";

export default function TeacherLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Authenticate
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      const uid = user.uid;

      // Check Firestore teacher record
      const teacherRef = doc(db, "teachers", uid);
      const teacherSnap = await getDoc(teacherRef);

      if (!teacherSnap.exists()) {
        setError("No teacher record found. Please contact admin.");
        setLoading(false);
        return;
      }

      // Redirect to unique dashboard
      router.push(`/Teacher-dashboard/${uid}`);
    } catch (err) {
      console.error("Login Error:", err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1 text-blue-600 mb-4 hover:underline"
        >
          <ArrowLeft size={18} /> Back Home
        </button>

        <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Teacher Login
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-3 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative mt-1">
              <User className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="teacher@example.com"
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-500"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-all"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
