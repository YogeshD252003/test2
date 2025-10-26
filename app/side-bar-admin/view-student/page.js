"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../../lib/firebaseConfig";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

// Predefined departments, semesters, and sections
const allDepartments = [
  "CSE", "ECE", "ME", "CE", "EEE", "IT", "ISE", "AIML", "ET",
  "Aerospace", "Automobile", "Biotech", "Civil", "Chemical",
  "AI_DS", "Cybersecurity", "Biomedical", "Mechatronics"
];
const allSemesters = [1, 2, 3, 4, 5, 6, 7, 8];
const allSections = ["A", "B", "C", "D"];

// Department Colors
const departmentColors = {
  CSE: { primary: "bg-gradient-to-br from-purple-500 to-pink-500", secondary: "bg-purple-100", text: "text-purple-700" },
  EEE: { primary: "bg-gradient-to-br from-blue-500 to-cyan-400", secondary: "bg-blue-100", text: "text-blue-700" },
  ECE: { primary: "bg-gradient-to-br from-green-500 to-emerald-400", secondary: "bg-green-100", text: "text-green-700" },
  ISE: { primary: "bg-gradient-to-br from-orange-500 to-amber-400", secondary: "bg-orange-100", text: "text-orange-700" },
  AIML: { primary: "bg-gradient-to-br from-red-500 to-rose-400", secondary: "bg-red-100", text: "text-red-700" },
  ET: { primary: "bg-gradient-to-br from-indigo-500 to-violet-400", secondary: "bg-indigo-100", text: "text-indigo-700" },
  ME: { primary: "bg-gradient-to-br from-yellow-500 to-amber-500", secondary: "bg-yellow-100", text: "text-yellow-700" },
  CE: { primary: "bg-gradient-to-br from-teal-500 to-cyan-400", secondary: "bg-teal-100", text: "text-teal-700" },
  IT: { primary: "bg-gradient-to-br from-pink-500 to-rose-400", secondary: "bg-pink-100", text: "text-pink-700" },
  Aerospace: { primary: "bg-gradient-to-br from-indigo-400 to-blue-500", secondary: "bg-indigo-100", text: "text-indigo-700" },
  Automobile: { primary: "bg-gradient-to-br from-red-400 to-orange-500", secondary: "bg-red-100", text: "text-red-700" },
  Biotech: { primary: "bg-gradient-to-br from-green-400 to-emerald-500", secondary: "bg-green-100", text: "text-green-700" },
  Civil: { primary: "bg-gradient-to-br from-teal-400 to-cyan-500", secondary: "bg-teal-100", text: "text-teal-700" },
  Chemical: { primary: "bg-gradient-to-br from-yellow-400 to-orange-400", secondary: "bg-yellow-100", text: "text-yellow-700" },
  AI_DS: { primary: "bg-gradient-to-br from-pink-400 to-rose-400", secondary: "bg-pink-100", text: "text-pink-700" },
  Cybersecurity: { primary: "bg-gradient-to-br from-gray-400 to-gray-700", secondary: "bg-gray-100", text: "text-gray-700" },
  Biomedical: { primary: "bg-gradient-to-br from-teal-400 to-green-400", secondary: "bg-teal-100", text: "text-teal-700" },
  Mechatronics: { primary: "bg-gradient-to-br from-purple-400 to-indigo-500", secondary: "bg-purple-100", text: "text-purple-700" }
};

