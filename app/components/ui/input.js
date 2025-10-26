import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      className={cn(
        "w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white placeholder-gray-400 outline-none",
        className
      )}
      {...props}
    />
  );
}
