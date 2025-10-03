import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { ClockIcon, AlertCircleIcon, CheckCircleIcon, FlagIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { testSessionAPI } from "../utils/api";
import { formatTime, getQuestionStatus, getAnswerStatusColor } from "../utils/helpers";
import toast from "react-hot-toast";

const TryoutPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [testSession, setTestSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTestSession();
  }, [sessionId]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchTestSession = async () => {
    try {
      const response = await testSessionAPI.getSession(sessionId);
      const { testSession: session, answers: sessionAnswers } = response.data;

      if (session.status === "completed") {
        toast.error("Test sudah selesai");
        navigate(`/result/${sessionId}`);
        return;
      }

      setTestSession(session);
      
      // Calculate time left
      const elapsed = Math.floor((new Date() - new Date(session.startTime)) / 1000);
      const timeLimit = session.subCategoryId.timeLimit * 60; // convert to seconds
      const remaining = Math.max(0, timeLimit - elapsed);
      setTimeLeft(remaining);

      // Format questions from answers
      const questionsData = sessionAnswers.map((ans) => ({
        ...ans.questionId,
        answerId: ans._id,
      }));
      setQuestions(questionsData);

      // Format answers object
      const answersObj = {};
      sessionAnswers.forEach((ans) => {
        answersObj[ans.questionId._id] = {
          answerId: ans._id,
          selectedAnswer: ans.selectedAnswer,
          markedForReview: ans.markedForReview,
        };
      });
      setAnswers(answersObj);
    } catch (error) {
      console.error("Error fetching test session:", error);
      toast.error("Gagal memuat data test");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = async (option) => {
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestion._id] || {};

    // Update local state
    const updatedAnswers = {
      ...answers,
      [currentQuestion._id]: {
        ...currentAnswer,
        selectedAnswer: option,
      },
    };
    setAnswers(updatedAnswers);

    // Save to backend
    try {
      await testSessionAPI.saveAnswer(sessionId, {
        questionId: currentQuestion._id,
        selectedAnswer: option,
        markedForReview: currentAnswer.markedForReview || false,
      });
    } catch (error) {
      console.error("Error saving answer:", error);
      toast.error("Gagal menyimpan jawaban");
    }
  };

  const handleMarkForReview = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestion._id] || {};
    const newMarkedStatus = !currentAnswer.markedForReview;

    // Update local state
    const updatedAnswers = {
      ...answers,
      [currentQuestion._id]: {
        ...currentAnswer,
        markedForReview: newMarkedStatus,
      },
    };
    setAnswers(updatedAnswers);

    // Save to backend
    try {
      await testSessionAPI.saveAnswer(sessionId, {
        questionId: currentQuestion._id,
        selectedAnswer: currentAnswer.selectedAnswer || null,
        markedForReview: newMarkedStatus,
      });
      
      toast.success(newMarkedStatus ? "Ditandai untuk review" : "Tanda review dihapus");
    } catch (error) {
      console.error("Error marking for review:", error);
      toast.error("Gagal menandai soal");
    }
  };

  const handleNavigate = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleAutoSubmit = async () => {
    toast.error("Waktu habis! Mengumpulkan jawaban...");
    await handleSubmitTest();
  };

  const handleSubmitTest = async () => {
    setSubmitting(true);
    
    try {
      await testSessionAPI.submit(sessionId);
      toast.success("Test berhasil dikumpulkan!");
      navigate(`/result/${sessionId}`);
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.error("Gagal mengumpulkan jawaban");
      setSubmitting(false);
    }
  };

  const getAnswerStats = () => {
    const answered = Object.values(answers).filter((a) => a.selectedAnswer).length;
    const marked = Object.values(answers).filter((a) => a.markedForReview).length;
    const notAnswered = questions.length - answered;

    return { answered, marked, notAnswered };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-base-content/70">Memuat soal...</p>
        </div>
      </div>
    );
  }

  if (!testSession || questions.length === 0) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <AlertCircleIcon className="size-16 text-error mx-auto mb-4" />
          <p className="text-xl text-base-content">Data test tidak ditemukan</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion._id] || {};
  const stats = getAnswerStats();

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header with Timer */}
      <div className="bg-base-100 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{testSession.subCategoryId.name}</h1>
              <p className="text-sm text-base-content/60">
                {testSession.studentId.name} • {testSession.studentId.school}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 ${
                timeLeft < 300 ? "border-error bg-error/10" : "border-primary bg-primary/10"
              }`}>
                <ClockIcon className={`size-6 ${timeLeft < 300 ? "text-error" : "text-primary"}`} />
                <span className={`text-2xl font-bold font-mono ${
                  timeLeft < 300 ? "text-error" : "text-primary"
                }`}>
                  {formatTime(timeLeft)}
                </span>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => setShowSubmitModal(true)}
                className="btn btn-primary"
              >
                Selesai Mengerjakan
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-success"></div>
              <span>Dijawab: {stats.answered}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-warning"></div>
              <span>Ditandai: {stats.marked}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-base-300"></div>
              <span>Belum Dijawab: {stats.notAnswered}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Card */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold">
                    Soal Nomor {currentQuestionIndex + 1}
                  </h2>
                  <button
                    onClick={handleMarkForReview}
                    className={`btn btn-sm gap-2 ${
                      currentAnswer.markedForReview ? "btn-warning" : "btn-ghost"
                    }`}
                  >
                    <FlagIcon className="size-4" />
                    {currentAnswer.markedForReview ? "Ditandai" : "Tandai"}
                  </button>
                </div>

                <div className="prose max-w-none mb-6">
                  <p className="text-lg leading-relaxed">{currentQuestion.text}</p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {["A", "B", "C", "D", "E"].map((option) => (
                    <label
                      key={option}
                      className={`
                        flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${
                          currentAnswer.selectedAnswer === option
                            ? "border-primary bg-primary/10"
                            : "border-base-300 hover:border-primary/50"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={option}
                        checked={currentAnswer.selectedAnswer === option}
                        onChange={() => handleAnswerSelect(option)}
                        className="radio radio-primary mt-1"
                      />
                      <div className="flex-1">
                        <span className="font-bold mr-2">{option}.</span>
                        <span>{currentQuestion[`option${option}`]}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="btn btn-outline gap-2"
              >
                <ChevronLeftIcon className="size-5" />
                Sebelumnya
              </button>

              <span className="text-base-content/60">
                {currentQuestionIndex + 1} dari {questions.length}
              </span>

              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className="btn btn-outline gap-2"
              >
                Selanjutnya
                <ChevronRightIcon className="size-5" />
              </button>
            </div>
          </div>

          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl sticky top-24">
              <div className="card-body">
                <h3 className="card-title text-lg mb-4">Semua Soal</h3>
                
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((question, index) => {
                    const answer = answers[question._id] || {};
                    const status = getQuestionStatus(answer);
                    
                    return (
                      <button
                        key={question._id}
                        onClick={() => handleNavigate(index)}
                        className={`
                          aspect-square rounded-lg font-bold transition-all
                          ${getAnswerStatusColor(status)}
                          ${currentQuestionIndex === index ? "ring-2 ring-primary ring-offset-2" : ""}
                          hover:scale-110
                        `}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="divider"></div>

                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="btn btn-primary btn-block"
                >
                  Selesai Mengerjakan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Konfirmasi Pengumpulan</h3>
            
            <div className="space-y-4 mb-6">
              <div className="alert alert-warning">
                <AlertCircleIcon className="size-6" />
                <div>
                  <p className="font-bold">Perhatian!</p>
                  <p className="text-sm">Setelah dikumpulkan, Anda tidak bisa mengubah jawaban lagi.</p>
                </div>
              </div>

              <div className="stats stats-vertical w-full shadow">
                <div className="stat">
                  <div className="stat-title">Total Soal</div>
                  <div className="stat-value text-primary">{questions.length}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Terjawab</div>
                  <div className="stat-value text-success">{stats.answered}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Belum Dijawab</div>
                  <div className="stat-value text-error">{stats.notAnswered}</div>
                </div>
              </div>

              <p className="text-center">Apakah Anda yakin ingin mengumpulkan jawaban?</p>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="btn btn-ghost"
                disabled={submitting}
              >
                Batal
              </button>
              <button
                onClick={handleSubmitTest}
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Mengumpulkan...
                  </>
                ) : (
                  "Ya, Kumpulkan"
                )}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => !submitting && setShowSubmitModal(false)}></div>
        </div>
      )}
    </div>
  );
};

export default TryoutPage;

