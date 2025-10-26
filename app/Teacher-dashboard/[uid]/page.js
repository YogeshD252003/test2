"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UserPlus,
  Users,
  BookOpen,
  Clock,
  FileText,
  TrendingUp,
  Calendar,
  Bell,
  Search,
  MoreHorizontal,
  ChevronRight,
  Star,
  Target,
  BarChart3,
  MessageSquare,
  Download,
  Eye,
} from "lucide-react";

export default function TeacherDashboard() {
  const params = useParams();
  const router = useRouter();
  const uid = params?.uid; // safely unwrap params
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);

  // Color map for cards
  const colorMap = {
    blue: { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" },
    emerald: { bg: "bg-emerald-500", text: "text-emerald-600", light: "bg-emerald-50" },
    violet: { bg: "bg-violet-500", text: "text-violet-600", light: "bg-violet-50" },
    amber: { bg: "bg-amber-500", text: "text-amber-600", light: "bg-amber-50" },
    orange: { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50" },
    indigo: { bg: "bg-indigo-500", text: "text-indigo-600", light: "bg-indigo-50" },
    pink: { bg: "bg-pink-500", text: "text-pink-600", light: "bg-pink-50" },
  };

  // Fetch data from Firebase
  useEffect(() => {
    if (!uid) return;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || user.uid !== uid) {
        router.push("/teacher/login");
        return;
      }

      try {
        // Fetch teacher info
        const teacherRef = doc(db, "teachers", uid);
        const teacherSnap = await getDoc(teacherRef);
        if (!teacherSnap.exists()) {
          router.push("/teacher/login");
          return;
        }
        setTeacher(teacherSnap.data());

        // Fetch students
        const studentsQuery = query(collection(db, "students"), where("teacherId", "==", uid));
        const studentsSnap = await getDocs(studentsQuery);
        setStudents(studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch sessions
        const sessionsQuery = query(collection(db, "sessions"), where("teacherId", "==", uid));
        const sessionsSnap = await getDocs(sessionsQuery);
        setSessions(sessionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [uid, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/teacher/login");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <BarChart3 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  if (!teacher) return null;

  // Prepare dynamic data for UI
  const stats = [
    {
      label: "Total Students",
      value: students.length,
      change: "+12%",
      positive: true,
      icon: Users,
      color: "blue",
    },
    {
      label: "Active Sessions",
      value: sessions.filter(s => s.status === "active").length,
      change: "+2",
      positive: true,
      icon: BookOpen,
      color: "emerald",
    },
    {
      label: "Attendance Rate",
      value: teacher.attendance || "90%",
      change: "+3%",
      positive: true,
      icon: Target,
      color: "violet",
    },
    {
      label: "Pending Tasks",
      value: teacher.pendingTasks || 0,
      change: "-2",
      positive: false,
      icon: Clock,
      color: "amber",
    },
  ];

  const recentStudents = students.slice(0, 4).map((s) => ({
    name: s.name,
    grade: s.grade || "N/A",
    progress: s.progress || 0,
    avatar: s.name.split(" ").map(n => n[0]).join(""),
    status: s.status || "Good",
  }));

  const upcomingSessions = sessions
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const quickActions = [
    { title: "Add Student", description: "Enroll new student", icon: UserPlus, href: `/Teacher-dashboard/create-student`, gradient: "from-blue-500 to-cyan-500" },
    { title: "View Students", description: "Manage class roster", icon: Users, href: `/Teacher-dashboard/view-students`, gradient: "from-emerald-500 to-green-500" },
    { title: "Create Session", description: "Schedule new class", icon: BookOpen, href: "Teacher-dashboard/CreateSession", gradient: "from-violet-500 to-purple-500" },
    { title: "Active Sessions", description: "Ongoing classes", icon: Clock, href: "/ActiveSessions", gradient: "from-orange-500 to-amber-500" },
    { title: "Reports", description: "Performance analytics", icon: FileText, href: "/Reports", gradient: "from-indigo-500 to-blue-500" },
    { title: "Calendar", description: "View schedule", icon: Calendar, href: "/Calendar", gradient: "from-pink-500 to-rose-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div className="mb-6 lg:mb-0">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-800">Welcome, {teacher.name} 👋</h1>
          <p className="text-slate-600">Here's your teaching overview</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleLogout} className="bg-red-500 text-white hover:bg-red-600">Logout</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const color = colorMap[stat.color];
              return (
                <Card key={index} className="bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 group hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${color.light}`}>
                        <Icon className={`w-6 h-6 ${color.text}`} />
                      </div>
                      <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${stat.positive ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        {stat.change}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800">Quick Actions</CardTitle>
              <CardDescription className="text-slate-600">Manage your classroom efficiently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link key={index} href={action.href}>
                      <Button className={`w-full flex items-center justify-between p-5 h-auto bg-white hover:shadow-lg rounded-xl`}>
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient} shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-slate-800">{action.title}</div>
                            <div className="text-sm text-slate-600 mt-1">{action.description}</div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Recent Students */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800">Recent Students</CardTitle>
              <CardDescription className="text-slate-600">Recently active students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentStudents.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200/60 hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center font-semibold text-white shadow-lg">
                        {student.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{student.name}</p>
                        <p className="text-sm text-slate-600">Grade: {student.grade}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-slate-800">{student.progress}%</span>
                      <div className="w-20 bg-slate-200 rounded-full h-2 mt-1">
                        <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${student.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6 rounded-xl border-slate-200 hover:border-slate-300">
                <Eye className="w-4 h-4 mr-2" /> View All Students
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800">Upcoming Sessions</CardTitle>
              <CardDescription className="text-slate-600">Your schedule for today and tomorrow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200/60 hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                      <Clock className="w-6 h-6 text-blue-500" />
                      <div>
                        <p className="font-semibold text-slate-800">{session.title}</p>
                        <p className="text-sm text-slate-600">{session.date} - {session.time}</p>
                        <p className="text-xs text-slate-500">{session.duration}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="w-5 h-5" /></Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6 rounded-xl border-slate-200 hover:border-slate-300">
                <Calendar className="w-4 h-4 mr-2" /> View Full Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
