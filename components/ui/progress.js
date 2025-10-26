"use client";

import React from "react";
import { cn } from "@/lib/utils"; // Make sure you have this utility

/**
 * Progress bar component
 * @param {number} value - Progress value (0-100)
 * @param {string} className - Additional classes
 */
export function Progress({ value = 0, className, ...props }) {
  return (
    <div
      className={cn(
        "w-full h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        className="h-3 bg-blue-500 dark:bg-blue-400 rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
