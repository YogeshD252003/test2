// entities/AttendanceRecord.js

export const AttendanceRecord = {
  name: "AttendanceRecord",
  type: "object",
  properties: {
    session_id: {
      type: "string",
      description: "ID of the session",
    },
    student_id: {
      type: "string",
      description: "ID of the student",
    },
    student_name: {
      type: "string",
      description: "Name of the student",
    },
    student_usn: {
      type: "string",
      description: "Student USN",
    },
    status: {
      type: "string",
      enum: ["present", "absent", "flagged"],
      description: "Attendance status",
    },
    method: {
      type: "string",
      enum: ["face_recognition_otp", "manual", "auto"],
      description: "Method used to mark attendance",
    },
    verified: {
      type: "boolean",
      default: false,
      description: "Whether attendance is verified",
    },
    edited_by_teacher: {
      type: "boolean",
      default: false,
      description: "Whether teacher manually edited this record",
    },
    otp_used: {
      type: "string",
      description: "OTP code used for verification",
    },
    marked_at: {
      type: "string",
      format: "date-time",
      description: "When attendance was marked",
    },
  },
  required: [
    "session_id",
    "student_id",
    "student_name",
    "student_usn",
    "status",
  ],
};

// Optional: Example method for fetching mock data
AttendanceRecord.list = () => {
  return Promise.resolve([
    {
      session_id: "101",
      student_id: "1",
      student_name: "Alice",
      student_usn: "S001",
      status: "present",
      method: "manual",
      verified: true,
      edited_by_teacher: false,
      otp_used: "123456",
      marked_at: new Date().toISOString(),
    },
    {
      session_id: "101",
      student_id: "2",
      student_name: "Bob",
      student_usn: "S002",
      status: "absent",
      method: "manual",
      verified: false,
      edited_by_teacher: true,
      otp_used: "654321",
      marked_at: new Date().toISOString(),
    },
  ]);
};
