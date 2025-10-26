"use client";

import React from "react";
import { motion } from "framer-motion";

export default function DepartmentOverview({ departments }) {
  return (
    <div className="space-y-6">
      {departments.map((dept, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-slate-900 mb-4">{dept.name} Department</h2>
          
          <div className="space-y-4">
            {dept.sections.map((section, sIdx) => (
              <div key={sIdx} className="p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <h3 className="font-medium text-slate-800 mb-2">{section.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {section.students
                    .sort((a, b) => a.usn.localeCompare(b.usn))
                    .map((student) => (
                      <div
                        key={student.usn}
                        className="px-2 py-1 bg-purple-50 text-purple-800 rounded-lg text-sm font-medium"
                      >
                        {student.usn} - {student.name}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
