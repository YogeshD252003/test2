"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/app/firebaseConfig";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Clock, 
  Users, 
  Calendar, 
  BookOpen, 
  CheckCircle, 
  Search,
  BarChart3,
  User,
  Bell,
  Settings
} from "lucide-react";

export default function StudentDashboard() {
  const [sessions, setSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [presentMarked, setPresentMarked] = useState({});
  const [showSessions, setShowSessions] = useState(false);
  const [studentInfo, setStudentInfo] = useState({
    name: "Alex Johnson",
    rollNo: "2023001",
    semester: "5th",
    section: "A",
    department: "Computer Science"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalPresent: 0,
    totalSessions: 0,
    attendancePercentage: 0
  });
  const [activeTab, setActiveTab] = useState("active");

  // Fetch student attendance history and stats
  useEffect(() => {
    const fetchAttendanceStats = async () => {
      try {
        const sessionsSnapshot = await getDocs(collection(db, "sessions"));
        let presentCount = 0;
        
        for (const sessionDoc of sessionsSnapshot.docs) {
          const attendanceRef = doc(db, "sessions", sessionDoc.id, "attendance", studentInfo.rollNo);
          // In a real app, you'd fetch this document to check if marked present
          // For demo, we'll simulate some data
        }
        
        // Simulated stats
        setStats({
          totalPresent: 45,
          totalSessions: 50,
          attendancePercentage: 90
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchAttendanceStats();
  }, [studentInfo.rollNo]);

  // Fetch active sessions in real-time
  useEffect(() => {
    if (!showSessions) return;

    const q = query(
      collection(db, "sessions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date();
      const activeSessions = [];
      const pastSessionsList = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.createdAt && data.timer_minutes) {
          const start = data.createdAt.toDate();
          const end = new Date(start.getTime() + data.timer_minutes * 60000);
          const sessionData = {
            id: doc.id,
            topic: data.topic_covered || "Untitled",
            period: data.period || "N/A",
            semester: data.semester || "N/A",
            section: data.section || "N/A",
            timer_minutes: data.timer_minutes,
            startTime: start,
            endTime: end,
            subject: data.subject || "General",
            teacher: data.teacher || "Staff"
          };

          if (now >= start && now <= end) {
            activeSessions.push(sessionData);
          } else if (now > end) {
            pastSessionsList.push(sessionData);
          }
        }
      });

      setSessions(activeSessions);
      setPastSessions(pastSessionsList.slice(0, 10)); // Last 10 sessions
    });

    return () => unsubscribe();
  }, [showSessions]);

  // Countdown timer per session
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updated = {};

      sessions.forEach((s) => {
        const diff = Math.max(0, s.endTime - now);
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        updated[s.id] = `${mins.toString().padStart(2, "0")}:${secs
          .toString()
          .padStart(2, "0")}`;
      });

      setTimeLeft(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessions]);

  // Mark present
  const markPresent = async (sessionId) => {
    try {
      const studentData = {
        name: studentInfo.name,
        rollNo: studentInfo.rollNo,
        semester: studentInfo.semester,
        section: studentInfo.section,
        status: "present",
        timestamp: serverTimestamp(),
      };

      await setDoc(
        doc(db, "sessions", sessionId, "attendance", studentData.rollNo), 
        studentData
      );

      setPresentMarked((prev) => ({ ...prev, [sessionId]: true }));
      
      // Show success notification
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        // You could add a toast notification here
        console.log(`Attendance marked for ${session.topic}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to mark attendance.");
    }
  };

  const handleCheckSessions = () => setShowSessions(true);

  const filteredSessions = sessions.filter(session =>
    session.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPastSessions = pastSessions.filter(session =>
    session.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Welcome back, {studentInfo.name}!</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-4 py-2">
            <User className="w-5 h-5 text-cyan-400" />
            <div className="text-right">
              <p className="text-sm text-gray-400">Roll No</p>
              <p className="font-semibold">{studentInfo.rollNo}</p>
            </div>
          </div>
          {!showSessions && (
            <Button 
              onClick={handleCheckSessions} 
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 px-6 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Check Sessions
            </Button>
          )}
        </div>
      </div>

      {!showSessions ? (
        /* Welcome Dashboard */
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800/50 border-gray-700 rounded-2xl backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Attendance</p>
                    <p className="text-2xl font-bold mt-1">{stats.attendancePercentage}%</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${stats.attendancePercentage}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 rounded-2xl backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Present</p>
                    <p className="text-2xl font-bold mt-1">{stats.totalPresent}</p>
                    <p className="text-gray-400 text-xs mt-1">out of {stats.totalSessions} sessions</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 rounded-2xl backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Current Semester</p>
                    <p className="text-2xl font-bold mt-1">{studentInfo.semester}</p>
                    <p className="text-gray-400 text-xs mt-1">Section {studentInfo.section}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-gray-800/50 border-gray-700 rounded-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                <BarChart3 className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  onClick={handleCheckSessions}
                  className="bg-gray-700/50 hover:bg-cyan-600/20 border border-gray-600 hover:border-cyan-500 transition-all duration-300 h-16 flex flex-col gap-1"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Active Sessions</span>
                </Button>
                
                <Button className="bg-gray-700/50 hover:bg-blue-600/20 border border-gray-600 hover:border-blue-500 transition-all duration-300 h-16 flex flex-col gap-1">
                  <BarChart3 className="w-5 h-5" />
                  <span>Attendance Report</span>
                </Button>
                
                <Button className="bg-gray-700/50 hover:bg-green-600/20 border border-gray-600 hover:border-green-500 transition-all duration-300 h-16 flex flex-col gap-1">
                  <BookOpen className="w-5 h-5" />
                  <span>Study Materials</span>
                </Button>
                
                <Button className="bg-gray-700/50 hover:bg-purple-600/20 border border-gray-600 hover:border-purple-500 transition-all duration-300 h-16 flex flex-col gap-1">
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Sessions View */
        <div className="space-y-6">
          {/* Search and Tabs */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search sessions by topic or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 rounded-xl w-full md:w-80"
              />
            </div>
            
            <div className="flex gap-2 bg-gray-800/50 rounded-xl p-1">
              <Button
                onClick={() => setActiveTab("active")}
                variant={activeTab === "active" ? "default" : "ghost"}
                className={`rounded-lg ${
                  activeTab === "active" 
                    ? "bg-cyan-600 text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Active Sessions
              </Button>
              <Button
                onClick={() => setActiveTab("past")}
                variant={activeTab === "past" ? "default" : "ghost"}
                className={`rounded-lg ${
                  activeTab === "past" 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Recent Sessions
              </Button>
            </div>
          </div>

          {/* Sessions Grid */}
          {activeTab === "active" ? (
            filteredSessions.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700 rounded-2xl backdrop-blur-sm text-center py-12">
                <CardContent>
                  <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    {sessions.length === 0 ? "No active sessions" : "No matching sessions"}
                  </h3>
                  <p className="text-gray-500">
                    {sessions.length === 0 
                      ? "There are no active sessions at the moment." 
                      : "Try adjusting your search terms."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSessions.map((s) => (
                  <Card
                    key={s.id}
                    className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-gray-700 shadow-2xl rounded-2xl hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm group"
                  >
                    <CardHeader className="border-b border-gray-700/50 pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                          {s.subject}
                        </Badge>
                        <div className="flex items-center gap-1 text-orange-400 text-sm">
                          <Clock className="w-3 h-3" />
                          <span className="font-mono">{timeLeft[s.id] || "00:00"}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg text-white group-hover:text-cyan-400 transition-colors">
                        {s.topic}
                      </CardTitle>
                      <p className="text-sm text-gray-400">By {s.teacher}</p>
                    </CardHeader>

                    <CardContent className="pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Semester</span>
                        <span className="text-white">{s.semester}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Section</span>
                        <span className="text-white">{s.section}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Period</span>
                        <span className="text-white">{s.period}</span>
                      </div>
                      
                      <Button
                        onClick={() => markPresent(s.id)}
                        disabled={presentMarked[s.id]}
                        className={`mt-4 w-full font-semibold py-3 rounded-xl transition-all duration-300 ${
                          presentMarked[s.id]
                            ? "bg-green-600/50 text-green-300 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-green-500/25"
                        }`}
                      >
                        {presentMarked[s.id] ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Attendance Marked
                          </>
                        ) : (
                          "Mark Present"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          ) : (
            /* Past Sessions */
            <div className="space-y-4">
              {filteredPastSessions.map((s) => (
                <Card key={s.id} className="bg-gray-800/30 border-gray-700/50 rounded-xl">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-white">{s.topic}</h4>
                        <p className="text-sm text-gray-400">{s.subject} • {s.teacher}</p>
                      </div>
                      <Badge variant="outline" className="text-gray-400">
                        Completed
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}