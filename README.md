# Commentariolum

Aplikasi web modern untuk mencatat dan mengelola catatan pribadi dengan antarmuka yang clean dan responsive.

## 🎯 Overview

Commentariolum adalah aplikasi notes taking full-stack yang dibangun dengan teknologi modern. Aplikasi ini memungkinkan pengguna untuk membuat, membaca, mengedit, dan menghapus catatan dengan interface yang user-friendly dan mendukung multiple theme.

## 🚀 Tech Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB & Mongoose** - Database dan ODM
- **Upstash Redis** - Caching dan rate limiting
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables management

### Frontend

- **React 19** - UI library
- **Vite** - Build tool dan dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library untuk Tailwind
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Hot Toast** - Notification system

## 📁 Project Structure

```
Commentariolum/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Rate limiting, etc.
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── server.js       # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/         # Static assets
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── tailwind.config.js  # Tailwind configuration
│   └── package.json
└── package.json            # Root package.json
```

## ✨ Features

- ✍️ **CRUD Operations** - Create, read, update, delete catatan
- 🎨 **Multiple Themes** - tema DaisyUI yang dapat dipilih
- 📱 **Responsive Design** - Optimized untuk desktop dan mobile
- ⚡ **Rate Limiting** - Perlindungan dari spam dengan Upstash Redis
- 🔍 **Clean UI/UX** - Interface yang intuitif dan modern
- 🌙 **Dark/Light Mode** - Theme switching dengan localStorage persistence
- 📝 **Rich Text Support** - Support untuk konten catatan yang detail

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 atau lebih tinggi)
- MongoDB database
- Upstash Redis account (untuk rate limiting)

### 1. Clone Repository

```bash
git clone https://github.com/ArkanWiryaS/Commentariolum.git
cd Commentariolum
```

### 2. Environment Setup

Buat file `.env` di folder `backend/` dengan konfigurasi berikut:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5001
NODE_ENV=development
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### 3. Install Dependencies

```bash
# Install semua dependencies (root, backend, frontend)
npm run build

# Atau install manual
npm install --prefix backend
npm install --prefix frontend
```

### 4. Development Mode

```bash
# Run backend (development)
cd backend
npm run dev

# Run frontend (development) - terminal baru
cd frontend
npm run dev
```

### 5. Production Build

```bash
# Build untuk production
npm run build

# Start production server
npm start
```

## 🌐 API Endpoints

| Method | Endpoint         | Description                  |
| ------ | ---------------- | ---------------------------- |
| GET    | `/api/notes`     | Mendapatkan semua catatan    |
| POST   | `/api/notes`     | Membuat catatan baru         |
| GET    | `/api/notes/:id` | Mendapatkan catatan spesifik |
| PUT    | `/api/notes/:id` | Update catatan               |
| DELETE | `/api/notes/:id` | Hapus catatan                |

## 📖 Usage

1. **Homepage** - Lihat semua catatan yang tersimpan
2. **Create Page** - Buat catatan baru dengan title dan content
3. **Note Detail** - Lihat detail catatan, edit, atau hapus
4. **Theme Switching** - Ganti tema melalui navbar
5. **Responsive** - Akses dari device apapun

## 🎨 Available Themes

Aplikasi mendukung berbagai tema dari DaisyUI:

- Dark, Light, Cupcake, Bumblebee
- Emerald, Corporate, Synthwave, Retro
- Valentine, Halloween, Garden, Forest
- Dan masih banyak lagi...

## 🔧 Development

### Backend Structure

- `models/Note.js` - Schema untuk catatan (title, content, tanggal)
- `controllers/notesController.js` - Business logic untuk CRUD operations
- `routes/notesRoutes.js` - API route definitions
- `middleware/rateLimiter.js` - Rate limiting menggunakan Upstash Redis

### Frontend Structure

- `pages/` - HomePage, CreatePage, NoteDetailPage
- `components/` - Navbar, NoteCard, NotesNotFound, RateLimitedUI
- Tailwind + DaisyUI untuk styling
- React Router untuk navigation

## 📝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**ArkanWiryaS**

- GitHub: [@ArkanWiryaS](https://github.com/ArkanWiryaS)
- Repository: [Commentariolum](https://github.com/ArkanWiryaS/Commentariolum)

---

Built with ❤️ using modern web technologies
