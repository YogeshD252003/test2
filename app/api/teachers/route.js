import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "teachers.json");

export async function GET() {
  const data = await fs.readFile(filePath, "utf8");
  const teachers = JSON.parse(data);
  return new Response(JSON.stringify(teachers), { status: 200 });
}

export async function POST(req) {
  const { name, subject, email } = await req.json();
  const data = await fs.readFile(filePath, "utf8");
  const teachers = JSON.parse(data);

  const newTeacher = {
    id: Date.now(),
    name,
    subject,
    email,
  };

  teachers.push(newTeacher);
  await fs.writeFile(filePath, JSON.stringify(teachers, null, 2));

  return new Response(JSON.stringify(newTeacher), { status: 201 });
}
