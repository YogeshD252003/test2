import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, children }) {
  return (
    <span className={cn("px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-200", className)}>
      {children}
    </span>
  );
}
