"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../lib/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  BookOpen,
  Phone,
  ArrowLeft,
  Search,
  Building,
  Download,
} from "lucide-react";
import Link from "next/link";

export default function ViewTeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const defaultDepartments = [
    "CSE",
    "IT",
    "ECE",
    "EEE",
    "Mechanical",
    "Civil",
    "Chemical",
    "Biomedical",
    "Aerospace",
    "Automobile",
    "Mechatronics",
    "AI & DS",
    "Cybersecurity",
    "Biotechnology",
  ];

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "teachers"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTeachers(data);

      const dynamicDepts = [...new Set(data.map((t) => t.department || "Unknown"))];
      const combined = Array.from(new Set([...defaultDepartments, ...dynamicDepts]));
      setDepartments(combined);
    });

    return () => unsub();
  }, []);

  // 🔍 Filter teachers
  const filteredTeachers = teachers.filter(
    (t) =>
      (!selectedDept || t.department === selectedDept) &&
      (t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.department?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // 🔹 CSV download function
  const downloadCSV = () => {
    const deptTeachers = teachers.filter((t) => t.department === selectedDept);
    if (!deptTeachers.length) return;

    const headers = ["Name", "Department", "Email", "Phone"];
    const rows = deptTeachers.map((t) => [t.name, t.department, t.email, t.phone]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedDept}_teachers.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 py-10 px-6 transition-all duration-500">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
            View Teachers
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Explore departments and faculty members.
          </p>
        </div>
        <Link href="/side-bar-admin">
          <Button className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Department Blocks */}
      {!selectedDept && (
        <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {departments.map((dept, idx) => (
            <Card
              key={idx}
              onClick={() => setSelectedDept(dept)}
              className="cursor-pointer bg-white/80 dark:bg-gray-800/80 border-0 backdrop-blur-sm hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 rounded-3xl"
            >
              <CardHeader className="flex flex-col items-center justify-center py-10">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg hover:scale-110 transition-transform duration-300">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white text-center">
                  {dept} Department
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Teachers List */}
      {selectedDept && (
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {selectedDept} Department
            </h2>
            <div className="flex gap-2">
              <Button
                onClick={downloadCSV}
                className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </Button>
              <Button
                onClick={() => setSelectedDept(null)}
                className="border-gray-400 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Back to Departments
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-10 flex items-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-md px-4 py-2 border border-gray-200 dark:border-gray-700">
            <Search className="w-5 h-5 text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Search by name or department..."
              className="w-full bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Teachers Grid */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <Card
                  key={teacher.id}
                  className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 rounded-2xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                >
                  <CardHeader className="pb-2">
                    <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      {teacher.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span>{teacher.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-500" />
                      <span>{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-indigo-500" />
                      <span>{teacher.phone}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
                No teachers found for this department.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
