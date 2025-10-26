"use client";

import React from "react";
import TeacherLayout from "@/components/teacher/TeacherLayout";

// ✅ Next.js Layout must wrap children and return JSX
export default function Layout({ children }) {
  return <TeacherLayout>{children}</TeacherLayout>;
}
