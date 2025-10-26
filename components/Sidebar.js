// components/Sidebar.js
"use client";

import React from "react";
import { Home, BookOpen, Clock, FileText, LogOut } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col justify-between">
      {/* Top Section */}
      <div>
        {/* Logo / App Name */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg font-bold">🎓</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">ClassMaster</h1>
            <p className="text-sm text-blue-600 font-medium">Teacher Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4 space-y-2">
          <Link
            href="/teacher/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <Home className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/teacher/create-session"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <BookOpen className="w-5 h-5" />
            Create Session
          </Link>
          <Link
            href="/teacher/active-sessions"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <Clock className="w-5 h-5" />
            Active Sessions
          </Link>
          <Link
            href="/teacher/reports"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <FileText className="w-5 h-5" />
            Reports
          </Link>
        </nav>
      </div>

      {/* Bottom User Section */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            Y
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">YOGESH D CSE</p>
            <p className="text-xs text-gray-500">sce22cs111@sairamtap.edu.in</p>
          </div>
          <button className="text-gray-500 hover:text-red-600 transition">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