export default function ViewStudentsPage() {
  const [departmentsData, setDepartmentsData] = useState({});
  const [openDept, setOpenDept] = useState(null);
  const [openSemester, setOpenSemester] = useState(null);
  const [openSection, setOpenSection] = useState(null);

  // Fetch students from Firestore
  useEffect(() => {
    const q = query(collection(db, "students"), orderBy("usn"));
    const unsubscribe = onSnapshot(q, snapshot => {
      const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Initialize department → semester → section structure
      const depts = {};
      allDepartments.forEach(dept => {
        depts[dept] = {};
        allSemesters.forEach(sem => {
          depts[dept][sem] = {};
          allSections.forEach(sec => {
            depts[dept][sem][sec] = [];
          });
        });
      });

      // Populate students
      students.forEach(s => {
        const dept = s.department;
        const sem = s.semester;
        const sec = s.section;
        if (depts[dept] && depts[dept][sem] && depts[dept][sem][sec]) {
          depts[dept][sem][sec].push(s);
        }
      });

      setDepartmentsData(depts);
    });

    return () => unsubscribe();
  }, []);

  // Download CSV
  const downloadCSV = (dept, sem, sec) => {
    const rows = (departmentsData[dept]?.[sem]?.[sec] || []).map(s => [
      s.usn, s.name, s.department, s.semester, s.section, s.phone
    ]);
    const csv = [["USN","Name","Department","Semester","Section","Phone"], ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dept}_Sem${sem}_Sec${sec}_students.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Students Dashboard
          </h1>
          <p className="text-slate-600 text-lg">
            Click on a department → semester → section to explore students
          </p>
        </motion.div>

        {/* Departments */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allDepartments.map((dept, idx) => (
            <motion.div
              key={dept}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              {/* Department Card */}
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`${departmentColors[dept]?.primary || "bg-gray-400"} rounded-2xl p-6 cursor-pointer shadow-xl`}
                onClick={() => setOpenDept(openDept === dept ? null : dept)}
              >
                <div className="flex items-center justify-between text-white">
                  <h2 className="text-2xl font-bold">{dept}</h2>
                  <span>
                    {
                      Object.values(departmentsData[dept] || {})
                        .flatMap(sem => Object.values(sem).flat())
                        .length
                    }{" "}
                    students
                  </span>
                </div>
              </motion.div>

              {/* Semesters */}
              <AnimatePresence>
                {openDept === dept && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 space-y-2"
                  >
                    {allSemesters.map((sem, sIdx) => (
                      <motion.div
                        key={sem}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: sIdx * 0.05 }}
                        className="bg-white rounded-xl p-4 shadow-md border-l-4 border-purple-500 cursor-pointer"
                        onClick={() =>
                          setOpenSemester(
                            openSemester === `${dept}-${sem}` ? null : `${dept}-${sem}`
                          )
                        }
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">Semester {sem}</p>
                          <p className="text-sm text-slate-600">
                            {
                              Object.values(departmentsData[dept]?.[sem] || {})
                                .flat().length
                            }{" "}
                            students
                          </p>
                        </div>

                        {/* Sections */}
                        <AnimatePresence>
                          {openSemester === `${dept}-${sem}` && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-3 space-y-2 ml-4"
                            >
                              {allSections.map((sec, secIdx) => (
                                <motion.div
                                  key={sec}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: secIdx * 0.05 }}
                                >
                                  <div
                                    className="flex items-center justify-between bg-slate-50 rounded-lg p-3 shadow-sm border-l-4 border-blue-500 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenSection(
                                        openSection === `${dept}-${sem}-${sec}`
                                          ? null
                                          : `${dept}-${sem}-${sec}`
                                      );
                                    }}
                                  >
                                    <div>
                                      <p className="font-semibold">Section {sec}</p>
                                      <p className="text-sm">
                                        {(departmentsData[dept]?.[sem]?.[sec]?.length) || 0} students
                                      </p>
                                    </div>
                                    <button
                                      className="bg-blue-500 text-white px-3 py-1 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        downloadCSV(dept, sem, sec);
                                      }}
                                    >
                                      Download CSV
                                    </button>
                                  </div>

                                  {/* Students */}
                                  <AnimatePresence>
                                    {openSection === `${dept}-${sem}-${sec}` && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-3 ml-4 grid grid-cols-1 sm:grid-cols-2 gap-2"
                                      >
                                        {(departmentsData[dept]?.[sem]?.[sec] || []).map(
                                          (student, idx) => (
                                            <motion.div
                                              key={student.id}
                                              initial={{ opacity: 0, scale: 0.8 }}
                                              animate={{ opacity: 1, scale: 1 }}
                                              transition={{ delay: idx * 0.03 }}
                                              className="bg-white rounded-lg p-3 shadow-sm border border-opacity-20 hover:shadow-md"
                                            >
                                              <div className="flex items-start space-x-3">
                                                <div
                                                  className={`w-10 h-10 rounded-full flex items-center justify-center ${departmentColors[dept]?.secondary
                                                    } ${departmentColors[dept]?.text
                                                    } font-semibold text-sm`}
                                                >
                                                  {student.name.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                  <p className="font-medium text-slate-800 truncate">
                                                    {student.name}
                                                  </p>
                                                  <p className="text-xs text-slate-500 font-mono truncate">
                                                    {student.usn}
                                                  </p>
                                                  <p className="text-xs text-slate-500">
                                                    {student.phone}
                                                  </p>
                                                </div>
                                              </div>
                                            </motion.div>
                                          )
                                        )}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
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
