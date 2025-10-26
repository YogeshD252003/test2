"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/app/firebaseConfig";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ActiveSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [attendanceData, setAttendanceData] = useState({});

  // Fetch active sessions
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "sessions"), (snapshot) => {
      const now = new Date();
      const activeSessions = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.createdAt && data.timer_minutes) {
          const start = data.createdAt.toDate();
          const end = new Date(start.getTime() + data.timer_minutes * 60000);
          if (now >= start && now <= end) {
            activeSessions.push({
              id: doc.id,
              topic: data.topic_covered || "Untitled",
              period: data.period || "N/A",
              semester: data.semester || "N/A",
              section: data.section || "N/A",
              timer_minutes: data.timer_minutes,
              startTime: start,
              endTime: end,
            });
          }
        }
      });

      setSessions(activeSessions);
    });

    return () => unsubscribe();
  }, []);

  // Countdown timer
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

  // Attendance listener
  useEffect(() => {
    const unsubscribers = sessions.map((session) =>
      onSnapshot(
        collection(db, "sessions", session.id, "attendance"),
        (snap) => {
          const students = snap.docs.map((d) => d.data());
          setAttendanceData((prev) => ({ ...prev, [session.id]: students }));
        }
      )
    );
    return () => unsubscribers.forEach((unsub) => unsub());
  }, [sessions]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Active Sessions (Teacher View)</h1>

      {sessions.length === 0 ? (
        <p className="text-gray-400 text-lg">No active sessions right now.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((s) => (
            <Card
              key={s.id}
              className="bg-gray-800 border border-gray-700 shadow-lg rounded-2xl hover:scale-[1.01] transition-transform duration-200"
            >
              <CardHeader className="border-b border-gray-700 pb-2">
                <CardTitle className="text-xl text-cyan-400">{s.topic}</CardTitle>
                <p className="text-sm text-gray-400">Period: {s.period}</p>
              </CardHeader>

              <CardContent className="pt-4 space-y-2 text-gray-200">
                <p><strong>🎓 Semester:</strong> {s.semester}</p>
                <p><strong>🏫 Section:</strong> {s.section}</p>
                <p>
                  <strong>⏳ Time Left:</strong>{" "}
                  <span className="text-lg font-mono text-cyan-400">
                    {timeLeft[s.id] || "00:00"}
                  </span>
                </p>
                <p className="text-green-500">
                  🧍 Present Students: {attendanceData[s.id]?.length || 0}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
