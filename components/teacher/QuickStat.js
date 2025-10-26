import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Clock, TrendingUp } from "lucide-react";

export default function QuickStats({ students, sessions, attendanceRecords }) {
  const totalStudents = students.length;
  const totalSessions = sessions.length;
  const activeSessions = sessions.filter(s => s.status === "active").length;
  const averageAttendance = attendanceRecords.length > 0 
    ? ((attendanceRecords.filter(r => r.status === "present").length / attendanceRecords.length) * 100).toFixed(1)
    : 0;

  const stats = [
    {
      title: "Total Students",
      value: totalStudents.toString(),
      icon: Users,
      color: "from-blue-500 to-indigo-500",
      change: "+12% this month"
    },
    {
      title: "Total Sessions",
      value: totalSessions.toString(),
      icon: BookOpen,
      color: "from-emerald-500 to-teal-500",
      change: "+8% this week"
    },
    {
      title: "Active Sessions",
      value: activeSessions.toString(),
      icon: Clock,
      color: "from-purple-500 to-pink-500",
      change: "Live now"
    },
    {
      title: "Average Attendance",
      value: `${averageAttendance}%`,
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
      change: "+5% improvement"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 bg-gradient-to-r ${stat.color} rounded-full opacity-10`} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-20`}>
              <stat.icon className={`w-4 h-4 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <p className="text-xs text-green-600 font-medium">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}