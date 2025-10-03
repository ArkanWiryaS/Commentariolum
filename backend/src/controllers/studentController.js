import Student from "../models/Student.js";
import TestSession from "../models/TestSession.js";

// @desc    Get all students
// @route   GET /api/students
export async function getAllStudents(req, res) {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    console.error("Error in getAllStudents:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Get student by ID with test sessions
// @route   GET /api/students/:id
export async function getStudentById(req, res) {
  try {
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get all test sessions for this student
    const testSessions = await TestSession.find({ studentId: req.params.id })
      .populate("subCategoryId", "name timeLimit")
      .sort({ createdAt: -1 });

    res.status(200).json({
      ...student.toObject(),
      testSessions,
    });
  } catch (error) {
    console.error("Error in getStudentById:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Create student
// @route   POST /api/students
export async function createStudent(req, res) {
  try {
    const { name, class: className, school, targetUniversity, phone, email } = req.body;

    // Validate required fields
    if (!name || !className || !school || !targetUniversity || !phone || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const student = await Student.create({
      name,
      class: className,
      school,
      targetUniversity,
      phone,
      email,
    });

    res.status(201).json(student);
  } catch (error) {
    console.error("Error in createStudent:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Update student
// @route   PUT /api/students/:id
export async function updateStudent(req, res) {
  try {
    const { name, class: className, school, targetUniversity, phone, email } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { name, class: className, school, targetUniversity, phone, email },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("Error in updateStudent:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Delete student
// @route   DELETE /api/students/:id
export async function deleteStudent(req, res) {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Optionally delete all test sessions for this student
    // await TestSession.deleteMany({ studentId: req.params.id });

    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error in deleteStudent:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Get students statistics
// @route   GET /api/students/stats
export async function getStudentsStats(req, res) {
  try {
    const totalStudents = await Student.countDocuments();
    const totalSessions = await TestSession.countDocuments();
    const completedSessions = await TestSession.countDocuments({ status: "completed" });

    // Group by school
    const bySchool = await Student.aggregate([
      {
        $group: {
          _id: "$school",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Group by target university
    const byUniversity = await Student.aggregate([
      {
        $group: {
          _id: "$targetUniversity",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      totalStudents,
      totalSessions,
      completedSessions,
      bySchool,
      byUniversity,
    });
  } catch (error) {
    console.error("Error in getStudentsStats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

