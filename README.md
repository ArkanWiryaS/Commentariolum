# Commentariolum

Aplikasi web modern untuk mencatat dan mengelola catatan pribadi dengan antarmuka yang clean dan responsive.

## Screenshots

<img src="https://drive.google.com/file/d/1DsdrkHhui-w_Frdm2KUozX_CeGYVPoAa/view?usp=sharing" alt="Homepage Coffee Theme" width="800">

_Homepage dengan Coffee Theme - Tampilan daftar catatan_

<img src="https://drive.google.com/file/d/1JwYRABeO-uvlXyM3JQVuIlYKUNxe85Lb/view?usp=sharing" alt="Create Page Coffee Theme" width="800">

_Halaman pembuatan catatan baru dengan Coffee Theme_

## Overview

Commentariolum adalah aplikasi notes taking full-stack yang dibangun dengan teknologi modern. Aplikasi ini memungkinkan pengguna untuk membuat, membaca, mengedit, dan menghapus catatan dengan interface yang user-friendly dan mendukung multiple theme dari DaisyUI.

Nama "Commentariolum" berasal dari bahasa Latin yang berarti "buku catatan kecil" atau "memo book", yang mencerminkan tujuan aplikasi sebagai tempat untuk menyimpan catatan dan pemikiran pribadi.

## Tech Stack

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Minimal dan fleksibel web framework untuk Node.js
- **MongoDB** - NoSQL database untuk menyimpan data catatan
- **Mongoose** - Object Document Mapper (ODM) untuk MongoDB dan Node.js
- **Upstash Redis** - Serverless Redis untuk caching dan rate limiting
- **CORS** - Middleware untuk mengatur Cross-Origin Resource Sharing
- **dotenv** - Library untuk mengelola environment variables

### Frontend

- **React 19** - Library JavaScript untuk membangun user interface
- **Vite** - Build tool dan development server yang cepat
- **React Router** - Library untuk client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library yang dibangun di atas Tailwind CSS
- **Lucide React** - Library icon yang beautiful dan customizable
- **Axios** - HTTP client untuk melakukan request ke API
- **React Hot Toast** - Library untuk menampilkan notifikasi yang elegant

## Project Structure

```
Commentariolum/
├── backend/
│   ├── src/
│   │   ├── config/         # Konfigurasi database
│   │   ├── controllers/    # Business logic dan handler
│   │   ├── middleware/     # Rate limiting dan middleware lainnya
│   │   ├── models/         # Schema dan model database
│   │   ├── routes/         # Definisi API routes
│   │   └── server.js       # Entry point server
│   └── package.json        # Dependencies backend
├── frontend/
│   ├── src/
│   │   ├── assets/         # Static assets (images, icons)
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Root component
│   │   └── main.jsx        # Entry point aplikasi
│   ├── tailwind.config.js  # Konfigurasi Tailwind CSS
│   └── package.json        # Dependencies frontend
├── assetsreadme/           # Screenshot untuk dokumentasi
└── package.json            # Root package.json
```

## Features

- **CRUD Operations** - Create, read, update, delete catatan dengan validasi
- **Multiple Themes** - Lebih dari 25 tema DaisyUI yang dapat dipilih
- **Responsive Design** - Optimized untuk desktop, tablet, dan mobile
- **Rate Limiting** - Perlindungan dari spam dan abuse menggunakan Redis
- **Clean UI/UX** - Interface yang intuitif dengan design modern
- **Theme Persistence** - Theme yang dipilih disimpan di localStorage
- **Real-time Feedback** - Toast notifications untuk setiap aksi user
- **Search & Filter** - Kemampuan untuk mencari dan memfilter catatan
- **Auto-save** - Otomatis menyimpan draft saat mengetik

## Installation & Setup

### Prerequisites

- Node.js versi 16 atau lebih tinggi
- MongoDB database (local atau cloud seperti MongoDB Atlas)
- Upstash Redis account untuk rate limiting
- Git untuk version control

### 1. Clone Repository

```bash
git clone https://github.com/ArkanWiryaS/Commentariolum.git
cd Commentariolum
```

### 2. Environment Setup

Buat file `.env` di dalam folder `backend/` dengan konfigurasi berikut:

```env
# Database Configuration
MONGO_URI=your_mongodb_connection_string

# Server Configuration
PORT=5001
NODE_ENV=development

# Redis Configuration (Upstash)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### 3. Install Dependencies

```bash
# Install semua dependencies (root, backend, frontend)
npm run build

# Atau install manual satu per satu
npm install --prefix backend
npm install --prefix frontend
```

### 4. Development Mode

```bash
# Terminal 1: Run backend (development mode dengan nodemon)
cd backend
npm run dev

