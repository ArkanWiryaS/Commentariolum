# SNBT Tryout Frontend

Frontend aplikasi Tryout SNBT menggunakan React + Vite + TailwindCSS + DaisyUI.

## 🚀 Tech Stack

- **React 19** - UI Library
- **Vite** - Build tool & dev server
- **React Router** - Routing
- **TailwindCSS + DaisyUI** - Styling
- **Axios** - HTTP Client
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## 📦 Installation

```bash
npm install
```

## 🎯 Quick Start

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Aplikasi akan berjalan di `http://localhost:5173`

## 📁 Project Structure

```
frontend/src/
├── pages/
│   ├── LandingPage.jsx              # Landing page
│   ├── StudentRegistration.jsx      # Form pendaftaran siswa
│   ├── TryoutPage.jsx              # Halaman mengerjakan soal
│   ├── ResultPage.jsx              # Halaman hasil test
│   └── admin/
│       ├── AdminLogin.jsx          # Login admin
│       ├── AdminDashboard.jsx      # Dashboard admin
│       ├── ManageCategories.jsx    # Kelola kategori
│       ├── ManageQuestions.jsx     # Kelola soal
│       └── ViewResults.jsx         # Lihat hasil test
├── components/
│   └── ProtectedRoute.jsx          # Route guard untuk admin
├── context/
│   └── AuthContext.jsx             # Auth context & provider
├── utils/
│   ├── api.js                      # API functions
│   └── helpers.js                  # Helper functions
└── App.jsx                          # Main app component
```

## 🔐 Routes

### Public Routes
- `/` - Landing page
- `/register` - Form pendaftaran siswa & pilih test
- `/tryout/:sessionId` - Halaman mengerjakan soal
- `/result/:sessionId` - Halaman hasil test

### Admin Routes (Protected)
- `/admin/login` - Login admin
- `/admin/dashboard` - Dashboard dengan statistics
- `/admin/categories` - Kelola kategori & sub-kategori
- `/admin/questions` - Kelola soal
- `/admin/results` - Lihat & export hasil test

## 🎮 Features

### Student Features
- ✅ Form pendaftaran lengkap (nama, kelas, sekolah, dll)
- ✅ Pilih jenis test yang akan dikerjakan
- ✅ Timer countdown otomatis
- ✅ Navigasi antar soal (previous/next)
- ✅ Grid navigasi semua nomor soal
- ✅ Mark for review
- ✅ Visual indicator (dijawab/ditandai/kosong)
- ✅ Konfirmasi submit dengan summary
- ✅ Hasil langsung dengan pembahasan lengkap
- ✅ Expandable pembahasan tiap soal

### Admin Features
- ✅ Login dengan JWT authentication
- ✅ Dashboard dengan statistics lengkap
- ✅ CRUD Categories & Sub-Categories
- ✅ CRUD Questions dengan form lengkap
- ✅ Filter soal berdasarkan kategori
- ✅ View semua hasil test
- ✅ Filter hasil (status, kategori)
- ✅ Export hasil ke CSV
- ✅ Statistics summary (rata-rata, tertinggi, terendah)

## 🎨 Theme

Default theme: **Coffee** (warm & cozy)

Bisa diganti dengan edit di `App.jsx`:
```javascript
const [currentTheme, setCurrentTheme] = useState("coffee");
```

Available DaisyUI themes:
- light, dark, cupcake, bumblebee, emerald, corporate, synthwave
- retro, cyberpunk, valentine, halloween, garden, forest, aqua
- lofi, pastel, fantasy, wireframe, black, dracula, coffee, winter, dim, nord, sunset

## 🔧 Configuration

Backend API URL dikonfigurasi di `src/utils/api.js`:
```javascript
const API_BASE_URL = "http://localhost:5001/api";
```

## 📱 Responsive Design

Aplikasi fully responsive untuk:
- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🎯 Usage Flow

### Student Flow
1. Buka landing page
2. Klik "Mulai Tryout"
3. Isi data diri (nama, kelas, sekolah, dll)
4. Pilih jenis test
5. Kerjakan soal dengan timer
6. Submit jawaban
7. Lihat hasil & pembahasan

### Admin Flow
1. Login di `/admin/login`
2. Dashboard - lihat statistics
3. Kelola Categories & SubCategories
4. Tambah/Edit/Hapus Soal
5. View & Export Hasil Test
6. Analisis performa siswa

## 🛠️ Development

### Code Structure
- **Context API** untuk state management (Auth)
- **Protected Routes** untuk admin pages
- **Axios Interceptors** untuk auto-add auth token
- **Helper Functions** untuk formatting
- **Reusable Components** (coming soon)

### Best Practices
- Functional components dengan hooks
- Async/await untuk API calls
- Toast notifications untuk user feedback
- Loading states untuk UX
- Error handling

## 🚢 Deployment

### Build
```bash
npm run build
```

Output akan ada di folder `dist/`

### Deploy ke Vercel/Netlify
1. Connect repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Set environment variable jika perlu
5. Deploy!

### Environment Variables
Jika backend di URL lain (production), buat `.env`:
```env
VITE_API_URL=https://your-backend-api.com/api
```

Dan update `api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
```

## 📄 Default Admin Login

**Username:** admin  
**Password:** admin123

⚠️ **Pastikan ganti password setelah deployment!**

## 🐛 Troubleshooting

### Cannot fetch data
- Pastikan backend berjalan di `http://localhost:5001`
- Check CORS settings di backend
- Check Network tab di browser DevTools

### Authentication issues
- Clear localStorage
- Re-login admin
- Check JWT token expiry

### Build errors
```bash
# Clear node_modules dan reinstall
rm -rf node_modules
npm install

# Clear cache
npm run build -- --force
```

## 📝 TODO / Future Improvements

- [ ] Pagination untuk list soal & hasil
- [ ] Search functionality
- [ ] Bulk upload soal via Excel/CSV
- [ ] Print hasil test
- [ ] Email notification hasil
- [ ] Chart/Graph untuk analytics
- [ ] Dark mode toggle
- [ ] Profile management
- [ ] Change password
- [ ] Forgot password

## 👨‍💻 Development Tips

### Hot Reload
Vite provides instant hot module replacement (HMR)

### Debugging
- Use React DevTools extension
- Check console for errors
- Use Network tab untuk API calls

### Adding New Pages
1. Create component di `src/pages/`
2. Add route di `App.jsx`
3. Add navigation link jika perlu

## 📄 License

ISC License

---

Built with ❤️ for SNBT Tryout System
