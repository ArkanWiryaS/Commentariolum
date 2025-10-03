import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { FileTextIcon, PlusIcon, EditIcon, TrashIcon, ArrowLeftIcon, LoaderIcon, FilterIcon } from "lucide-react";
import { questionAPI, subCategoryAPI } from "../../utils/api";
import toast from "react-hot-toast";

const ManageQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [filterSubCategory, setFilterSubCategory] = useState("");
  
  const [form, setForm] = useState({
    text: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    optionE: "",
    correctAnswer: "A",
    explanation: "",
    subCategoryId: "",
    order: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (filterSubCategory) {
      fetchQuestions(filterSubCategory);
    } else {
      fetchQuestions();
    }
  }, [filterSubCategory]);

  const fetchData = async () => {
    try {
      const [subRes] = await Promise.all([
        subCategoryAPI.getAll(),
      ]);
      setSubCategories(subRes.data);
      await fetchQuestions();
    } catch (error) {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (subCategoryId = "") => {
    try {
      const res = await questionAPI.getAll(subCategoryId);
      setQuestions(res.data);
    } catch (error) {
      toast.error("Gagal memuat soal");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await questionAPI.update(editingQuestion._id, form);
        toast.success("Soal berhasil diupdate");
      } else {
        await questionAPI.create(form);
        toast.success("Soal berhasil ditambahkan");
      }
      setShowModal(false);
      resetForm();
      fetchQuestions(filterSubCategory);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menyimpan soal");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus soal ini?")) return;
    try {
      await questionAPI.delete(id);
      toast.success("Soal berhasil dihapus");
      fetchQuestions(filterSubCategory);
    } catch (error) {
      toast.error("Gagal menghapus soal");
    }
  };

  const resetForm = () => {
    setForm({
      text: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      optionE: "",
      correctAnswer: "A",
      explanation: "",
      subCategoryId: "",
      order: 0,
    });
    setEditingQuestion(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="size-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin/dashboard" className="btn btn-ghost">
            <ArrowLeftIcon className="size-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-4xl font-bold">Kelola Soal</h1>
            <p className="text-base-content/60">Tambah, edit, dan hapus soal tryout</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn btn-primary gap-2"
          >
            <PlusIcon className="size-5" />
            Tambah Soal
          </button>
        </div>

        {/* Filter */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex items-center gap-4">
              <FilterIcon className="size-5" />
              <select
                value={filterSubCategory}
                onChange={(e) => setFilterSubCategory(e.target.value)}
                className="select select-bordered flex-1 max-w-xs"
              >
                <option value="">Semua Kategori</option>
                {subCategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.categoryId?.name} - {sub.name}
                  </option>
                ))}
              </select>
              <div className="text-base-content/60">
                {questions.length} soal ditemukan
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center py-12">
                <FileTextIcon className="size-16 mx-auto text-base-content/30 mb-4" />
                <p className="text-base-content/60">Belum ada soal</p>
              </div>
            </div>
          ) : (
            questions.map((question, index) => (
              <div key={question._id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="badge badge-primary">#{index + 1}</span>
                        <span className="badge badge-ghost">
                          {question.subCategoryId?.name}
                        </span>
                        <span className="badge badge-success">
                          Jawaban: {question.correctAnswer}
                        </span>
                      </div>
                      <p className="text-lg font-medium mb-3">{question.text}</p>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div>A. {question.optionA}</div>
                        <div>B. {question.optionB}</div>
                        <div>C. {question.optionC}</div>
                        <div>D. {question.optionD}</div>
                        <div>E. {question.optionE}</div>
                      </div>
                      {question.explanation && (
                        <div className="mt-3 p-3 bg-base-200 rounded-lg">
                          <span className="font-bold text-sm">Pembahasan: </span>
                          <span className="text-sm">{question.explanation}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setForm({
                            text: question.text,
                            optionA: question.optionA,
                            optionB: question.optionB,
                            optionC: question.optionC,
                            optionD: question.optionD,
                            optionE: question.optionE,
                            correctAnswer: question.correctAnswer,
                            explanation: question.explanation || "",
                            subCategoryId: question.subCategoryId._id,
                            order: question.order,
                          });
                          setEditingQuestion(question);
                          setShowModal(true);
                        }}
                        className="btn btn-ghost btn-sm"
                      >
                        <EditIcon className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(question._id)}
                        className="btn btn-ghost btn-sm text-error"
                      >
                        <TrashIcon className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg mb-4">
              {editingQuestion ? "Edit Soal" : "Tambah Soal"}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Kategori</span></label>
                <select
                  value={form.subCategoryId}
                  onChange={(e) => setForm({ ...form, subCategoryId: e.target.value })}
                  className="select select-bordered"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {subCategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.categoryId?.name} - {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Pertanyaan</span></label>
                <textarea
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  className="textarea textarea-bordered h-24"
                  required
                />
              </div>

              {["A", "B", "C", "D", "E"].map((option) => (
                <div key={option} className="form-control">
                  <label className="label"><span className="label-text">Pilihan {option}</span></label>
                  <input
                    type="text"
                    value={form[`option${option}`]}
                    onChange={(e) => setForm({ ...form, [`option${option}`]: e.target.value })}
                    className="input input-bordered"
                    required
                  />
                </div>
              ))}

              <div className="form-control">
                <label className="label"><span className="label-text">Jawaban Benar</span></label>
                <select
                  value={form.correctAnswer}
                  onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })}
                  className="select select-bordered"
                  required
                >
                  {["A", "B", "C", "D", "E"].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label"><span className="label-text">Pembahasan (opsional)</span></label>
                <textarea
                  value={form.explanation}
                  onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                  className="textarea textarea-bordered"
                />
              </div>

              <div className="modal-action">
                <button type="button" onClick={() => setShowModal(false)} className="btn">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuestions;

