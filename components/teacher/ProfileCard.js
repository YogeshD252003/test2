import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Building, Crown } from "lucide-react";

export default function ProfileCard({ teacher, onSubscriptionToggle }) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{teacher?.name}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {teacher?.email}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building className="w-4 h-4" />
            <span>Department: {teacher?.department || "Not specified"}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Premium Subscription</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={teacher?.subscription_status}
                onCheckedChange={onSubscriptionToggle}
              />
              <Badge 
                variant={teacher?.subscription_status ? "default" : "secondary"}
                className={teacher?.subscription_status ? "bg-green-100 text-green-800" : ""}
              >
                {teacher?.subscription_status ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}