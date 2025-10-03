import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { BookOpenIcon, ArrowLeftIcon, LoaderIcon, FilterIcon, DownloadIcon, EyeIcon } from "lucide-react";
import { testSessionAPI, subCategoryAPI } from "../../utils/api";
import { formatDate, formatDuration } from "../../utils/helpers";
import toast from "react-hot-toast";

const ViewResults = () => {
  const [sessions, setSessions] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("completed");
  const [filterSubCategory, setFilterSubCategory] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [filterStatus, filterSubCategory]);

  const fetchData = async () => {
    try {
      const subRes = await subCategoryAPI.getAll();
      setSubCategories(subRes.data);
      await fetchSessions();
    } catch (error) {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      if (filterSubCategory) params.subCategoryId = filterSubCategory;
      
      const res = await testSessionAPI.getAll(params);
      setSessions(res.data);
    } catch (error) {
      toast.error("Gagal memuat hasil test");
    }
  };

  const exportToCSV = () => {
    if (sessions.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }

    const headers = [
      "Nama",
      "Kelas",
      "Sekolah",
      "Tujuan PTN",
      "Email",
      "Test",
      "Skor",
      "Benar",
      "Salah",
      "Kosong",
      "Waktu",
      "Tanggal",
    ];

    const rows = sessions.map((session) => [
      session.studentId.name,
      session.studentId.class,
      session.studentId.school,
      session.studentId.targetUniversity,
      session.studentId.email,
      session.subCategoryId.name,
      session.score.toFixed(2),
      session.correctAnswers,
      session.wrongAnswers,
      session.unanswered,
      formatDuration(session.totalTime),
      formatDate(session.createdAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `hasil_tryout_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Data berhasil diekspor");
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
            <h1 className="text-4xl font-bold">Hasil Tryout</h1>
            <p className="text-base-content/60">Lihat dan analisis hasil test siswa</p>
          </div>
          <button onClick={exportToCSV} className="btn btn-primary gap-2">
            <DownloadIcon className="size-5" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-wrap items-center gap-4">
              <FilterIcon className="size-5" />
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="select select-bordered"
              >
                <option value="">Semua Status</option>
                <option value="completed">Selesai</option>
                <option value="in_progress">Sedang Berlangsung</option>
              </select>

              <select
                value={filterSubCategory}
                onChange={(e) => setFilterSubCategory(e.target.value)}
                className="select select-bordered"
              >
                <option value="">Semua Kategori</option>
                {subCategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.categoryId?.name} - {sub.name}
                  </option>
                ))}
              </select>

              <div className="ml-auto text-base-content/60">
                {sessions.length} hasil ditemukan
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        {sessions.length === 0 ? (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center py-12">
              <BookOpenIcon className="size-16 mx-auto text-base-content/30 mb-4" />
              <p className="text-base-content/60">Belum ada hasil test</p>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Nama</th>
                      <th>Kelas</th>
                      <th>Sekolah</th>
                      <th>Test</th>
                      <th>Skor</th>
                      <th>Benar</th>
                      <th>Salah</th>
                      <th>Kosong</th>
                      <th>Waktu</th>
                      <th>Tanggal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => (
                      <tr key={session._id}>
                        <td>
                          <div className="font-bold">{session.studentId.name}</div>
                          <div className="text-sm text-base-content/60">
                            {session.studentId.email}
                          </div>
                        </td>
                        <td>{session.studentId.class}</td>
                        <td className="max-w-xs truncate">
                          {session.studentId.school}
                        </td>
                        <td>
                          <div className="badge badge-ghost badge-sm">
                            {session.subCategoryId.name}
                          </div>
                        </td>
                        <td>
                          <div className="badge badge-primary badge-lg font-bold">
                            {session.score.toFixed(0)}
                          </div>
                        </td>
                        <td>
                          <span className="text-success font-bold">
                            {session.correctAnswers}
                          </span>
                        </td>
                        <td>
                          <span className="text-error font-bold">
                            {session.wrongAnswers}
                          </span>
                        </td>
                        <td>
                          <span className="text-warning font-bold">
                            {session.unanswered}
                          </span>
                        </td>
                        <td className="text-sm">
                          {formatDuration(session.totalTime)}
                        </td>
                        <td className="text-sm">
                          {new Date(session.createdAt).toLocaleDateString("id-ID")}
                        </td>
                        <td>
                          <Link
                            to={`/result/${session._id}`}
                            target="_blank"
                            className="btn btn-ghost btn-sm"
                            title="Lihat Detail"
                          >
                            <EyeIcon className="size-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Summary */}
        {sessions.length > 0 && (
          <div className="stats stats-vertical lg:stats-horizontal shadow mt-6 w-full">
            <div className="stat">
              <div className="stat-title">Total Peserta</div>
              <div className="stat-value text-primary">{sessions.length}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Rata-rata Skor</div>
              <div className="stat-value text-secondary">
                {(sessions.reduce((acc, s) => acc + s.score, 0) / sessions.length).toFixed(1)}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Skor Tertinggi</div>
              <div className="stat-value text-success">
                {Math.max(...sessions.map((s) => s.score)).toFixed(0)}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Skor Terendah</div>
              <div className="stat-value text-error">
                {Math.min(...sessions.map((s) => s.score)).toFixed(0)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewResults;

