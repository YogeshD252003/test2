"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ To highlight active link
import { Button } from "@/components/ui/button";
import { Home, BookOpen, Clock, FileText } from "lucide-react";



export default function TeacherLayout({ children }) {
  const pathname = usePathname(); // get current route

  const currentTeacher = {
    name: "John Doe",
    email: "johndoe@example.com",
  };

  // helper to check active page
  const isActive = (route) => pathname === route;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm flex flex-col justify-between">
        <div>
          <div className="px-6 py-4">
            <h1 className="text-xl font-bold text-blue-600">ClassMaster</h1>
            <p className="text-sm text-gray-500">Teacher Portal</p>
          </div>
          <nav className="px-4 space-y-2">
            <Link href="/Teacher-dashboard">
              <Button
                variant={isActive("/Teacher-dashboard") ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>

            <Link href="/CreateSession">
              <Button
                variant={isActive("/CreateSession") ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Create Session
              </Button>
            </Link>

            <Link href="/ActiveSessions">
              <Button
                variant={isActive("/ActiveSessions") ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <Clock className="w-4 h-4 mr-2" />
                Active Sessions
              </Button>
            </Link>

            <Link href="/Reports">
              <Button
                variant={isActive("/Reports") ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <FileText className="w-4 h-4 mr-2" />
                Reports
              </Button>
            </Link>
          </nav>
        </div>

        {/* Profile Footer */}
        <div className="px-4 py-3 border-t flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {currentTeacher.name[0]}
          </div>
          <div>
            <p className="font-medium">{currentTeacher.name}</p>
            <p className="text-xs text-gray-500">{currentTeacher.email}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 bg-gray-50 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
