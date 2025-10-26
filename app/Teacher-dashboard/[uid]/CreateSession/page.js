"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import QRCode from "qrcode";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, CheckCircle, AlertCircle, Download } from "lucide-react";

import { useAuth } from "@/lib/firebaseAuth"; // Custom hook for current teacher

function Alert({ variant = "default", children }) {
  const base = "p-4 rounded-lg border flex items-center gap-2 text-sm";
  const variants = {
    default: "bg-blue-50 border-blue-200 text-blue-800",
    destructive: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
  };
  return <div className={`${base} ${variants[variant]}`}>{children}</div>;
}

export default function CreateSessionPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("create"); // "create", "active", "history"
  const [formData, setFormData] = useState({
    period: "",
    topic_covered: "",
    semester: "",
    section: "",
    geofence_radius: "100",
    timer_minutes: "15",
    geofence_center: null,
    session_type: "active",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [qrUrl, setQrUrl] = useState(null);
  const [lastSessionId, setLastSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setFormData((prev) => ({ ...prev, geofence_center: coords }));
        setSuccess(`✅ Location captured! (${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)})`);
        setError("");
      },
      () => setError("Unable to retrieve your location.")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.period || !formData.topic_covered || !formData.semester || !formData.section) {
      setError("Please fill all required fields.");
      return;
    }

    if (!user?.uid) {
      setError("Teacher not authenticated.");
      return;
    }

    const sessionData = {
      ...formData,
      teacherUid: user.uid,
      teacherName: user.displayName || "Unknown",
      department: user.department || "CSE",
      geofence_radius: Number(formData.geofence_radius),
      timer_minutes: Number(formData.timer_minutes),
      createdAt: serverTimestamp(),
    };

    try {
      // Add session to 'sessions' collection
      const docRef = await addDoc(collection(db, "sessions"), sessionData);

      const qrData = { id: docRef.id, ...sessionData };
      const url = await QRCode.toDataURL(JSON.stringify(qrData));
      setQrUrl(url);
      setSuccess("✅ Session created and stored in DB!");
      setError("");
      setFormData({
        period: "",
        topic_covered: "",
        semester: "",
        section: "",
        geofence_radius: "100",
        timer_minutes: "15",
        geofence_center: null,
        session_type: "active",
      });
      setLastSessionId(docRef.id);
      fetchSessions(); // refresh history
    } catch (err) {
      console.error(err);
      setError("Failed to create session.");
    }
  };

  const downloadQR = () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = "session-qr.png";
    a.click();
  };

  const downloadAttendance = async (sessionId) => {
    if (!sessionId) return alert("No session available.");
    const snapshot = await getDocs(collection(db, "sessions", sessionId, "attendance"));
    const students = snapshot.docs.map((doc) => doc.data());
    if (!students.length) return alert("No attendance marked yet.");

    const csv = [
      ["Name", "Roll No", "Status", "Marked At"],
      ...students.map((s) => [
        s.name,
        s.rollNo,
        s.status,
        s.markedAt?.toDate().toLocaleString() || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${sessionId}.csv`;
    a.click();
  };

  const fetchSessions = async () => {
    if (!user?.uid) return;
    const snapshot = await getDocs(collection(db, "sessions"));
    const teacherSessions = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((s) => s.teacherUid === user.uid)
      .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    setSessions(teacherSessions);
    if (teacherSessions.length) setLastSessionId(teacherSessions[0].id);
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button variant={tab === "create" ? "default" : "outline"} onClick={() => setTab("create")}>Create Session</Button>
          <Button variant={tab === "active" ? "default" : "outline"} onClick={() => setTab("active")}>Active Session</Button>
          <Button variant={tab === "history" ? "default" : "outline"} onClick={() => setTab("history")}>History</Button>
        </div>

        {/* Create Session */}
        {tab === "create" && (
          <Card className="shadow-2xl border border-gray-200 bg-white/95 backdrop-blur-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-3xl font-semibold text-gray-800">
                <BookOpen className="w-8 h-8 text-blue-600" /> Create Attendance Session
              </CardTitle>
              <CardDescription className="text-gray-500 text-base">
                Fill session details and generate a secure QR for students.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Period</Label>
                    <Input
                      value={formData.period}
                      onChange={(e) => handleInputChange("period", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Topic</Label>
                    <Input
                      value={formData.topic_covered}
                      onChange={(e) => handleInputChange("topic_covered", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Semester</Label>
                    <Select
                      value={formData.semester}
                      onValueChange={(v) => handleInputChange("semester", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <SelectItem key={sem} value={sem.toString()}>
                            {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Section</Label>
                    <Select
                      value={formData.section}
                      onValueChange={(v) => handleInputChange("section", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A", "B", "C", "D"].map((sec) => (
                          <SelectItem key={sec} value={sec}>
                            {sec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Session Type */}
                <div>
                  <Label>Session Type</Label>
                  <Select
                    value={formData.session_type}
                    onValueChange={(v) => handleInputChange("session_type", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select session type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="passive">Passive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Geofence Radius (m)</Label>
                    <Input
                      type="number"
                      value={formData.geofence_radius}
                      onChange={(e) => handleInputChange("geofence_radius", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Timer (minutes)</Label>
                    <Input
                      type="number"
                      value={formData.timer_minutes}
                      onChange={(e) => handleInputChange("timer_minutes", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Geofence Center</Label>
                  <Button type="button" variant="outline" onClick={getUserLocation}>
                    Capture My Location
                  </Button>
                  {formData.geofence_center && (
                    <p className="text-sm text-green-700 mt-1">
                      ✅ Lat {formData.geofence_center.lat.toFixed(5)}, Lng{" "}
                      {formData.geofence_center.lng.toFixed(5)}
                    </p>
                  )}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </Alert>
                )}
                {success && (
                  <Alert variant="success">
                    <CheckCircle className="h-4 w-4" />
                    <span>{success}</span>
                  </Alert>
                )}

                {qrUrl && (
                  <div className="mt-6 flex flex-col items-center gap-3 p-6 border rounded-xl bg-gray-50 hover:shadow-lg transition">
                    <img src={qrUrl} alt="QR Code" className="w-56 h-56" />
                    <Button onClick={downloadQR} className="flex items-center gap-2">
                      <Download className="w-4 h-4" /> Download QR
                    </Button>
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-6 border-t">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg text-white font-semibold py-4 text-lg rounded-xl"
                >
                  Start Session
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}

        {/* Active Session */}
        {tab === "active" && lastSessionId && (
          <Card className="p-6 shadow-lg rounded-xl bg-white/95">
            <h2 className="text-xl font-semibold mb-4">Active Session</h2>
            <img src={qrUrl} alt="QR Code" className="w-56 h-56 mb-4" />
            <Button onClick={() => downloadAttendance(lastSessionId)} className="bg-green-600 text-white">
              <Download className="w-4 h-4 mr-2" /> Download Attendance
            </Button>
          </Card>
        )}

        {/* History */}
        {tab === "history" && (
          <Card className="p-6 shadow-lg rounded-xl bg-white/95">
            <h2 className="text-xl font-semibold mb-4">Past Sessions</h2>
            {sessions.length === 0 ? (
              <p>No past sessions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2">Period</th>
                      <th className="px-4 py-2">Topic</th>
                      <th className="px-4 py-2">Semester</th>
                      <th className="px-4 py-2">Section</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s) => (
                      <tr key={s.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{s.period}</td>
                        <td className="px-4 py-2">{s.topic_covered}</td>
                        <td className="px-4 py-2">{s.semester}</td>
                        <td className="px-4 py-2">{s.section}</td>
                        <td className="px-4 py-2">{s.createdAt?.toDate().toLocaleString()}</td>
                        <td className="px-4 py-2">
                          <Button
                            onClick={() => downloadAttendance(s.id)}
                            className="bg-green-600 text-white text-sm flex items-center gap-1"
                          >
                            <Download className="w-4 h-4" /> Download
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
