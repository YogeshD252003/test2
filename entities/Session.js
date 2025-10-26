// entities/Session.js

export const Session = {
  name: "Session",
  type: "object",
  properties: {
    teacher_id: {
      type: "string",
      description: "ID of the teacher who created the session",
    },
    teacher_name: {
      type: "string",
      description: "Name of the teacher",
    },
    period: {
      type: "string",
      description: "Class period/time",
    },
    topic_covered: {
      type: "string",
      description: "Topic covered in the session",
    },
    semester: {
      type: "number",
      minimum: 1,
      maximum: 8,
      description: "Target semester",
    },
    section: {
      type: "string",
      enum: ["A", "B", "C", "D"],
      description: "Target section",
    },
    geofence_radius: {
      type: "number",
      description: "Geofence radius in meters",
    },
    timer_minutes: {
      type: "number",
      description: "Session duration in minutes",
    },
    status: {
      type: "string",
      enum: ["active", "completed", "expired"],
      default: "active",
      description: "Session status",
    },
    finalized: {
      type: "boolean",
      default: false,
      description: "Whether attendance has been finalized",
    },
    expires_at: {
      type: "string",
      format: "date-time",
      description: "When the session expires",
    },
  },
  required: [
    "teacher_id",
    "teacher_name",
    "period",
    "topic_covered",
    "semester",
    "section",
    "geofence_radius",
    "timer_minutes",
  ],
};

// Optional: Example method for mock data
Session.list = () => {
  return Promise.resolve([
    {
      teacher_id: "T001",
      teacher_name: "Prof. John",
      period: "09:00-10:00",
      topic_covered: "Math Basics",
      semester: 3,
      section: "A",
      geofence_radius: 50,
      timer_minutes: 60,
      status: "active",
      finalized: false,
      expires_at: new Date().toISOString(),
    },
    {
      teacher_id: "T002",
      teacher_name: "Prof. Alice",
      period: "10:00-11:00",
      topic_covered: "Physics",
      semester: 4,
      section: "B",
      geofence_radius: 50,
      timer_minutes: 60,
      status: "completed",
      finalized: true,
      expires_at: new Date().toISOString(),
    },
  ]);
};
