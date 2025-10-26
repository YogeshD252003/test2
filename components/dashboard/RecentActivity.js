import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, UserPlus, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function RecentActivity({ teachers }) {
  // Sort teachers by created_date safely
  const recentTeachers = [...teachers]
    .sort((a, b) => {
      const dateA = new Date(a.created_date || Date.now());
      const dateB = new Date(b.created_date || Date.now());
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-600" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTeachers.length > 0 ? (
          recentTeachers.map((teacher) => {
            // Use fallback date if invalid
            const teacherDate = isNaN(new Date(teacher.created_date))
              ? new Date()
              : new Date(teacher.created_date);

            return (
              <div key={teacher.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    New teacher <span className="font-semibold">{teacher.name}</span> added
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {teacher.department}
                    </Badge>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(teacherDate, "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recent activity. Start by creating teacher accounts.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
