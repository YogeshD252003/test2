"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Activity,
  GraduationCap,
  BookOpen,
  Sparkles,
  Search,
  Bell,
  Target,
  Zap,
} from "lucide-react";

// StatsCard Component
function StatsCard({ title, value, icon: Icon, color, trend }) {
  const colors = {
    purple: "from-violet-500 to-purple-500",
    green: "from-emerald-500 to-teal-500",
    blue: "from-blue-500 to-cyan-500",
    pink: "from-pink-500 to-rose-500",
  };
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colors[color]} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <Sparkles className="w-4 h-4 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
        <Zap className="w-3 h-3 text-green-500" />
        {trend}
      </p>
    </motion.div>
  );
}

// Page Component
export default function DashboardPage() {
  const [isLoading] = useState(false);

  const stats = {
    totalTeachers: 22,
    activeTeachers: 18,
    totalDepartments: 5,
    totalSubjects: 12,
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-10"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-purple-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Welcome back! Here’s your admin summary.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
          <button className="p-2 rounded-xl border border-slate-200 bg-white/80 hover:shadow-lg transition-all">
            <Bell className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          trend="82% active rate"
        />
        <StatsCard
          title="Departments"
          value={stats.totalDepartments}
          icon={GraduationCap}
          color="blue"
          trend="All faculties"
        />
        <StatsCard
          title="Subjects"
          value={stats.totalSubjects}
          icon={BookOpen}
          color="pink"
          trend="Taught this term"
        />
      </div>
    </div>
  );
}
