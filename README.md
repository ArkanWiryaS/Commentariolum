# 🎓 SNBT Tryout System

Sistem tryout online lengkap untuk persiapan SNBT (Seleksi Nasional Berdasarkan Tes). Dibangun untuk keperluan marketing bimbel ke sekolah-sekolah.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)

## 📸 Screenshots

[Coming soon - Add screenshots here]

## ✨ Features

### 👨‍🎓 Student Features
- ✅ **Pendaftaran Tanpa Password** - Siswa cukup input nama, kelas, sekolah, dll
- ✅ **Multiple Test Categories** - TPS, Literasi (dengan sub-kategori)
- ✅ **Real-time Timer** - Timer countdown dengan auto-submit
- ✅ **Interactive Interface** - Navigasi soal yang intuitif
- ✅ **Mark for Review** - Tandai soal untuk direview nanti
- ✅ **Instant Results** - Hasil langsung dengan pembahasan
- ✅ **Detailed Analysis** - Lihat jawaban benar/salah dengan pembahasan

### 👨‍💼 Admin Features
- ✅ **Secure Login** - JWT authentication
- ✅ **Dashboard Analytics** - Statistics lengkap
- ✅ **Category Management** - CRUD categories & sub-categories
- ✅ **Question Bank** - Kelola soal dengan form lengkap
- ✅ **Results Monitoring** - View & export hasil test
- ✅ **CSV Export** - Export data untuk analisis Excel
- ✅ **Performance Tracking** - Top performers & statistics

## 🏗️ Architecture

```
Commentariolum/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── models/      # MongoDB schemas
│   │   ├── controllers/ # Business logic
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth & rate limiting
│   │   └── config/      # Database & Redis config
│   └── package.json
│
├── frontend/            # React + Vite
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   ├── context/    # Auth context
│   │   └── utils/      # Helpers & API
│   └── package.json
│
└── README.md
```

## 🚀 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Upstash Redis** - Rate limiting

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **TailwindCSS** - Styling
- **DaisyUI** - Component library
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## 📦 Installation

### Prerequisites
- Node.js v16+ 
- MongoDB (local atau MongoDB Atlas)
- Upstash Redis account

### 1. Clone Repository
```bash
git clone https://github.com/ArkanWiryaS/Commentariolum.git
cd Commentariolum
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env dengan konfigurasi Anda

# Create admin account
npm run create-admin

# Start backend
npm run dev
```

Backend akan berjalan di `http://localhost:5001`

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## ⚙️ Configuration

### Backend .env
```env
# Database
MONGO_URI=mongodb://localhost:27017/snbt-tryout
# atau MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/database

# Server
PORT=5001
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

### Database Structure

**7 Collections:**
1. **admins** - Admin users dengan encrypted password
2. **categories** - Kategori utama (TPS, Literasi)
3. **subcategories** - Sub-kategori dengan timer & jumlah soal
4. **questions** - Bank soal dengan 5 pilihan jawaban
5. **students** - Data siswa (nama, kelas, sekolah, dll)
6. **testsessions** - Session test dengan status & scoring
7. **answers** - Jawaban siswa untuk setiap soal

## 🎮 Usage

### For Students
1. Buka `http://localhost:5173`
2. Klik "Mulai Tryout"
3. Isi form pendaftaran
4. Pilih jenis test
5. Kerjakan soal (timer akan berjalan otomatis)
6. Klik "Selesai Mengerjakan" atau tunggu timer habis
7. Lihat hasil & pembahasan

### For Admin
1. Buka `http://localhost:5173/admin/login`
2. Login (default: admin/admin123)
3. **Dashboard** - Lihat statistics
4. **Kelola Kategori** - Tambah TPS, Literasi, dll
5. **Kelola Soal** - Input soal tryout
6. **Lihat Hasil** - Monitor & export hasil siswa

## 📊 API Endpoints

### Public (No Auth)
```
POST   /api/students              # Register student
POST   /api/test-sessions/start   # Start test
GET    /api/test-sessions/:id     # Get session
PUT    /api/test-sessions/:id/answer  # Save answer
POST   /api/test-sessions/:id/submit  # Submit test
GET    /api/test-sessions/:id/results # Get results
```

