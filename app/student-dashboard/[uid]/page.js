"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function StudentDashboardPage() {
  const { uid } = useParams();
  const [student, setStudent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [presentMarked, setPresentMarked] = useState({});
  const [timeLeft, setTimeLeft] = useState({});
  const [showSessions, setShowSessions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  // Fetch student info
  useEffect(() => {
    const fetchStudent = async () => {
      const studentRef = doc(db, "students", uid);
      const docSnap = await getDoc(studentRef);
      if (docSnap.exists()) setStudent(docSnap.data());
    };
    fetchStudent();
  }, [uid]);

  // Fetch sessions
  useEffect(() => {
    if (!showSessions || !student) return;

    const q = query(collection(db, "sessions"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date();
      const active = [];
      const past = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const start = data.createdAt?.toDate?.() || new Date(data.createdAt);
        const end = start
          ? new Date(start.getTime() + (data.timer_minutes || 0) * 60000)
          : null;

        // ✅ Match only semester + section (no department check)
        if (
          data.semester === student.semester &&
          data.section === student.section
        ) {
          const sessionObj = { id: docSnap.id, ...data, startTime: start, endTime: end };
          if (now >= start && now <= end) active.push(sessionObj);
          else if (now > end) past.push(sessionObj);
        }
      });

      setSessions(active);
      setPastSessions(past.slice(0, 10));
    });

    return () => unsubscribe();
  }, [showSessions, student]);

  // Timer
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

  // ✅ Mark attendance
  const markPresent = async (sessionId) => {
    if (!student) return;

    const rollNo = student.usn || student.rollNo || "unknown";

    const studentData = {
      name: student.name,
      usn: rollNo,
      semester: student.semester,
      section: student.section,
      status: "present",
      timestamp: serverTimestamp(),
    };

    await setDoc(doc(db, "sessions", sessionId, "attendance", rollNo), studentData);
    setPresentMarked((prev) => ({ ...prev, [sessionId]: true }));
  };

  const handleShowSessions = () => setShowSessions(true);

  if (!student) return <p className="text-white p-4">Loading student info...</p>;

  const filteredSessions =
    activeTab === "active"
      ? sessions.filter((s) =>
          s.topic_covered
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      : pastSessions.filter((s) =>
          s.topic_covered
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        );

  return (
    <div className="min-h-screen p-4 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-2">Welcome, {student.name}</h1>
      <p className="mb-4">USN: {student.usn}</p>

      {!showSessions && (
        <Button
          onClick={handleShowSessions}
          className="mb-4 bg-cyan-600 hover:bg-cyan-700"
        >
          Check Active Sessions
        </Button>
      )}

      {showSessions && (
        <div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by topic"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 rounded w-full bg-gray-800 border border-gray-600"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => setActiveTab("active")}
              className={activeTab === "active" ? "bg-cyan-600" : "bg-gray-700"}
            >
              Active Sessions
            </Button>
            <Button
              onClick={() => setActiveTab("past")}
              className={activeTab === "past" ? "bg-blue-600" : "bg-gray-700"}
            >
              Past Sessions
            </Button>
          </div>

          {filteredSessions.length === 0 ? (
            <p className="text-gray-400">
              No {activeTab === "active" ? "active" : "past"} sessions found.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSessions.map((s) => (
                <Card key={s.id}>
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle>{s.topic_covered}</CardTitle>
                    <Badge>{s.period || "Session"}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p>Semester: {s.semester}</p>
                    <p>Section: {s.section}</p>
                    {activeTab === "active" && (
                      <>
                        <p>Time Left: {timeLeft[s.id] || "00:00"}</p>
                        <Button
                          onClick={() => markPresent(s.id)}
                          disabled={presentMarked[s.id]}
                          className={`mt-2 w-full ${
                            presentMarked[s.id]
                              ? "bg-green-600/50 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-700"
                          }`}
                        >
                          {presentMarked[s.id]
                            ? "Attendance Marked"
                            : "Mark Present"}
                        </Button>
                      </>
                    )}
                    {activeTab === "past" && <p>Completed</p>}
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
