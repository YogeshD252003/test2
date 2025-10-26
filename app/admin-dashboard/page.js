"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  LayoutDashboard,
  UserPlus,
  Users,
  GraduationCap,
  BookOpen,
  BarChart3,
  LogOut,
  Activity,
  ChevronRight,
  Search,
  Bell,
  Settings,
  Sparkles,
  Crown,
  Zap,
  Target,
} from "lucide-react";

// ----------------- StatsCard -----------------
function StatsCard({ title, value, icon: Icon, color, trend, isLoading }) {
  const colorVariants = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-emerald-500 to-teal-500",
    purple: "from-violet-500 to-purple-500",
    orange: "from-amber-500 to-orange-500",
    pink: "from-pink-500 to-rose-500",
  };

  const glowVariants = {
    blue: "hover:shadow-lg hover:shadow-blue-500/25",
    green: "hover:shadow-lg hover:shadow-emerald-500/25",
    purple: "hover:shadow-lg hover:shadow-violet-500/25",
    orange: "hover:shadow-lg hover:shadow-amber-500/25",
    pink: "hover:shadow-lg hover:shadow-pink-500/25",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`bg-white rounded-2xl p-6 border border-slate-200/60 backdrop-blur-sm ${glowVariants[color]} transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorVariants[color]} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <Sparkles className="w-4 h-4 text-slate-400" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        {isLoading ? (
          <div className="h-8 bg-slate-200 rounded-lg animate-pulse"></div>
        ) : (
          <motion.h3
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-slate-900"
          >
            {value}
          </motion.h3>
        )}
        <p className="text-xs text-slate-500 flex items-center gap-1">
          <Zap className="w-3 h-3 text-green-500" />
          {trend}
        </p>
      </div>
    </motion.div>
  );
}

// ----------------- Sidebar -----------------
function Sidebar() {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="h-screen w-72 bg-gradient-to-b from-slate-900 to-purple-900 shadow-2xl flex flex-col justify-between relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>

      <div className="relative z-10">
        <div className="px-6 py-8 flex items-center gap-3 border-b border-white/10">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-2xl shadow-lg">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">EduAdmin</h1>
            <p className="text-xs text-purple-200">Teacher Management Portal</p>
          </div>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          <div>
            <p className="text-xs font-semibold text-purple-300 mb-3 px-3">DASHBOARD</p>
            <Link
              href="/side-bar-admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white backdrop-blur-sm border border-white/20 shadow-lg"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Link>
          </div>

          <div>
            <p className="text-xs font-semibold text-purple-300 mb-3 px-3">TEACHERS</p>
            <div className="space-y-2">
              <Link
                href="/side-bar-admin/create-teachers"
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

          <div>
            <p className="text-xs font-semibold text-purple-300 mb-3 px-3">STUDENTS</p>
            <div className="space-y-2">
              <Link
                href="/side-bar-admin/create-student"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-purple-100 hover:bg-white/5 hover:border-white/10 border border-transparent transition-all duration-200"
              >
                <GraduationCap className="w-5 h-5" />
                Create Student
              </Link>
              <Link
                href="/side-bar-admin/view-students"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-purple-100 hover:bg-white/5 hover:border-white/10 border border-transparent transition-all duration-200"
              >
                <BookOpen className="w-5 h-5" />
                View Students
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-purple-300 mb-3 px-3">ANALYTICS</p>
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
            <Link href="/app/page.js">
            <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <LogOut className="w-4 h-4 text-purple-200" />
            </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ----------------- QuickOverview -----------------
function QuickOverview({ teachers }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" />
          Quick Overview
        </h2>
        <button className="text-sm text-purple-600 font-medium hover:text-purple-700 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {teachers.slice(0, 4).map((teacher) => (
          <motion.div
            key={teacher.id}
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all duration-200"
          >
            <div
              className={`w-3 h-3 rounded-full ${
                teacher.status === "active" ? "bg-green-500" : "bg-slate-300"
              }`}
            ></div>
            <div className="flex-1">
              <h3 className="font-medium text-slate-900">{teacher.name}</h3>
              <p className="text-sm text-slate-600">
                {teacher.department} • {teacher.subject}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                teacher.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {teacher.status}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ----------------- RecentActivity -----------------
function RecentActivity() {
  const activities = [
    { type: "teacher_added", name: "Sarah Wilson", time: "2 min ago", department: "Science" },
    { type: "teacher_updated", name: "Mike Johnson", time: "1 hour ago", department: "Math" },
    { type: "student_created", name: "Class 10-B", time: "3 hours ago", department: "All" },
    { type: "report_generated", name: "Monthly Report", time: "5 hours ago", department: "Analytics" },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "teacher_added":
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case "teacher_updated":
        return <Users className="w-4 h-4 text-blue-500" />;
      case "student_created":
        return <GraduationCap className="w-4 h-4 text-purple-500" />;
      case "report_generated":
        return <BarChart3 className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <motion.div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-500" />
          Recent Activity
        </h2>
        <Bell className="w-5 h-5 text-slate-400" />
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="p-2 rounded-lg bg-slate-100">{getActivityIcon(activity.type)}</div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-slate-900">{activity.name}</h3>
              <p className="text-xs text-slate-500">{activity.department}</p>
            </div>
            <span className="text-xs text-slate-400">{activity.time}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ----------------- Admin Dashboard Page -----------------
export default function DashboardPage() {
  const teachers = [
    { id: 1, name: "John Doe", department: "Math", subject: "Algebra", status: "active" },
    { id: 2, name: "Jane Smith", department: "Science", subject: "Physics", status: "inactive" },
    { id: 3, name: "Alice Johnson", department: "Math", subject: "Geometry", status: "active" },
    { id: 4, name: "Bob Brown", department: "English", subject: "Literature", status: "active" },
    { id: 5, name: "Sarah Wilson", department: "Science", subject: "Chemistry", status: "active" },
  ];

  const stats = {
    totalTeachers: teachers.length,
    activeTeachers: teachers.filter((t) => t.status === "active").length,
    totalDepartments: [...new Set(teachers.map((t) => t.department))].length,
    totalSubjects: [...new Set(teachers.map((t) => t.subject))].length,
  };

  return (
    <div className="flex bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 space-y-8">
        <div className="max-w-7xl mx-auto">
          <motion.div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-purple-600 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <p className="text-slate-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Welcome back! Here's what's happening with your teacher management system.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                />
              </div>
              <button className="p-2 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
                <Bell className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Teachers"
              value={stats.totalTeachers}
              icon={Users}
              color="purple"
              trend="+5% from last month"
            />
            <StatsCard
              title="Active Teachers"
              value={stats.activeTeachers}
              icon={Activity}
              color="green"
              trend={`${Math.round((stats.activeTeachers / stats.totalTeachers) * 100)}% active rate`}
            />
            <StatsCard
              title="Departments"
              value={stats.totalDepartments}
              icon={GraduationCap}
              color="blue"
              trend="Across all faculties"
            />
            <StatsCard
              title="Subjects"
              value={stats.totalSubjects}
              icon={BookOpen}
              color="pink"
              trend="Different subjects taught"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <QuickOverview teachers={teachers} />
            </div>
            <div>
              <RecentActivity />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
