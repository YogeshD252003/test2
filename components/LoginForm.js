"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginForm({
  title = "Login",
  onSubmit,
  isLoading = false,
  error = "",
  signupUrl = "/",
  userType = "user",
  onBack,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleFormSubmit}
        className="w-full max-w-md bg-white p-6 rounded shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="example@email.com"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="********"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-gray-600 hover:underline"
            >
              Back
            </button>
          )}

          <Link href={signupUrl} className="text-blue-600 hover:underline">
            Don't have an account?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
