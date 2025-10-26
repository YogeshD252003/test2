"use client";
import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  LogOut,
  Settings,
  Crown,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function SideBarLayout({ children }) {
  return (
    <div className="flex bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 min-h-screen">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="h-screen w-72 bg-gradient-to-b from-slate-900 to-purple-900 shadow-2xl flex flex-col justify-between relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>

        {/* Logo / Header */}
        <div className="relative z-10">
          <div className="px-6 py-8 flex items-center gap-3 border-b border-white/10">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-2xl shadow-lg">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">EduAdmin</h1>
              <p className="text-xs text-purple-200">Admin Portal</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="mt-8 px-4 space-y-2">
            {/* Dashboard */}
            <div>
              <p className="text-xs font-semibold text-purple-300 mb-3 px-3">
                DASHBOARD
              </p>
              <Link
                href="/side-bar-admin"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white backdrop-blur-sm border border-white/20 shadow-lg"
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
                <ChevronRight className="w-4 h-4 ml-auto" />
              </Link>
            </div>

            {/* Teachers */}
            <div>
              <p className="text-xs font-semibold text-purple-300 mb-3 px-3">
                TEACHERS
              </p>
              <div className="space-y-2">
                <Link
                  href="/side-bar-admin/create-teacher"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-purple-100 hover:bg-white/5 hover:border-white/10 border border-transparent transition-all duration-200"
                >
                  <UserPlus className="w-5 h-5" />
                  Create Teacher
                </Link>
                <Link
                  href="/side-bar-admin/view-teacher"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-purple-100 hover:bg-white/5 hover:border-white/10 border border-transparent transition-all duration-200"
                >
                  <Users className="w-5 h-5" />
                  View Teachers
                </Link>
              </div>
            </div>

            {/* Students */}
            <div>
              <p className="text-xs font-semibold text-purple-300 mb-3 px-3">
                STUDENTS
              </p>
              <div className="space-y-2">
                <Link
                  href="/side-bar-admin/create-student"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-purple-100 hover:bg-white/5 hover:border-white/10 border border-transparent transition-all duration-200"
                >
                  <GraduationCap className="w-5 h-5" />
                  Create Student
                </Link>
                <Link
                  href="/side-bar-admin/view-student"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-purple-100 hover:bg-white/5 hover:border-white/10 border border-transparent transition-all duration-200"
                >
                  <BookOpen className="w-5 h-5" />
                  View Students
                </Link>
              </div>
            </div>

            {/* Analytics */}
            <div>
              <p className="text-xs font-semibold text-purple-300 mb-3 px-3">
                ANALYTICS
              </p>
              <Link
                href="/side-bar-admin/analytics"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-purple-100 hover:bg-white/5 hover:border-white/10 border border-transparent transition-all duration-200"
              >
                <BarChart3 className="w-5 h-5" />
                Reports & Analytics
              </Link>
            </div>
          </nav>
        </div>

        {/* Footer User Info */}
        <div className="relative z-10 p-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-purple-200">System Administrator</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <Settings className="w-4 h-4 text-purple-200" />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <LogOut className="w-4 h-4 text-purple-200" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Page Content (child pages) */}
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
