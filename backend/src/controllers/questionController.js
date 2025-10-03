import Question from "../models/Question.js";
import SubCategory from "../models/SubCategory.js";

// @desc    Get all questions
// @route   GET /api/questions
export async function getAllQuestions(req, res) {
  try {
    const { subCategoryId } = req.query;
    const filter = { isActive: true };
    
    if (subCategoryId) {
      filter.subCategoryId = subCategoryId;
    }

    const questions = await Question.find(filter)
      .populate("subCategoryId", "name")
      .sort({ order: 1 });
    
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error in getAllQuestions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Get question by ID
// @route   GET /api/questions/:id
export async function getQuestionById(req, res) {
  try {
    const question = await Question.findById(req.params.id)
      .populate("subCategoryId", "name");
    
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error("Error in getQuestionById:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Get questions for test (without correct answer)
// @route   GET /api/questions/test/:subCategoryId
export async function getQuestionsForTest(req, res) {
  try {
    const questions = await Question.find({ 
      subCategoryId: req.params.subCategoryId,
      isActive: true 
    })
      .select("-correctAnswer -explanation") // Hide correct answer and explanation
      .sort({ order: 1 });
    
    if (questions.length === 0) {
      return res.status(404).json({ message: "No questions found for this test" });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error in getQuestionsForTest:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Create question
// @route   POST /api/questions
export async function createQuestion(req, res) {
  try {
    const {
      text,
      optionA,
      optionB,
      optionC,
      optionD,
      optionE,
      correctAnswer,
      explanation,
      subCategoryId,
      order,
    } = req.body;

    const question = await Question.create({
      text,
      optionA,
      optionB,
      optionC,
      optionD,
      optionE,
      correctAnswer,
      explanation,
      subCategoryId,
      order: order || 0,
    });

    // Update question count in subcategory
    await SubCategory.findByIdAndUpdate(subCategoryId, {
      $inc: { questionCount: 1 },
    });

    await question.populate("subCategoryId", "name");

    res.status(201).json(question);
  } catch (error) {
    console.error("Error in createQuestion:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Update question
// @route   PUT /api/questions/:id
export async function updateQuestion(req, res) {
  try {
    const {
      text,
      optionA,
      optionB,
      optionC,
      optionD,
      optionE,
      correctAnswer,
      explanation,
      subCategoryId,
      order,
      isActive,
    } = req.body;

    const oldQuestion = await Question.findById(req.params.id);
    if (!oldQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      {
        text,
        optionA,
        optionB,
        optionC,
        optionD,
        optionE,
        correctAnswer,
        explanation,
        subCategoryId,
        order,
        isActive,
      },
      { new: true }
    ).populate("subCategoryId", "name");

    // Update question count if subcategory changed
    if (oldQuestion.subCategoryId.toString() !== subCategoryId) {
      await SubCategory.findByIdAndUpdate(oldQuestion.subCategoryId, {
        $inc: { questionCount: -1 },
      });
      await SubCategory.findByIdAndUpdate(subCategoryId, {
        $inc: { questionCount: 1 },
      });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error("Error in updateQuestion:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Delete question
// @route   DELETE /api/questions/:id
export async function deleteQuestion(req, res) {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Update question count in subcategory
    await SubCategory.findByIdAndUpdate(question.subCategoryId, {
      $inc: { questionCount: -1 },
    });

    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("Error in deleteQuestion:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// @desc    Bulk create questions
// @route   POST /api/questions/bulk
export async function bulkCreateQuestions(req, res) {
  try {
    const { questions } = req.body; // Array of question objects

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Invalid questions data" });
    }

    const createdQuestions = await Question.insertMany(questions);

    // Update question counts for each subcategory
    const subCategoryCounts = {};
    questions.forEach((q) => {
      subCategoryCounts[q.subCategoryId] = (subCategoryCounts[q.subCategoryId] || 0) + 1;
    });

    await Promise.all(
      Object.entries(subCategoryCounts).map(([subCategoryId, count]) =>
        SubCategory.findByIdAndUpdate(subCategoryId, {
          $inc: { questionCount: count },
        })
      )
    );

    res.status(201).json({
      message: `${createdQuestions.length} questions created successfully`,
      questions: createdQuestions,
    });
  } catch (error) {
    console.error("Error in bulkCreateQuestions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

