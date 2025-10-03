import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { FolderIcon, PlusIcon, EditIcon, TrashIcon, ArrowLeftIcon, LoaderIcon } from "lucide-react";
import { categoryAPI, subCategoryAPI } from "../../utils/api";
import toast from "react-hot-toast";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "", order: 0 });
  const [subCategoryForm, setSubCategoryForm] = useState({
    name: "",
    categoryId: "",
    questionCount: 0,
    timeLimit: 60,
    order: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        categoryAPI.getAll(),
        subCategoryAPI.getAll(),
      ]);
      setCategories(catRes.data);
      setSubCategories(subRes.data);
    } catch (error) {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory._id, categoryForm);
        toast.success("Kategori berhasil diupdate");
      } else {
        await categoryAPI.create(categoryForm);
        toast.success("Kategori berhasil ditambahkan");
      }
      setShowCategoryModal(false);
      setCategoryForm({ name: "", description: "", order: 0 });
      setEditingCategory(null);
      fetchData();
    } catch (error) {
      toast.error("Gagal menyimpan kategori");
    }
  };

  const handleSaveSubCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingSubCategory) {
        await subCategoryAPI.update(editingSubCategory._id, subCategoryForm);
        toast.success("Sub-kategori berhasil diupdate");
      } else {
        await subCategoryAPI.create(subCategoryForm);
        toast.success("Sub-kategori berhasil ditambahkan");
      }
      setShowSubCategoryModal(false);
      setSubCategoryForm({ name: "", categoryId: "", questionCount: 0, timeLimit: 60, order: 0 });
      setEditingSubCategory(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menyimpan sub-kategori");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;
    try {
      await categoryAPI.delete(id);
      toast.success("Kategori berhasil dihapus");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus kategori");
    }
  };

  const handleDeleteSubCategory = async (id) => {
    if (!confirm("Yakin ingin menghapus sub-kategori ini?")) return;
    try {
      await subCategoryAPI.delete(id);
      toast.success("Sub-kategori berhasil dihapus");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus sub-kategori");
    }
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
          <div>
            <h1 className="text-4xl font-bold">Kelola Kategori</h1>
            <p className="text-base-content/60">Manage categories and sub-categories</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Categories */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="card-title">Kategori Utama</h2>
                <button
                  onClick={() => {
                    setCategoryForm({ name: "", description: "", order: 0 });
                    setEditingCategory(null);
                    setShowCategoryModal(true);
                  }}
                  className="btn btn-primary btn-sm gap-2"
                >
                  <PlusIcon className="size-4" />
                  Tambah
                </button>
              </div>

              <div className="space-y-3">
                {categories.map((cat) => (
                  <div key={cat._id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                    <div>
                      <div className="font-bold">{cat.name}</div>
                      <div className="text-sm text-base-content/60">{cat.description}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setCategoryForm(cat);
                          setEditingCategory(cat);
                          setShowCategoryModal(true);
                        }}
                        className="btn btn-ghost btn-sm"
                      >
                        <EditIcon className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="btn btn-ghost btn-sm text-error"
                      >
                        <TrashIcon className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sub-Categories */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="card-title">Sub-Kategori</h2>
                <button
                  onClick={() => {
                    setSubCategoryForm({ name: "", categoryId: "", questionCount: 0, timeLimit: 60, order: 0 });
                    setEditingSubCategory(null);
                    setShowSubCategoryModal(true);
                  }}
                  className="btn btn-secondary btn-sm gap-2"
                >
                  <PlusIcon className="size-4" />
                  Tambah
                </button>
              </div>

              <div className="space-y-3">
                {subCategories.map((sub) => (
                  <div key={sub._id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                    <div>
                      <div className="font-bold">{sub.name}</div>
                      <div className="text-sm text-base-content/60">
                        {sub.categoryId?.name} • {sub.questionCount} soal • {sub.timeLimit} menit
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSubCategoryForm({
                            name: sub.name,
                            categoryId: sub.categoryId._id,
                            questionCount: sub.questionCount,
                            timeLimit: sub.timeLimit,
                            order: sub.order,
                          });
                          setEditingSubCategory(sub);
                          setShowSubCategoryModal(true);
                        }}
                        className="btn btn-ghost btn-sm"
                      >
                        <EditIcon className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubCategory(sub._id)}
                        className="btn btn-ghost btn-sm text-error"
                      >
                        <TrashIcon className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {editingCategory ? "Edit Kategori" : "Tambah Kategori"}
            </h3>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Nama</span></label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Deskripsi</span></label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="textarea textarea-bordered"
                />
              </div>
              <div className="modal-action">
                <button type="button" onClick={() => setShowCategoryModal(false)} className="btn">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SubCategory Modal */}
      {showSubCategoryModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {editingSubCategory ? "Edit Sub-Kategori" : "Tambah Sub-Kategori"}
            </h3>
            <form onSubmit={handleSaveSubCategory} className="space-y-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Nama</span></label>
                <input
                  type="text"
                  value={subCategoryForm.name}
                  onChange={(e) => setSubCategoryForm({ ...subCategoryForm, name: e.target.value })}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Kategori</span></label>
                <select
                  value={subCategoryForm.categoryId}
                  onChange={(e) => setSubCategoryForm({ ...subCategoryForm, categoryId: e.target.value })}
                  className="select select-bordered"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Jumlah Soal Target</span></label>
                <input
                  type="number"
                  value={subCategoryForm.questionCount}
                  onChange={(e) => setSubCategoryForm({ ...subCategoryForm, questionCount: parseInt(e.target.value) })}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label"><span className="label-text">Waktu (menit)</span></label>
                <input
                  type="number"
                  value={subCategoryForm.timeLimit}
                  onChange={(e) => setSubCategoryForm({ ...subCategoryForm, timeLimit: parseInt(e.target.value) })}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="modal-action">
                <button type="button" onClick={() => setShowSubCategoryModal(false)} className="btn">
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

export default ManageCategories;

