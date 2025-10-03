import TestSession from "../models/TestSession.js";
import Answer from "../models/Answer.js";
import Question from "../models/Question.js";
import Student from "../models/Student.js";
import SubCategory from "../models/SubCategory.js";

// @desc    Start a new test session
// @route   POST /api/test-sessions/start
export async function startTestSession(req, res) {
  try {
    const { studentId, subCategoryId } = req.body;

    // Validate student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Validate subcategory
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    // Get all questions for this subcategory
    const questions = await Question.find({ 
      subCategoryId,
      isActive: true 
    }).select("-correctAnswer -explanation");

    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions available for this test" });
    }

    // Create test session
    const testSession = await TestSession.create({
      studentId,
      subCategoryId,
      startTime: new Date(),
      status: "in_progress",
    });

    // Create answer records for all questions
    const answers = questions.map((question) => ({
      testSessionId: testSession._id,
      questionId: question._id,
      selectedAnswer: null,
      isCorrect: false,
      markedForReview: false,
    }));

    await Answer.insertMany(answers);

    res.status(201).json({
      testSession,
      questions,
      timeLimit: subCategory.timeLimit,
    });
  } catch (error) {
    console.error("Error in startTestSession:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Get active test session
// @route   GET /api/test-sessions/:id
export async function getTestSession(req, res) {
  try {
    const testSession = await TestSession.findById(req.params.id)
      .populate("studentId")
      .populate("subCategoryId");
    
    if (!testSession) {
      return res.status(404).json({ message: "Test session not found" });
    }

    // Get all answers for this session
    const answers = await Answer.find({ testSessionId: req.params.id })
      .populate("questionId", "-correctAnswer -explanation");

    res.status(200).json({
      testSession,
      answers,
    });
  } catch (error) {
    console.error("Error in getTestSession:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Save/update answer
// @route   PUT /api/test-sessions/:id/answer
export async function saveAnswer(req, res) {
  try {
    const { questionId, selectedAnswer, markedForReview } = req.body;

    // Find the answer record
    let answer = await Answer.findOne({
      testSessionId: req.params.id,
      questionId,
    });

    if (!answer) {
      return res.status(404).json({ message: "Answer record not found" });
    }

    // Update answer
    answer.selectedAnswer = selectedAnswer;
    answer.markedForReview = markedForReview || false;
    
    // Don't check correctness yet (will be done on submit)
    await answer.save();

    res.status(200).json(answer);
  } catch (error) {
    console.error("Error in saveAnswer:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Submit test and calculate results
// @route   POST /api/test-sessions/:id/submit
export async function submitTest(req, res) {
  try {
    const testSession = await TestSession.findById(req.params.id);
    
    if (!testSession) {
      return res.status(404).json({ message: "Test session not found" });
    }

    if (testSession.status === "completed") {
      return res.status(400).json({ message: "Test already submitted" });
    }

    // Get all answers for this session
    const answers = await Answer.find({ testSessionId: req.params.id }).populate("questionId");

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unanswered = 0;

    // Check each answer
    for (let answer of answers) {
      if (!answer.selectedAnswer) {
        unanswered++;
      } else {
        const isCorrect = answer.selectedAnswer === answer.questionId.correctAnswer;
        answer.isCorrect = isCorrect;
        
        if (isCorrect) {
          correctAnswers++;
        } else {
          wrongAnswers++;
        }
        
        await answer.save();
      }
    }

    // Calculate score (you can customize this)
    const totalQuestions = answers.length;
    const score = (correctAnswers / totalQuestions) * 100;

    // Calculate total time
    const endTime = new Date();
    const totalTime = Math.floor((endTime - testSession.startTime) / 1000); // in seconds

    // Update test session
    testSession.endTime = endTime;
    testSession.status = "completed";
    testSession.totalTime = totalTime;
    testSession.correctAnswers = correctAnswers;
    testSession.wrongAnswers = wrongAnswers;
    testSession.unanswered = unanswered;
    testSession.score = score;

    await testSession.save();

    // Return results with explanations
    const detailedAnswers = await Answer.find({ testSessionId: req.params.id })
      .populate("questionId");

    res.status(200).json({
      testSession,
      results: {
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        unanswered,
        score: score.toFixed(2),
        totalTime,
      },
      answers: detailedAnswers,
    });
  } catch (error) {
    console.error("Error in submitTest:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Get all test sessions (for admin)
// @route   GET /api/test-sessions
export async function getAllTestSessions(req, res) {
  try {
    const { status, studentId, subCategoryId } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (studentId) filter.studentId = studentId;
    if (subCategoryId) filter.subCategoryId = subCategoryId;

    const testSessions = await TestSession.find(filter)
      .populate("studentId", "name email school")
      .populate("subCategoryId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(testSessions);
  } catch (error) {
    console.error("Error in getAllTestSessions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Get test session results
// @route   GET /api/test-sessions/:id/results
export async function getTestResults(req, res) {
  try {
    const testSession = await TestSession.findById(req.params.id)
      .populate("studentId")
      .populate("subCategoryId");
    
    if (!testSession) {
      return res.status(404).json({ message: "Test session not found" });
    }

    if (testSession.status !== "completed") {
      return res.status(400).json({ message: "Test not yet completed" });
    }

    // Get detailed answers
    const answers = await Answer.find({ testSessionId: req.params.id })
      .populate("questionId");

    res.status(200).json({
      testSession,
      answers,
    });
  } catch (error) {
    console.error("Error in getTestResults:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Get test statistics
// @route   GET /api/test-sessions/stats/overview
export async function getTestStats(req, res) {
  try {
    const totalTests = await TestSession.countDocuments();
    const completedTests = await TestSession.countDocuments({ status: "completed" });
    const inProgressTests = await TestSession.countDocuments({ status: "in_progress" });

    // Average score
    const avgScoreResult = await TestSession.aggregate([
      { $match: { status: "completed" } },
      {
        $group: {
          _id: null,
          averageScore: { $avg: "$score" },
        },
      },
    ]);

    const averageScore = avgScoreResult.length > 0 ? avgScoreResult[0].averageScore : 0;

    // Top performers
    const topPerformers = await TestSession.find({ status: "completed" })
      .populate("studentId", "name school")
      .populate("subCategoryId", "name")
      .sort({ score: -1 })
      .limit(10);

    res.status(200).json({
      totalTests,
      completedTests,
      inProgressTests,
      averageScore: averageScore.toFixed(2),
      topPerformers,
    });
  } catch (error) {
    console.error("Error in getTestStats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

