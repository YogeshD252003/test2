// utils/addTeacher.js (or inside your CreateTeacherPage)
import { auth, db } from "@/app/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function addTeacher(teacherData) {
  try {
    // 1️⃣ Create in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      teacherData.email,
      teacherData.password
    );
    const uid = userCredential.user.uid;

    // 2️⃣ Save in Firestore
    await setDoc(doc(db, "teachers", uid), {
      name: teacherData.name,
      email: teacherData.email,
      phone: teacherData.phone,
      department: teacherData.department,
      subject: teacherData.subject,
      role: "teacher",
      uid,
      createdAt: serverTimestamp(),
    });

    console.log("✅ Teacher added to Auth + Firestore");
    return { success: true, uid };
  } catch (err) {
    console.error("❌ Error adding teacher:", err);
    return { success: false, error: err };
  }
}
