"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { db } from "@/app/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  doc,
} from "firebase/firestore";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  CheckCircle,
  AlertCircle,
  Download,
  Home,
  ClipboardList,
  Clock,
  FileText,
} from "lucide-react";

// ✅ Simple Alert Component
function Alert({ variant = "default", children }) {
  const base = "p-4 rounded-lg border flex items-center gap-2 text-sm";
  const variants = {
    default: "bg-blue-50 border-blue-200 text-blue-800",
    destructive: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
  };
  return <div className={`${base} ${variants[variant]}`}>{children}</div>;
}

// ✅ Sidebar Component
function Sidebar({ active }) {
  const router = useRouter();
  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/Teacher-dashboard" },
    { name: "Create Session", icon: ClipboardList, path: "/Teacher-dashboard/create-session" },
    { name: "Active Sessions", icon: Clock, path: "/Teacher-dashboard/active-sessions" },
    { name: "Reports", icon: FileText, path: "/Teacher-dashboard/reports" },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r shadow-sm p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-600">ClassMaster</h1>
        <p className="text-gray-500 text-sm">Teacher Portal</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.name;
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default function CreateSessionForm() {
  const [formData, setFormData] = useState({
    period: "",
    topic_covered: "",
    semester: "",
    section: "",
    geofence_radius: "100",
    timer_minutes: "15",
    geofence_center: null,
  });
  const [sessions, setSessions] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [qrUrl, setQrUrl] = useState(null);

  // 🔁 Real-time sessions listener
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "sessions"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSessions(list);
    });
    return () => unsub();
  }, []);

  // 🔁 Fetch live attendance per session
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
        setSuccess(
          `✅ Location captured! (${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)})`
        );
        setError("");
      },
      () => setError("Unable to retrieve your location.")
    );
  };

  // ✅ Create a new session + generate QR
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.period || !formData.topic_covered || !formData.semester || !formData.section) {
      setError("Please fill all required fields.");
      return;
    }

    const sessionData = {
      ...formData,
      geofence_radius: Number(formData.geofence_radius),
      timer_minutes: Number(formData.timer_minutes),
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, "sessions"), sessionData);
      const qrData = { id: docRef.id, ...sessionData };
      const url = await QRCode.toDataURL(JSON.stringify(qrData));
      setQrUrl(url);
      setSuccess("✅ Session created and QR generated!");
      setError("");
      setFormData({
        period: "",
        topic_covered: "",
        semester: "",
        section: "",
        geofence_radius: "100",
        timer_minutes: "15",
        geofence_center: null,
      });
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

  // ✅ Download Attendance as CSV
  const handleDownloadCSV = (sessionId, session) => {
    const students = attendanceData[sessionId] || [];
    if (students.length === 0) {
      alert("No attendance yet for this session.");
      return;
    }

    const headers = ["Name", "Roll No", "Status", "Timestamp"];
    const rows = students.map((s) => [
      s.name || "Unknown",
      s.rollNo || "-",
      s.status || "present",
      new Date(s.timestamp?.seconds * 1000).toLocaleString(),
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `attendance_${session.period}_${session.section}_${session.semester}.csv`;
    link.click();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar active="Create Session" />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-10 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto">
          {/* Form Card */}
          <Card className="shadow-2xl border border-gray-200 bg-white/95 backdrop-blur-sm rounded-2xl">
            <CardHeader className="pb-4 border-b">
              <CardTitle className="flex items-center gap-3 text-3xl font-semibold text-gray-800">
                <BookOpen className="w-8 h-8 text-blue-600" />
                Create New Attendance Session
              </CardTitle>
              <CardDescription className="text-gray-500 text-base">
                Fill session details and generate a secure QR for students.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-8 mt-4">
                {/* Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

                {/* Geofence and Timer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Label>Geofence Radius (m)</Label>
                    <Input
                      type="number"
                      value={formData.geofence_radius}
                      onChange={(e) =>
                        handleInputChange("geofence_radius", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>Timer (minutes)</Label>
                    <Input
                      type="number"
                      value={formData.timer_minutes}
                      onChange={(e) =>
                        handleInputChange("timer_minutes", e.target.value)
                      }
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

                {/* Alerts */}
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

                {/* QR Display */}
                {qrUrl && (
                  <div className="mt-6 flex flex-col items-center gap-3 p-6 border rounded-xl bg-gray-50 hover:shadow-lg transition">
                    <img src={qrUrl} alt="QR Code" className="w-56 h-56" />
                    <Button onClick={downloadQR} className="flex items-center gap-2">
                      <Download className="w-4 h-4" /> Download QR
                    </Button>
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-8 border-t">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg text-white font-semibold py-6 text-lg rounded-xl"
                >
                  Start Session
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Active Sessions Section */}
          <div className="mt-10 bg-white/90 p-6 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">📋 Active Sessions</h3>

            {sessions.length === 0 ? (
              <p className="text-gray-500">No sessions yet.</p>
            ) : (
              <ul className="space-y-4">
                {sessions.map((s) => (
                  <li
                    key={s.id}
                    className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <p><strong>Period:</strong> {s.period} — {s.topic_covered}</p>
                    <p>
                      <strong>Semester:</strong> {s.semester} | <strong>Section:</strong> {s.section}
                    </p>
                    <p>
                      <strong>Timer:</strong> {s.timer_minutes} min | <strong>Radius:</strong>{" "}
                      {s.geofence_radius}m
                    </p>
                    <p className="text-green-700 mt-1">
                      🧍 Present Students: {attendanceData[s.id]?.length || 0}
                    </p>

                    <Button
                      onClick={() => handleDownloadCSV(s.id, s)}
                      className="mt-3 bg-blue-600 hover:bg-blue-700"
                    >
                      ⬇️ Download Attendance CSV
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
