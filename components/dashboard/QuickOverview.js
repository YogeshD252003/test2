import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BookOpen, GraduationCap } from "lucide-react";

export default function QuickOverview({ teachers, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
        <CardHeader>
          <CardTitle>Department Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-6 w-8" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const departmentStats = teachers.reduce((acc, teacher) => {
    if (!acc[teacher.department]) {
      acc[teacher.department] = {
        count: 0,
        subjects: new Set(),
        sections: new Set()
      };
    }
    acc[teacher.department].count++;
    acc[teacher.department].subjects.add(teacher.subject);
    acc[teacher.department].sections.add(teacher.section);
    return acc;
  }, {});

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          Department Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(departmentStats)
          .sort(([,a], [,b]) => b.count - a.count)
          .map(([department, stats]) => (
            <div 
              key={department} 
              className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-lg hover:from-blue-50 hover:to-purple-50/50 transition-all duration-200"
            >
              <div>
                <h3 className="font-semibold text-slate-900">{department}</h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {stats.subjects.size} subjects
                  </span>
                  <span>Sections: {Array.from(stats.sections).join(', ')}</span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Users className="w-3 h-3 mr-1" />
                {stats.count}
              </Badge>
            </div>
          ))}
        {Object.keys(departmentStats).length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No departments found. Create your first teacher to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}