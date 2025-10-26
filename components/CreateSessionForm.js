"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";

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
import { BookOpen, CheckCircle, AlertCircle, Download } from "lucide-react";

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

export default function CreateSessionForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    period: "",
    topic_covered: "",
    semester: "",
    section: "",
    geofence_radius: "100",
    timer_minutes: "15",
    geofence_center: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [qrUrl, setQrUrl] = useState(null);

  // Update any field
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Capture geolocation
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setFormData((prev) => ({ ...prev, geofence_center: coords }));
        setSuccess(
          `Location captured! Lat: ${coords.lat.toFixed(
            5
          )}, Lng: ${coords.lng.toFixed(5)}`
        );
        setError("");
      },
      () => setError("Unable to retrieve your location.")
    );
  };

  // Form submit & generate QR
  const handleSubmit = async (e) => {
    e.preventDefault();
    const sessionPayload = { ...formData, timestamp: new Date().toISOString() };

    try {
      const url = await QRCode.toDataURL(JSON.stringify(sessionPayload));
      setQrUrl(url);
      setSuccess("Session started! QR code generated.");
      setError("");
    } catch (err) {
      console.error("QR generation failed:", err);
      setError("Failed to generate QR code.");
    }
  };

  // Download QR
  const downloadQR = () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = "session-qr.png";
    a.click();
  };

  return (
    <div className="p-6 md:p-8">
      {/* Go Back Button */}
      <Button
        variant="outline"
        className="mb-4"
        onClick={() => router.push("/Teacher-dashboard")}
      >
        ← Go Back
      </Button>

      <Card className="max-w-2xl mx-auto shadow-2xl border-0 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Create New Attendance Session
          </CardTitle>
          <CardDescription>
            Fill out the details below to start a new session.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Period + Topic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Input
                  id="period"
                  value={formData.period}
                  onChange={(e) => handleInputChange("period", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="topic_covered">Topic</Label>
                <Input
                  id="topic_covered"
                  value={formData.topic_covered}
                  onChange={(e) =>
                    handleInputChange("topic_covered", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Semester + Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select
                  value={formData.semester}
                  onValueChange={(value) => handleInputChange("semester", value)}
                >
                  <SelectTrigger id="semester">
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
              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Select
                  value={formData.section}
                  onValueChange={(value) => handleInputChange("section", value)}
                >
                  <SelectTrigger id="section">
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

            {/* Geofence + Timer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="geofence_radius">Geofence Radius (m)</Label>
                <Input
                  id="geofence_radius"
                  type="number"
                  min="10"
                  value={formData.geofence_radius}
                  onChange={(e) =>
                    handleInputChange("geofence_radius", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timer_minutes">Timer (min)</Label>
                <Input
                  id="timer_minutes"
                  type="number"
                  min="1"
                  value={formData.timer_minutes}
                  onChange={(e) =>
                    handleInputChange("timer_minutes", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Geofence Center */}
            <div className="space-y-2">
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

            {/* QR Code */}
            {qrUrl && (
              <div className="mt-6 flex flex-col items-center gap-3 p-4 border rounded-lg bg-gray-50 hover:shadow-lg transition">
                <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
                <Button
                  type="button"
                  variant="secondary"
                  className="flex items-center gap-2"
                  onClick={downloadQR}
                >
                  <Download className="w-4 h-4" /> Download QR
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg text-white font-semibold py-6 text-lg rounded-xl"
            >
              Start Session
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