### Protected (Admin Only)
```
POST   /api/auth/login            # Admin login
GET    /api/categories            # Get categories
POST   /api/categories            # Create category
GET    /api/questions             # Get questions
POST   /api/questions             # Create question
POST   /api/questions/bulk        # Bulk import
GET    /api/test-sessions         # Get all sessions
GET    /api/students/stats        # Get statistics
```

Full API documentation: `backend/API_DOCUMENTATION.md`

## 🎯 Features Highlight

### Tryout Interface (Seperti Gambar yang Diminta)
- ✅ Timer di kanan atas
- ✅ Display soal dengan options A-E
- ✅ Navigasi grid nomor soal
- ✅ Color coding (hijau=dijawab, kuning=ditandai, abu=kosong)
- ✅ Button "Selesai Mengerjakan"
- ✅ Mark for review functionality

### Scoring System
- **Otomatis** - Langsung dihitung saat submit
- **Transparent** - Benar, salah, kosong
- **Percentage based** - Skor dari 0-100
- **Time tracking** - Durasi pengerjaan dicatat

### Data yang Disimpan
Setiap test session mencatat:
- Nama, kelas, asal sekolah, tujuan PTN
- Email & nomor HP
- Soal yang dikerjakan & jawaban
- Waktu mulai & selesai
- Total benar, salah, kosong
- Skor akhir

## 🚢 Deployment

### Backend (Railway/Render/Heroku)
1. Push code ke GitHub
2. Connect repository di platform
3. Set environment variables
4. Deploy!

### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Build command: `npm run build`
3. Output directory: `dist`
4. Deploy!

### MongoDB Atlas
1. Create free cluster
2. Whitelist IP: 0.0.0.0/0 (allow all)
3. Copy connection string ke MONGO_URI

### Upstash Redis
1. Create free database
2. Copy REST URL & TOKEN

## 🔒 Security

- ✅ Password hashing dengan bcrypt
- ✅ JWT token authentication
- ✅ Rate limiting (100 req/60s)
- ✅ CORS configuration
- ✅ Input validation
- ✅ MongoDB injection prevention

## 📈 Performance

- ✅ MongoDB indexing untuk query cepat
- ✅ Redis caching untuk rate limit
- ✅ Vite untuk fast build
- ✅ Code splitting ready
- ✅ Lazy loading images

## 🐛 Troubleshooting

### Backend tidak bisa start
```bash
# Check MongoDB connection
# Pastikan MongoDB service running
# Check .env MONGO_URI

# Check port 5001
# Pastikan tidak ada service lain di port 5001
```

### Frontend tidak bisa fetch data
```bash
# Check backend berjalan di http://localhost:5001
# Check Network tab di browser DevTools
# Pastikan CORS tidak block request
```

### Rate limit error
```bash
# Check Upstash Redis credentials
# Verify rate limit configuration di rateLimiter.js
```

## 📝 Default Credentials

**Admin Login:**
- Username: `admin`
- Password: `admin123`

⚠️ **PENTING:** Ganti password setelah first login!

## 🎨 Customization

### Change Theme
Edit `frontend/src/App.jsx`:
```javascript
const [currentTheme, setCurrentTheme] = useState("coffee");
// Ganti "coffee" dengan theme lain: dark, light, cupcake, dll
```

### Add New Test Category
1. Login as admin
2. Go to "Kelola Kategori"
3. Add category (e.g., "Tes Literasi")
4. Add sub-category dengan timer & jumlah soal
5. Add questions via "Kelola Soal"

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

ISC License - see LICENSE file

## 👨‍💻 Author

**ArkanWiryaS**
- GitHub: [@ArkanWiryaS](https://github.com/ArkanWiryaS)
- Repository: [Commentariolum](https://github.com/ArkanWiryaS/Commentariolum)

## 🙏 Acknowledgments

- DaisyUI untuk beautiful components
- MongoDB untuk flexible database
- Upstash untuk serverless Redis
- Vite untuk blazing fast dev experience

---

**Built for SNBT preparation & bimbel marketing** 🎓

Need help? Create an issue atau hubungi maintainer!
