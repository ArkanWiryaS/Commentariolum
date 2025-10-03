import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  LayoutDashboardIcon,
  UsersIcon,
  BookOpenIcon,
  FileTextIcon,
  AwardIcon,
  TrendingUpIcon,
  LogOutIcon,
  FolderIcon,
  ClipboardListIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { studentAPI, testSessionAPI, categoryAPI } from "../../utils/api";
import { formatDate } from "../../utils/helpers";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTests: 0,
    completedTests: 0,
    averageScore: 0,
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [studentsRes, testsRes, categoriesRes] = await Promise.all([
        studentAPI.getStats(),
        testSessionAPI.getStats(),
        categoryAPI.getAll(),
      ]);

      setStats({
        totalStudents: studentsRes.data.totalStudents,
        totalTests: testsRes.data.totalTests,
        completedTests: testsRes.data.completedTests,
        averageScore: testsRes.data.averageScore,
      });

      setRecentSessions(testsRes.data.topPerformers.slice(0, 5));
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logout berhasil");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-base-content/70">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-xl">
                <LayoutDashboardIcon className="size-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-base-content/60">
                  Selamat datang, {admin?.name}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-ghost gap-2"
            >
              <LogOutIcon className="size-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <UsersIcon className="size-8" />
              </div>
              <div className="stat-title">Total Siswa</div>
              <div className="stat-value text-primary">{stats.totalStudents}</div>
              <div className="stat-desc">Terdaftar di sistem</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <ClipboardListIcon className="size-8" />
              </div>
              <div className="stat-title">Total Test</div>
              <div className="stat-value text-secondary">{stats.totalTests}</div>
              <div className="stat-desc">{stats.completedTests} selesai</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-accent">
                <AwardIcon className="size-8" />
              </div>
              <div className="stat-title">Rata-rata Skor</div>
              <div className="stat-value text-accent">{stats.averageScore}</div>
              <div className="stat-desc">Dari semua test</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-success">
                <TrendingUpIcon className="size-8" />
              </div>
              <div className="stat-title">Completion Rate</div>
              <div className="stat-value text-success">
                {stats.totalTests > 0
                  ? Math.round((stats.completedTests / stats.totalTests) * 100)
                  : 0}
                %
              </div>
              <div className="stat-desc">Test diselesaikan</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/admin/categories"
                className="btn btn-lg btn-outline btn-primary justify-start gap-4"
              >
                <FolderIcon className="size-6" />
                <div className="text-left">
                  <div className="font-bold">Kelola Kategori</div>
                  <div className="text-xs opacity-70">
                    {categories.length} kategori
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/questions"
                className="btn btn-lg btn-outline btn-secondary justify-start gap-4"
              >
                <FileTextIcon className="size-6" />
                <div className="text-left">
                  <div className="font-bold">Kelola Soal</div>
                  <div className="text-xs opacity-70">
                    Tambah & edit soal
                  </div>
                </div>
              </Link>

              <Link
                to="/admin/results"
                className="btn btn-lg btn-outline btn-accent justify-start gap-4"
              >
                <BookOpenIcon className="size-6" />
                <div className="text-left">
                  <div className="font-bold">Lihat Hasil</div>
                  <div className="text-xs opacity-70">
                    Analisis performa
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Results */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="card-title text-2xl">Top Performers</h2>
              <Link to="/admin/results" className="btn btn-sm btn-ghost">
                Lihat Semua →
              </Link>
            </div>

            {recentSessions.length === 0 ? (
              <div className="text-center py-8 text-base-content/60">
                <BookOpenIcon className="size-16 mx-auto mb-4 opacity-50" />
                <p>Belum ada test yang diselesaikan</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Ranking</th>
                      <th>Nama</th>
                      <th>Sekolah</th>
                      <th>Test</th>
                      <th>Skor</th>
                      <th>Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSessions.map((session, index) => (
                      <tr key={session._id} className="hover">
                        <td>
                          <div className="flex items-center gap-2">
                            {index === 0 && (
                              <span className="badge badge-warning">🥇</span>
                            )}
                            {index === 1 && (
                              <span className="badge badge-neutral">🥈</span>
                            )}
                            {index === 2 && (
                              <span className="badge badge-accent">🥉</span>
                            )}
                            {index > 2 && <span>#{index + 1}</span>}
                          </div>
                        </td>
                        <td>
                          <div className="font-bold">{session.studentId.name}</div>
                        </td>
                        <td>{session.studentId.school}</td>
                        <td>{session.subCategoryId.name}</td>
                        <td>
                          <div className="badge badge-primary badge-lg">
                            {session.score.toFixed(0)}
                          </div>
                        </td>
                        <td className="text-sm text-base-content/60">
                          {formatDate(session.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

