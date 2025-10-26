"use client";

import React from "react";
import Link from "next/link";
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
  Eye
} from "lucide-react";

export default function TeacherDashboard() {
  // Mock data for demonstration
  const stats = [
    { 
      label: "Total Students", 
      value: "142", 
      change: "+12%", 
      positive: true,
      icon: Users,
      color: "blue"
    },
    { 
      label: "Active Sessions", 
      value: "8", 
      change: "+2", 
      positive: true,
      icon: BookOpen,
      color: "emerald"
    },
    { 
      label: "Attendance Rate", 
      value: "94%", 
      change: "+3%", 
      positive: true,
      icon: Target,
      color: "violet"
    },
    { 
      label: "Pending Tasks", 
      value: "5", 
      change: "-2", 
      positive: false,
      icon: Clock,
      color: "amber"
    }
  ];

  const recentStudents = [
    { name: "Sarah Johnson", grade: "A", progress: 92, avatar: "SJ", status: "Excellent" },
    { name: "Michael Chen", grade: "B+", progress: 87, avatar: "MC", status: "Good" },
    { name: "Emma Wilson", grade: "A-", progress: 89, avatar: "EW", status: "Very Good" },
    { name: "James Rodriguez", grade: "B", progress: 84, avatar: "JR", status: "Good" }
  ];

  const upcomingSessions = [
    { title: "Mathematics Advanced", time: "10:00 AM", date: "Today", type: "Lecture", duration: "1h 30m" },
    { title: "Physics Lab", time: "2:00 PM", date: "Today", type: "Practical", duration: "2h" },
    { title: "Chemistry Review", time: "9:00 AM", date: "Tomorrow", type: "Review", duration: "1h" }
  ];

  const quickActions = [
    {
      title: "Add Student",
      description: "Enroll new student",
      icon: UserPlus,
      href: "/Teacher-dashboard/create-student",
      color: "blue",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "View Students",
      description: "Manage class roster",
      icon: Users,
      href: "/Teacher-dashboard/view-students",
      color: "emerald",
      gradient: "from-emerald-500 to-green-500"
    },
    {
      title: "Create Session",
      description: "Schedule new class",
      icon: BookOpen,
      href: "/CreateSession",
      color: "violet",
      gradient: "from-violet-500 to-purple-500"
    },
    {
      title: "Active Sessions",
      description: "Ongoing classes",
      icon: Clock,
      href: "/ActiveSessions",
      color: "orange",
      gradient: "from-orange-500 to-amber-500"
    },
    {
      title: "Reports",
      description: "Performance analytics",
      icon: FileText,
      href: "/Reports",
      color: "indigo",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      title: "Calendar",
      description: "View schedule",
      icon: Calendar,
      href: "/Calendar",
      color: "pink",
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  const colorMap = {
    blue: { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" },
    emerald: { bg: "bg-emerald-500", text: "text-emerald-600", light: "bg-emerald-50" },
    violet: { bg: "bg-violet-500", text: "text-violet-600", light: "bg-violet-50" },
    amber: { bg: "bg-amber-500", text: "text-amber-600", light: "bg-amber-50" },
    orange: { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50" },
    indigo: { bg: "bg-indigo-500", text: "text-indigo-600", light: "bg-indigo-50" },
    pink: { bg: "bg-pink-500", text: "text-pink-600", light: "bg-pink-50" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div className="mb-6 lg:mb-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Teacher Dashboard
            </h1>
          </div>
          <p className="text-slate-600 text-lg">Welcome back, <span className="font-semibold text-slate-800">Dr. Smith!</span> Here's your overview.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative flex-1 lg:flex-none">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search students, sessions..." 
              className="pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-80 shadow-sm"
            />
          </div>
          <Button variant="outline" size="icon" className="relative h-11 w-11 rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </Button>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg">
            DS
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Stats and Quick Actions */}
        <div className="xl:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const color = colorMap[stat.color];
              return (
                <Card key={index} className="bg-white/80 backdrop-blur-sm border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 group hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${color.light} group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 ${color.text}`} />
                      </div>
                      <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${stat.positive ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                        <TrendingUp className={`w-3 h-3 mr-1 ${!stat.positive && 'rotate-180'}`} />
                        {stat.change}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                    <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${color.bg}`}
                        style={{ width: `${parseInt(stat.value)}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/80 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                Quick Actions
              </CardTitle>
              <CardDescription className="text-slate-600">Manage your classroom efficiently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link key={index} href={action.href}>
                      <Button className="w-full flex items-center justify-between p-5 h-auto bg-white hover:shadow-lg border border-slate-200/80 group hover:scale-105 transition-all duration-300 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient} shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-slate-800 group-hover:text-slate-900">{action.title}</div>
                            <div className="text-sm text-slate-600 mt-1">{action.description}</div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Student Performance */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/80 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-green-500 rounded-full"></div>
                    Student Performance
                  </CardTitle>
                  <CardDescription className="text-slate-600">Overall class progress this month</CardDescription>
                </div>
                <Button variant="outline" className="rounded-lg border-slate-200">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl border-2 border-dashed border-slate-200/60 p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <BarChart3 className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Interactive Performance Analytics</h3>
                  <p className="text-slate-600 mb-4">Visualize student progress with detailed charts and insights</p>
                  <div className="flex justify-center gap-3">
                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl">
                      Generate Report
                    </Button>
                    <Button variant="outline" className="rounded-xl border-slate-200">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recent Activity and Upcoming */}
        <div className="space-y-8">
          {/* Recent Students */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/80 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-violet-500 to-purple-500 rounded-full"></div>
                Recent Students
              </CardTitle>
              <CardDescription className="text-slate-600">Recently active students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentStudents.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200/60 hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center font-semibold text-white shadow-lg">
                          {student.avatar}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 group-hover:text-slate-900">{student.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-slate-600">Grade: {student.grade}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                            {student.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-semibold text-slate-800">{student.progress}%</span>
                      </div>
                      <div className="w-20 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-1000" 
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6 rounded-xl border-slate-200 hover:border-slate-300">
                <Eye className="w-4 h-4 mr-2" />
                View All Students
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200/80 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full"></div>
                Upcoming Sessions
              </CardTitle>
              <CardDescription className="text-slate-600">Your schedule for today and tomorrow</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200/60 hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                        session.type === 'Lecture' ? 'bg-blue-500/10 text-blue-600' :
                        session.type === 'Practical' ? 'bg-emerald-500/10 text-emerald-600' :
                        'bg-amber-500/10 text-amber-600'
                      }`}>
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 group-hover:text-slate-900">{session.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-slate-600">{session.time}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                            {session.duration}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 mt-1">{session.date}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6 rounded-xl border-slate-200 hover:border-slate-300">
                <Calendar className="w-4 h-4 mr-2" />
                View Full Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Weekly Summary */}
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Weekly Summary</h3>
                  <p className="text-slate-300 text-sm">Your teaching performance</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: "Classes Taught", value: "18", icon: BookOpen },
                  { label: "Assignments Graded", value: "42", icon: FileText },
                  { label: "Student Questions", value: "26", icon: MessageSquare },
                  { label: "Average Rating", value: "4.8/5", icon: Star }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-slate-300" />
                        <span className="text-slate-300">{item.label}</span>
                      </div>
                      <span className="font-semibold text-white">{item.value}</span>
                    </div>
                  );
                })}
              </div>
              
              <Button className="w-full mt-6 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-xl border-white/20">
                View Detailed Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}