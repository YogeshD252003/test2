import * as React from "react";

export function Card({ className, children }) {
  return <div className={`bg-gray-800/50 border border-gray-700 rounded-xl p-4 ${className}`}>{children}</div>;
}

export function CardHeader({ className, children }) {
  return <div className={`mb-2 ${className}`}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}

export function CardContent({ className, children }) {
  return <div className={className}>{children}</div>;
}
