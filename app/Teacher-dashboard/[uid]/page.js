"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseConfig";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Users,
  BookOpen,
  Clock,
  FileText,
  Calendar,
  LogOut,
} from "lucide-react";
import Link from "next/link";

export default function TeacherDashboard() {
  const router = useRouter();
  const { uid } = useParams();

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.uid === uid) {
        setTeacher(user);
      } else {
        router.push("/teacher/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [uid, router]);

  // ✅ Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  // ✅ Logout Handler
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/teacher/login");
  };

  // ✅ Dashboard quick actions
  const quickActions = [
    {
      title: "Add Student",
      description: "Enroll new student",
      icon: UserPlus,
      href: `/Teacher-dashboard/${uid}/create-student`,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "View Students",
      description: "Manage class roster",
      icon: Users,
      href: `/Teacher-dashboard/${uid}/view-students`,
      gradient: "from-emerald-500 to-green-500",
    },
    {
      title: "Create Session",
      description: "Schedule new class",
      icon: BookOpen,
      href: `/Teacher-dashboard/${uid}/CreateSession`,
      gradient: "from-violet-500 to-purple-500",
    },
    {
      title: "Active Sessions",
      description: "Ongoing classes",
      icon: Clock,
      href: `/Teacher-dashboard/${uid}/active-sessions`,
      gradient: "from-orange-500 to-amber-500",
    },
    {
      title: "Reports",
      description: "Performance analytics",
      icon: FileText,
      href: `/Teacher-dashboard/${uid}/reports`,
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      title: "Calendar",
      description: "View schedule",
      icon: Calendar,
      href: `/Teacher-dashboard/${uid}/calendar`,
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold tracking-tight">
            Teacher Dashboard
          </h1>
          <Button
            variant="outline"
            className="text-white border-gray-500 hover:bg-gray-700"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>

        {/* Welcome Message */}
        <Card className="bg-slate-800/50 border border-slate-700 text-white shadow-lg">
          <CardHeader>
            <CardTitle>Welcome, {teacher?.email || "Teacher"}</CardTitle>
            <CardDescription className="text-slate-400">
              Manage your students, classes, and sessions efficiently.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Add Student Button */}
        <div className="flex justify-end">
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
            onClick={() => router.push(`/Teacher-dashboard/${uid}/create-student`)}
          >
            <UserPlus className="w-4 h-4 mr-2" /> Add New Student
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="group bg-slate-800/60 border border-slate-700 hover:bg-slate-700 transition-all duration-300 hover:scale-[1.03]">
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.gradient} flex items-center justify-center mb-4`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{action.title}</CardTitle>
                  <CardDescription className="text-slate-400">
                    {action.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
