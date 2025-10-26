"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, query, orderBy, where, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const statusColors = {
  active: "bg-green-500 text-white",
  pending: "bg-yellow-400 text-white",
  completed: "bg-gray-400 text-white",
};

export default function ViewSessionsClient({ uid }) {
  const [sessions, setSessions] = useState([]);
  const [openSession, setOpenSession] = useState(null);

  // Fetch sessions
  useEffect(() => {
    if (!uid) return;
    const q = query(
      collection(db, "sessions"),
      where("teacherId", "==", uid),
      orderBy("date", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessionList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSessions(sessionList);
    });

    return () => unsubscribe();
  }, [uid]);

  const downloadCSV = (session) => {
    if (!session.students || session.students.length === 0) return;
    const rows = session.students.map((s) => [
      s.usn, s.name, s.department, s.semester, s.section, s.phone,
    ]);
    const csv = [["USN","Name","Department","Semester","Section","Phone"], ...rows]
      .map((r) => r.join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${session.title || "session"}_students.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">View Sessions</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sessions.map((session, idx) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white/80 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition"
            >
              <div
                className="flex justify-between items-center"
                onClick={() =>
                  setOpenSession(openSession === session.id ? null : session.id)
                }
              >
                <div>
                  <h2 className="text-xl font-semibold">{session.title}</h2>
                  <p className="text-sm text-gray-600">{session.date} - {session.time}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${statusColors[session.status] || "bg-gray-400 text-white"}`}>
                  {session.status || "active"}
                </span>
              </div>

              <AnimatePresence>
                {openSession === session.id && session.students?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-2 border-t pt-4"
                  >
                    {session.students.map((s) => (
                      <div key={s.uid} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg shadow-sm">
                        <div>
                          <p className="font-medium">{s.name}</p>
                          <p className="text-xs text-gray-500">{s.usn} | {s.department}</p>
                        </div>
                        <p className="text-sm">{s.section}</p>
                      </div>
                    ))}
                    <button
                      onClick={() => downloadCSV(session)}
                      className="mt-2 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Download CSV
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
