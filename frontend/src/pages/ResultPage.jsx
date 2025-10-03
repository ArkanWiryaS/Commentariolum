import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  CheckCircleIcon,
  XCircleIcon,
  MinusCircleIcon,
  ClockIcon,
  AwardIcon,
  HomeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { testSessionAPI } from "../utils/api";
import { formatDuration, formatDate, getScoreColor } from "../utils/helpers";
import toast from "react-hot-toast";

const ResultPage = () => {
  const { sessionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [testSession, setTestSession] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    fetchResults();
  }, [sessionId]);

  const fetchResults = async () => {
    try {
      const response = await testSessionAPI.getResults(sessionId);
      setTestSession(response.data.testSession);
      setAnswers(response.data.answers);
    } catch (error) {
      console.error("Error fetching results:", error);
      toast.error("Gagal memuat hasil test");
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-base-content/70">Memuat hasil...</p>
        </div>
      </div>
    );
  }

  if (!testSession) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-base-content">Data hasil tidak ditemukan</p>
          <Link to="/" className="btn btn-primary mt-4">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const percentage = (testSession.correctAnswers / answers.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150"></div>
              <div className="relative bg-primary/10 p-8 rounded-full border-4 border-primary/20">
                <AwardIcon className="size-20 text-primary" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Hasil Tryout
            </span>
          </h1>
          
          <p className="text-xl text-base-content/70">
            {testSession.subCategoryId.name}
          </p>
        </div>

        {/* Student Info */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title mb-4">Informasi Peserta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-base-content/60">Nama</p>
                <p className="font-semibold">{testSession.studentId.name}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Kelas</p>
                <p className="font-semibold">{testSession.studentId.class}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Asal Sekolah</p>
                <p className="font-semibold">{testSession.studentId.school}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Tujuan PTN</p>
                <p className="font-semibold">{testSession.studentId.targetUniversity}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Waktu Pengerjaan</p>
                <p className="font-semibold">{formatDuration(testSession.totalTime)}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Tanggal</p>
                <p className="font-semibold">{formatDate(testSession.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Score Card */}
        <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-2xl mb-6">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-3xl mb-6">Skor Anda</h2>
            <div className={`text-8xl font-bold mb-6 ${getScoreColor(percentage)}`}>
              {percentage.toFixed(0)}
            </div>
            <p className="text-2xl opacity-90">
              {testSession.correctAnswers} dari {answers.length} soal benar
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="stats stats-vertical lg:stats-horizontal shadow w-full mb-6">
          <div className="stat">
            <div className="stat-figure text-success">
              <CheckCircleIcon className="size-8" />
            </div>
            <div className="stat-title">Jawaban Benar</div>
            <div className="stat-value text-success">{testSession.correctAnswers}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-error">
              <XCircleIcon className="size-8" />
            </div>
            <div className="stat-title">Jawaban Salah</div>
            <div className="stat-value text-error">{testSession.wrongAnswers}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-warning">
              <MinusCircleIcon className="size-8" />
            </div>
            <div className="stat-title">Tidak Dijawab</div>
            <div className="stat-value text-warning">{testSession.unanswered}</div>
          </div>
        </div>

        {/* Detailed Answers */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title mb-4">Pembahasan Soal</h2>
            
            <div className="space-y-3">
              {answers.map((answer, index) => {
                const isExpanded = expandedQuestions[answer.questionId._id];
                const question = answer.questionId;

                return (
                  <div
                    key={answer._id}
                    className={`
                      border-2 rounded-xl overflow-hidden transition-all
                      ${
                        answer.isCorrect
                          ? "border-success bg-success/5"
                          : !answer.selectedAnswer
                          ? "border-warning bg-warning/5"
                          : "border-error bg-error/5"
                      }
                    `}
                  >
                    {/* Question Header */}
                    <button
                      onClick={() => toggleQuestion(question._id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-base-200/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {answer.isCorrect ? (
                            <CheckCircleIcon className="size-6 text-success" />
                          ) : !answer.selectedAnswer ? (
                            <MinusCircleIcon className="size-6 text-warning" />
                          ) : (
                            <XCircleIcon className="size-6 text-error" />
                          )}
                          <span className="font-bold">Soal {index + 1}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          {answer.selectedAnswer && (
                            <span className="badge badge-sm">
                              Jawaban: {answer.selectedAnswer}
                            </span>
                          )}
                          <span className="badge badge-success badge-sm">
                            Benar: {question.correctAnswer}
                          </span>
                        </div>
                      </div>

                      {isExpanded ? (
                        <ChevronUpIcon className="size-5" />
                      ) : (
                        <ChevronDownIcon className="size-5" />
                      )}
                    </button>

                    {/* Question Detail */}
                    {isExpanded && (
                      <div className="p-4 border-t border-base-content/10 bg-base-100">
                        <div className="prose max-w-none mb-4">
                          <p className="font-medium">{question.text}</p>
                        </div>

                        <div className="space-y-2 mb-4">
                          {["A", "B", "C", "D", "E"].map((option) => (
                            <div
                              key={option}
                              className={`
                                p-3 rounded-lg border-2 transition-all
                                ${
                                  option === question.correctAnswer
                                    ? "border-success bg-success/10"
                                    : option === answer.selectedAnswer && !answer.isCorrect
                                    ? "border-error bg-error/10"
                                    : "border-base-300"
                                }
                              `}
                            >
                              <div className="flex items-center gap-3">
                                <span className="font-bold">{option}.</span>
                                <span>{question[`option${option}`]}</span>
                                {option === question.correctAnswer && (
                                  <CheckCircleIcon className="size-5 text-success ml-auto" />
                                )}
                                {option === answer.selectedAnswer && !answer.isCorrect && (
                                  <XCircleIcon className="size-5 text-error ml-auto" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {question.explanation && (
                          <div className="alert alert-info">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <div>
                              <div className="font-bold">Pembahasan:</div>
                              <div className="text-sm">{question.explanation}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Link to="/" className="btn btn-primary btn-lg gap-2">
            <HomeIcon className="size-5" />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Motivation Message */}
        <div className="alert alert-success mt-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <h3 className="font-bold">Tetap Semangat!</h3>
            <div className="text-sm">
              {percentage >= 80
                ? "Luar biasa! Pertahankan prestasi ini!"
                : percentage >= 60
                ? "Bagus! Terus latihan untuk hasil yang lebih baik!"
                : "Jangan menyerah! Latihan lebih banyak akan meningkatkan kemampuanmu!"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;

