"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/firebaseAuth"; // your auth hook
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export default function ActiveSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const { user } = useAuth(); // get current teacher UID

  useEffect(() => {
    if (!user?.uid) return;

    // Listen to sessions for this teacher
    const q = query(
      collection(db, "teachers", user.uid, "sessions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSessions(list);
    });

    return () => unsubscribe();
  }, [user]);

  // Listen to attendance per session
  useEffect(() => {
    const unsubscribers = sessions.map(session => {
      return onSnapshot(
        collection(db, "teachers", user.uid, "sessions", session.id, "attendance"),
        snap => {
          const students = snap.docs.map(d => d.data());
          setAttendanceData(prev => ({ ...prev, [session.id]: students }));
        }
      );
    });

    return () => unsubscribers.forEach(unsub => unsub());
  }, [sessions, user]);

  // Download CSV
  const handleDownloadCSV = (sessionId, session) => {
    const students = attendanceData[sessionId] || [];
    if (students.length === 0) {
      alert("No attendance yet for this session.");
      return;
    }

    const headers = ["Name", "USN", "Status", "Timestamp"];
    const rows = students.map(s => [
      s.name || "Unknown",
      s.usn || "-",
      s.status || "present",
      new Date(s.timestamp?.seconds * 1000).toLocaleString()
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `attendance_${session.period}_${session.section}_${session.semester}.csv`;
    link.click();
  };

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">📋 Active Sessions</h1>

      {sessions.length === 0 ? (
        <p className="text-gray-500">No active sessions yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map(session => (
            <Card key={session.id} className="shadow-lg border border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">
                  {session.period} — {session.topic_covered}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  <strong>Semester:</strong> {session.semester} | <strong>Section:</strong> {session.section}
                </p>
                <p>
                  <strong>Timer:</strong> {session.timer_minutes} min | <strong>Radius:</strong> {session.geofence_radius} m
                </p>
                <p className="text-green-700">
                  🧍 Present Students: {attendanceData[session.id]?.length || 0}
                </p>
                <Button
                  onClick={() => handleDownloadCSV(session.id, session)}
                  className="bg-blue-600 hover:bg-blue-700 mt-2 text-white"
                >
                  ⬇️ Download Attendance CSV
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
