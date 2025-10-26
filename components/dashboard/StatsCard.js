import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const colorVariants = {
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-600",
    light: "bg-blue-50"
  },
  green: {
    bg: "bg-green-500",
    text: "text-green-600",
    light: "bg-green-50"
  },
  purple: {
    bg: "bg-purple-500",
    text: "text-purple-600",
    light: "bg-purple-50"
  },
  orange: {
    bg: "bg-orange-500",
    text: "text-orange-600",
    light: "bg-orange-50"
  }
};

export default function StatsCard({ title, value, icon: Icon, color, trend, isLoading }) {
  const colorClass = colorVariants[color] || colorVariants.blue;

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-slate-200/60">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-slate-200/60 hover:shadow-lg transition-shadow duration-300">
        <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 ${colorClass.bg} rounded-full opacity-10`} />
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
              <p className="text-3xl font-bold text-slate-900 mb-2">{value}</p>
              {trend && (
                <div className="flex items-center text-xs text-slate-500">
                  <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                  {trend}
                </div>
              )}
            </div>
            <div className={`p-3 rounded-xl ${colorClass.light}`}>
              <Icon className={`w-6 h-6 ${colorClass.text}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}