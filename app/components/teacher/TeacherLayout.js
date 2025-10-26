"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, Clock, FileText } from "lucide-react";

export default function TeacherLayout({ children }) {
  const pathname = usePathname();

  const currentTeacher = {
    name: "John Doe",
    email: "johndoe@example.com",
  };

  const isActive = (route) => pathname === route;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r shadow-md flex flex-col justify-between">
        <div>
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-blue-600">ClassMaster</h1>
            <p className="text-sm text-gray-500">Teacher Portal</p>
          </div>

          <nav className="px-4 py-4 space-y-2">
            <Link href="/teacher-dashboard">
              <Button
                variant={isActive("/teacher-dashboard") ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>

            <Link href="/create-session">
              <Button
                variant={isActive("/create-session") ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Create Session
              </Button>
            </Link>

            <Link href="/active-sessions">
              <Button
                variant={isActive("/active-sessions") ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <Clock className="w-4 h-4 mr-2" />
                Active Sessions
              </Button>
            </Link>

            <Link href="/reports">
              <Button
                variant={isActive("/reports") ? "default" : "ghost"}
                className="w-full justify-start"
              >
                <FileText className="w-4 h-4 mr-2" />
                Reports
              </Button>
            </Link>
          </nav>
        </div>

        {/* Profile Footer */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-3">
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
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
