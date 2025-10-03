import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { LockIcon, UserIcon, EyeIcon, EyeOffIcon, ShieldCheckIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error("Mohon isi semua field");
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        toast.success("Login berhasil!");
        navigate("/admin/dashboard");
      } else {
        toast.error(result.message || "Login gagal");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                <div className="relative bg-primary/10 p-6 rounded-full border-2 border-primary/20">
                  <ShieldCheckIcon className="size-16 text-primary" />
                </div>
              </div>
            </div>
          </Link>
          
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Admin Panel
            </span>
          </h1>
          <p className="text-lg text-base-content/70">
            Kelola sistem tryout SNBT
          </p>
        </div>

        {/* Login Form */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <UserIcon className="size-4" />
                    Username
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="Masukkan username"
                  className="input input-bordered"
                  autoComplete="username"
                />
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <LockIcon className="size-4" />
                    Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Masukkan password"
                    className="input input-bordered w-full pr-12"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="size-5" />
                    ) : (
                      <EyeIcon className="size-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full gap-2"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Memproses...
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon className="size-5" />
                    Login
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Info */}
        <div className="text-center mt-6">
          <Link to="/" className="link link-primary">
            Kembali ke Beranda
          </Link>
        </div>

        {/* Default Credentials Info (for development) */}
        <div className="alert alert-info mt-6 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <div className="font-bold">Default Login:</div>
            <div>Username: admin | Password: admin123</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

