import React from "react";
import { Link } from "react-router";
import { BookOpenIcon, UserIcon, SparklesIcon, ClockIcon, AwardIcon, UsersIcon } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150"></div>
              <div className="relative bg-primary/10 p-8 rounded-full border-4 border-primary/20">
                <BookOpenIcon className="size-20 text-primary" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tryout SNBT 2025
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-base-content/80 mb-4 max-w-3xl mx-auto">
            Persiapan Terbaik Menuju Perguruan Tinggi Impian
          </p>
          
          <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
            Uji kemampuanmu dengan soal-soal berkualitas dan sistem penilaian yang akurat
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
          <Link
            to="/register"
            className="btn btn-primary btn-lg gap-3 shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all duration-300 group"
          >
            <SparklesIcon className="size-6 group-hover:rotate-12 transition-transform" />
            <span className="text-xl">Mulai Tryout</span>
          </Link>
          
          <Link
            to="/admin/login"
            className="btn btn-outline btn-lg gap-3 hover:scale-105 transition-all duration-300"
          >
            <UserIcon className="size-6" />
            <span className="text-xl">Admin Login</span>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="card-body items-center text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <ClockIcon className="size-12 text-primary" />
              </div>
              <h3 className="card-title text-2xl mb-2">Real-Time Exam</h3>
              <p className="text-base-content/70">
                Sistem timer otomatis dengan pengalaman ujian yang realistis
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="card-body items-center text-center">
              <div className="p-4 bg-secondary/10 rounded-full mb-4">
                <AwardIcon className="size-12 text-secondary" />
              </div>
              <h3 className="card-title text-2xl mb-2">Instant Results</h3>
              <p className="text-base-content/70">
                Hasil langsung tersedia dengan pembahasan lengkap
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="card-body items-center text-center">
              <div className="p-4 bg-accent/10 rounded-full mb-4">
                <UsersIcon className="size-12 text-accent" />
              </div>
              <h3 className="card-title text-2xl mb-2">Track Progress</h3>
              <p className="text-base-content/70">
                Pantau perkembangan dan analisis performa kamu
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-3xl mb-6 justify-center">
                <BookOpenIcon className="size-8 text-primary" />
                Apa itu SNBT?
              </h2>
              <p className="text-lg text-base-content/80 leading-relaxed mb-4">
                <strong>Seleksi Nasional Berdasarkan Tes (SNBT)</strong> adalah jalur seleksi masuk perguruan tinggi negeri yang menggunakan hasil Ujian Tulis Berbasis Komputer (UTBK). SNBT menilai kemampuan penalaran, pemahaman umum, dan kemampuan akademis calon mahasiswa.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <h4 className="font-bold text-lg mb-2 text-primary">Tes Potensi Skolastik (TPS)</h4>
                  <ul className="list-disc list-inside space-y-1 text-base-content/70">
                    <li>Penalaran Umum</li>
                    <li>Pemahaman Bacaan & Menulis</li>
                    <li>Pengetahuan & Pemahaman Umum</li>
                    <li>Pengetahuan Kuantitatif</li>
                  </ul>
                </div>
                <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/20">
                  <h4 className="font-bold text-lg mb-2 text-secondary">Tes Literasi</h4>
                  <ul className="list-disc list-inside space-y-1 text-base-content/70">
                    <li>Literasi Bahasa Indonesia</li>
                    <li>Literasi Bahasa Inggris</li>
                    <li>Penalaran Matematika</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-300 text-base-content">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpenIcon className="size-8 text-primary" />
            <span className="text-2xl font-bold">Tryout SNBT 2025</span>
          </div>
          <p className="max-w-md">
            Platform tryout online terpercaya untuk persiapan SNBT
          </p>
          <p className="text-base-content/60">
            © 2025 All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

