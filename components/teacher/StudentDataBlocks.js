import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, MapPin, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default function RecentSessions({ sessions = [], attendanceRecords = [] }) {
  const recentSessions = sessions
    .sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime())
    .slice(0, 5);

  const getSessionStats = (sessionId) => {
    const sessionAttendance = attendanceRecords.filter(r => r.session_id === sessionId);
    const presentCount = sessionAttendance.filter(r => r.status === "present").length;
    return {
      total: sessionAttendance.length,
      present: presentCount,
      rate: sessionAttendance.length > 0 ? Math.round((presentCount / sessionAttendance.length) * 100) : 0
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Recent Sessions
        </CardTitle>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {recentSessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No sessions created yet</p>
            <Button className="mt-4">
              Create Your First Session
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentSessions.map((session) => {
              const stats = getSessionStats(session.id);
              return (
                <div 
                  key={session.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{session.topic_covered}</h4>
                        <Badge className={getStatusColor(session.status)}>
                          {session.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {session.period}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Semester {session.semester} - Section {session.section}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {session.geofence_radius}m radius
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Created: {format(new Date(session.created_date), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {stats.present}/{stats.total} Present
                        </p>
                        <p className="text-xs text-gray-500">
                          {stats.rate}% Attendance
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