# Terminal 2: Run frontend (development mode dengan hot reload)
cd frontend
npm run dev
```

Frontend akan berjalan di `http://localhost:5173` dan backend di `http://localhost:5001`

### 5. Production Build

```bash
# Build aplikasi untuk production
npm run build

# Start production server
npm start
```

## API Documentation

### Base URL

```
Development: http://localhost:5001/api
Production: https://your-domain.com/api
```

### Endpoints

| Method | Endpoint         | Description                  | Body                           |
| ------ | ---------------- | ---------------------------- | ------------------------------ |
| GET    | `/api/notes`     | Mendapatkan semua catatan    | -                              |
| POST   | `/api/notes`     | Membuat catatan baru         | `{title, content, tanggal?}`   |
| GET    | `/api/notes/:id` | Mendapatkan catatan spesifik | -                              |
| PUT    | `/api/notes/:id` | Update catatan               | `{title?, content?, tanggal?}` |
| DELETE | `/api/notes/:id` | Hapus catatan                | -                              |

### Response Format

```json
{
  "success": true,
  "data": {
    "_id": "note_id",
    "title": "Judul Catatan",
    "content": "Isi catatan...",
    "tanggal": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Usage Guide

### 1. Homepage

- Menampilkan semua catatan dalam bentuk card
- Search dan filter catatan berdasarkan judul atau content
- Theme switcher di navbar untuk mengganti tema
- Button "Create New Note" untuk membuat catatan baru

### 2. Create Page

- Form untuk membuat catatan baru dengan title dan content
- Real-time preview saat mengetik
- Auto-save draft untuk mencegah kehilangan data
- Validasi input sebelum submit

### 3. Note Detail Page

- Tampilan detail catatan dengan opsi edit dan delete
- Mode edit in-place untuk mengedit catatan
- Konfirmasi sebelum menghapus catatan
- Navigation breadcrumb untuk kembali ke homepage

### 4. Theme Management

- Pilihan 25+ tema dari DaisyUI collection
- Theme preference disimpan di localStorage
- Smooth transition saat mengganti tema
- Responsive theme selector

## Available Themes

Aplikasi mendukung berbagai tema dari DaisyUI collection:

**Light Themes:** Light, Cupcake, Bumblebee, Emerald, Corporate, Garden, Lofi, Pastel, Fantasy, Wireframe, Acid, Lemonade, Winter

**Dark Themes:** Dark, Synthwave, Halloween, Forest, Dracula, Black, Night, Coffee, Dim, Nord, Sunset

**Specialty Themes:** Retro, Valentine, Autumn, Business, CMYK

## Development Guide

### Backend Architecture

- **MVC Pattern** - Model-View-Controller separation
- **Middleware Stack** - CORS, JSON parsing, rate limiting
- **Error Handling** - Centralized error handling dengan proper HTTP codes
- **Database** - MongoDB dengan Mongoose ODM
- **Caching** - Redis untuk rate limiting dan future caching needs

### Frontend Architecture

- **Component-Based** - Reusable React components
- **State Management** - React hooks untuk local state
- **Routing** - React Router untuk SPA navigation
- **Styling** - Tailwind CSS dengan DaisyUI components
- **Build Tool** - Vite untuk fast development dan optimized builds

### Code Structure

```
Backend:
- models/Note.js - Mongoose schema untuk catatan
- controllers/notesController.js - Business logic CRUD operations
- routes/notesRoutes.js - Express route definitions
- middleware/rateLimiter.js - Upstash Redis rate limiting

Frontend:
- pages/ - HomePage, CreatePage, NoteDetailPage
- components/ - Navbar, NoteCard, NotesNotFound, RateLimitedUI
- App.jsx - Root component dengan routing dan theme management
```

## Contributing

Kontribusi sangat diterima! Ikuti langkah berikut:

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request dengan deskripsi yang detail

### Development Guidelines

- Gunakan ESLint rules yang sudah dikonfigurasi
- Write meaningful commit messages
- Test fitur sebelum submit PR
- Update dokumentasi jika diperlukan

## Troubleshooting

### Common Issues

**Error: MongoDB connection failed**

- Pastikan MongoDB service berjalan
- Check connection string di `.env` file
- Verify network access jika menggunakan MongoDB Atlas

**Error: Redis rate limit**

- Check Upstash Redis credentials
- Verify rate limit configuration
- Reset Redis keys jika diperlukan

**Frontend tidak dapat connect ke backend**

- Pastikan backend berjalan di port 5001
- Check CORS configuration
- Verify API endpoints

## License

This project is licensed under the ISC License. See LICENSE file for details.

## Author

**ArkanWiryaS**

- GitHub: [@ArkanWiryaS](https://github.com/ArkanWiryaS)
- Repository: [Commentariolum](https://github.com/ArkanWiryaS/Commentariolum)

---

Built with modern web technologies for efficient note-taking experience.
