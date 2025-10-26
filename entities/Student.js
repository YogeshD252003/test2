// entities/Student.js

export const Student = {
  name: "Student",
  type: "object",
  properties: {
    name: {
      type: "string",
      description: "Student's full name",
    },
    email: {
      type: "string",
      format: "email",
      description: "Student's email address",
    },
    password: {
      type: "string",
      description: "Encrypted password",
    },
    usn: {
      type: "string",
      description: "University Serial Number",
    },
    semester: {
      type: "number",
      minimum: 1,
      maximum: 8,
      description: "Current semester (1-8)",
    },
    section: {
      type: "string",
      enum: ["A", "B", "C", "D"],
      description: "Section (A, B, C, or D)",
    },
  },
  required: ["name", "email", "password", "usn", "semester", "section"],
};

// Optional: mock method to get list of students
Student.list = () => {
  return Promise.resolve([
    {
      name: "Alice",
      email: "alice@example.com",
      password: "hashed_password_1",
      usn: "S001",
      semester: 3,
      section: "A",
    },
    {
      name: "Bob",
      email: "bob@example.com",
      password: "hashed_password_2",
      usn: "S002",
      semester: 3,
      section: "B",
    },
  ]);
};
