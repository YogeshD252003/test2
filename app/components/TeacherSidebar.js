"use client";

import React from "react";
import { Home, Users, CalendarCheck, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Next.js hook

const TeacherSidebar = () => {
  const pathname = usePathname(); // ✅ Replaces useLocation()

  const menuItems = [
    { name: "Dashboard", icon: <Home size={22} />, path: "/Teacher-dashboard" },
    { name: "Attendance", icon: <CalendarCheck size={22} />, path: "/Teacher-dashboard/attendance" },
    { name: "Create Session", icon: <Users size={22} />, path: "/Teacher-dashboard/create-session" },
    { name: "Settings", icon: <Settings size={22} />, path: "/Teacher-dashboard/settings" },
  ];

  return (
    <div className="h-screen w-72 bg-gradient-to-b from-blue-600 to-blue-800 text-white flex flex-col shadow-2xl rounded-r-2xl">
      {/* Header */}
      <div className="p-6 border-b border-blue-400">
        <h1 className="text-2xl font-bold tracking-wide">Teacher Panel</h1>
        <p className="text-sm text-blue-200 mt-1">Smart Attendance System</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-3 mt-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.path}
            className={`flex items-center gap-3 px-4 py-3 text-lg rounded-xl transition-all duration-300 ${
              pathname === item.path
                ? "bg-blue-500 shadow-md font-semibold"
                : "hover:bg-blue-500/40"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-blue-400">
        <button className="flex items-center gap-3 w-full px-4 py-3 bg-blue-700 hover:bg-blue-600 rounded-xl transition">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default TeacherSidebar;
