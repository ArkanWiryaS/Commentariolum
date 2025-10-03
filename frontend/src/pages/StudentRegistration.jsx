import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { ArrowLeftIcon, UserIcon, BookOpenIcon, LoaderIcon } from "lucide-react";
import { studentAPI, categoryAPI, testSessionAPI } from "../utils/api";
import { isValidEmail, isValidPhone } from "../utils/helpers";
import toast from "react-hot-toast";

const StudentRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    school: "",
    targetUniversity: "",
    phone: "",
    email: "",
    selectedSubCategory: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      const categoriesWithSubs = await Promise.all(
        response.data.map(async (cat) => {
          const subResponse = await categoryAPI.getById(cat._id);
          return subResponse.data;
        })
      );
      setCategories(categoriesWithSubs);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Gagal memuat data kategori");
    } finally {
      setLoadingCategories(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Nama wajib diisi";
    if (!formData.class.trim()) newErrors.class = "Kelas wajib diisi";
    if (!formData.school.trim()) newErrors.school = "Asal sekolah wajib diisi";
    if (!formData.targetUniversity.trim()) newErrors.targetUniversity = "Tujuan PTN wajib diisi";
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor HP wajib diisi";
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = "Format nomor HP tidak valid";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    
    if (!formData.selectedSubCategory) {
      newErrors.selectedSubCategory = "Pilih jenis test yang akan dikerjakan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Mohon lengkapi semua field dengan benar");
      return;
    }

    setLoading(true);

    try {
      // 1. Register student
      const studentResponse = await studentAPI.create({
        name: formData.name,
        class: formData.class,
        school: formData.school,
        targetUniversity: formData.targetUniversity,
        phone: formData.phone,
        email: formData.email,
      });

      const studentId = studentResponse.data._id;

      // 2. Start test session
      const sessionResponse = await testSessionAPI.start(
        studentId,
        formData.selectedSubCategory
      );

      toast.success("Registrasi berhasil! Memulai tryout...");
      
      // Navigate to tryout page
      navigate(`/tryout/${sessionResponse.data.testSession._id}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Gagal memulai tryout");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="btn btn-ghost gap-2 mb-4">
            <ArrowLeftIcon className="size-5" />
            Kembali
          </Link>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <UserIcon className="size-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Registrasi Peserta
              </span>
            </h1>
            <p className="text-lg text-base-content/70">
              Isi data diri dan pilih jenis test yang akan dikerjakan
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <UserIcon className="size-5 text-primary" />
                  Data Diri
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Nama Lengkap *</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama lengkap"
                      className={`input input-bordered ${errors.name ? "input-error" : ""}`}
                    />
                    {errors.name && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.name}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Kelas *</span>
                    </label>
                    <input
                      type="text"
                      name="class"
                      value={formData.class}
                      onChange={handleInputChange}
                      placeholder="Contoh: 12 IPA 1"
                      className={`input input-bordered ${errors.class ? "input-error" : ""}`}
                    />
                    {errors.class && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.class}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-medium">Asal Sekolah *</span>
                    </label>
                    <input
                      type="text"
                      name="school"
                      value={formData.school}
                      onChange={handleInputChange}
                      placeholder="Contoh: SMA Negeri 1 Jakarta"
                      className={`input input-bordered ${errors.school ? "input-error" : ""}`}
                    />
                    {errors.school && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.school}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text font-medium">Tujuan Perguruan Tinggi *</span>
                    </label>
                    <input
                      type="text"
                      name="targetUniversity"
                      value={formData.targetUniversity}
                      onChange={handleInputChange}
                      placeholder="Contoh: Universitas Indonesia"
                      className={`input input-bordered ${errors.targetUniversity ? "input-error" : ""}`}
                    />
                    {errors.targetUniversity && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.targetUniversity}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Nomor HP/WA *</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="08123456789"
                      className={`input input-bordered ${errors.phone ? "input-error" : ""}`}
                    />
                    {errors.phone && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.phone}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Email *</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                      className={`input input-bordered ${errors.email ? "input-error" : ""}`}
                    />
                    {errors.email && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.email}</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              {/* Test Selection */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BookOpenIcon className="size-5 text-primary" />
                  Pilih Jenis Test
                </h3>

                {loadingCategories ? (
                  <div className="text-center py-8">
                    <LoaderIcon className="size-8 animate-spin text-primary mx-auto" />
                    <p className="mt-2 text-base-content/60">Memuat data test...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <div key={category._id}>
                        <h4 className="font-bold text-lg mb-2">{category.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {category.subCategories?.map((sub) => (
                            <label
                              key={sub._id}
                              className={`
                                cursor-pointer p-4 rounded-xl border-2 transition-all duration-200
                                ${
                                  formData.selectedSubCategory === sub._id
                                    ? "border-primary bg-primary/10"
                                    : "border-base-300 hover:border-primary/50"
                                }
                              `}
                            >
                              <input
                                type="radio"
                                name="selectedSubCategory"
                                value={sub._id}
                                checked={formData.selectedSubCategory === sub._id}
                                onChange={handleInputChange}
                                className="radio radio-primary radio-sm mr-3"
                              />
                              <div className="inline-block">
                                <div className="font-semibold">{sub.name}</div>
                                <div className="text-sm text-base-content/60">
                                  {sub.questionCount} soal • {sub.timeLimit} menit
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {errors.selectedSubCategory && (
                  <div className="alert alert-error mt-4">
                    <span>{errors.selectedSubCategory}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="card-actions justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading || loadingCategories}
                  className="btn btn-primary btn-lg w-full gap-2"
                >
                  {loading ? (
                    <>
                      <LoaderIcon className="size-5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <BookOpenIcon className="size-5" />
                      Mulai Tryout
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Info Alert */}
        <div className="alert alert-info mt-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <div className="font-bold">Perhatian!</div>
            <div className="text-sm">Pastikan koneksi internet stabil. Timer akan otomatis berjalan setelah test dimulai.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;

