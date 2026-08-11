import User from "../models/User.js";

// to search the student by roll no
export async function searchStudentsByRoll(req, res) {
  try {
    const roll = String(req.query.roll || "").trim();

    if (!roll) {
      return res.status(200).json({ success: true, students: [] });
    }

    // স্পেশাল ক্যারেক্টার এস্কেপ করা নিরাপদ
    const escapedRoll = roll.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rollRegex = new RegExp(escapedRoll, "i");

    // ডাটাবেজ থেকে স্টুডেন্টদের খোঁজা হচ্ছে
    const students = await User.find({
      role: "user",
      isVerified: true, // শুধুমাত্র ভেরিফাইড স্টুডেন্ট সার্চ করতে
      rollNo: { $regex: rollRegex }
    })
      .select("name email department stream semester year rollNo")
      .limit(12);

    // ফ্রন্টএন্ডে পাঠানোর জন্য ডাটা ফরম্যাট করা
    const mappedStudents = students.map((student) => ({
      id: student._id,
      name: student.name,
      email: student.email,
      department: student.department || "",
      stream: student.stream || "",
      academicYear: student.year || "",
      semester: student.semester || "",
      rollNumber: student.rollNo || ""
    }));

    return res.status(200).json({
      success: true,
      count: mappedStudents.length,
      students: mappedStudents
    });

  } catch (error) {
    console.error("Error searching students by roll:", error);
    return res.status(500).json({
      success: false,
      message: "Error searching students by roll",
      error: error.message
    });
  }
}