export async function addStudent(studentData) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      studentData.email,
      studentData.password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "students", user.uid), {
      name: studentData.name,
      email: studentData.email,
      rollNo: studentData.rollNo,
      semester: studentData.semester,
      uid: user.uid,
    });

    console.log("✅ Student created in Auth + Firestore:", user.email);
    return { success: true, uid: user.uid };
  } catch (error) {
    console.error("❌ Firebase Auth Error:", error.code, error.message);
    return { success: false, error };
  }
}
