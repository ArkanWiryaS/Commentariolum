# SNBT Tryout Backend API

Backend API untuk aplikasi Tryout SNBT - sistem tryout online untuk marketing bimbel ke sekolah-sekolah.

## 🚀 Tech Stack

- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Upstash Redis** - Rate limiting

## 📦 Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan konfigurasi Anda
```

## 🔧 Environment Variables

Buat file `.env` dengan konfigurasi berikut:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Server
PORT=5001
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

## 🎯 Quick Start

### 1. Start Development Server

```bash
npm run dev
```

Server akan berjalan di `http://localhost:5001`

### 2. Create Admin Account

```bash
npm run create-admin
```

Default credentials:
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Ganti password setelah login pertama kali!**

## 📚 Database Models

### Admin
- Username, password (hashed)
- Name, email
- Role

### Category
- Name (TPS, Literasi, dll)
- Description
- Order

### SubCategory
- Name (Penalaran Induktif, dll)
- CategoryId (reference)
- Question count
- Time limit (menit)
- Order

### Question
- Text (soal)
- Options (A, B, C, D, E)
- Correct answer
- Explanation
- SubCategoryId (reference)
- Order

### Student
- Name
- Class
- School
- Target university
- Phone
- Email

### TestSession
- StudentId (reference)
- SubCategoryId (reference)
- Start/end time
- Status (in_progress, completed, expired)
- Total time
- Correct/wrong/unanswered counts
- Score

### Answer
- TestSessionId (reference)
- QuestionId (reference)
- Selected answer
- Is correct
- Marked for review
- Time spent

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin (dev only)
- `POST /api/auth/login` - Login admin
- `GET /api/auth/profile` - Get admin profile (protected)

### Categories (Public read, Admin write)
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)
- `DELETE /api/categories/:id` - Delete category (admin)

### SubCategories
- `GET /api/subcategories` - Get all subcategories
- `GET /api/subcategories/:id` - Get subcategory by ID
- `POST /api/subcategories` - Create (admin)
- `PUT /api/subcategories/:id` - Update (admin)
- `DELETE /api/subcategories/:id` - Delete (admin)

### Questions
- `GET /api/questions/test/:subCategoryId` - Get questions for test (public, no answers)
- `GET /api/questions` - Get all questions (admin)
- `POST /api/questions` - Create question (admin)
- `POST /api/questions/bulk` - Bulk create (admin)
- `PUT /api/questions/:id` - Update (admin)
- `DELETE /api/questions/:id` - Delete (admin)

### Students
- `POST /api/students` - Register student (public)
- `GET /api/students` - Get all students (admin)
- `GET /api/students/stats/overview` - Get statistics (admin)
- `GET /api/students/:id` - Get student by ID (admin)
- `PUT /api/students/:id` - Update student (admin)
- `DELETE /api/students/:id` - Delete student (admin)

### Test Sessions
- `POST /api/test-sessions/start` - Start test (public)
- `GET /api/test-sessions/:id` - Get session (public)
- `PUT /api/test-sessions/:id/answer` - Save answer (public)
- `POST /api/test-sessions/:id/submit` - Submit test (public)
- `GET /api/test-sessions/:id/results` - Get results (public)
- `GET /api/test-sessions` - Get all sessions (admin)
- `GET /api/test-sessions/stats/overview` - Get stats (admin)

## 🎮 Usage Flow

### Student Flow (Public)
1. Register dengan data diri
2. Mulai test session untuk subcategory tertentu
3. Menjawab soal-soal
4. Submit test
5. Lihat hasil

### Admin Flow (Protected)
1. Login dengan kredensial
2. CRUD Categories & SubCategories
3. CRUD Questions
4. View semua test sessions
5. View statistics & analytics
6. View student data

## 📊 Features

- ✅ JWT Authentication untuk admin
- ✅ Rate limiting dengan Redis
- ✅ CRUD lengkap untuk Categories, SubCategories, Questions
- ✅ Student registration tanpa password
- ✅ Test session management
- ✅ Automatic scoring
- ✅ Answer tracking (marked for review)
- ✅ Time tracking
- ✅ Statistics & analytics
- ✅ Bulk question import

## 🔒 Security

- Password hashing dengan bcrypt
- JWT token authentication
- Rate limiting untuk prevent abuse
- CORS configuration
- Input validation

## 📈 Scaling Considerations

- MongoDB indexes pada field yang sering di-query
- Rate limiting dengan Redis
- Stateless JWT authentication
- Pagination ready (bisa ditambahkan)

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check .env MONGO_URI
# Pastikan MongoDB service running
# Verify network access (jika MongoDB Atlas)
```

### Redis Rate Limit Error
```bash
# Check Upstash credentials di .env
# Verify rate limit configuration di middleware
```

### JWT Token Invalid
```bash
# Check JWT_SECRET di .env
# Pastikan token dikirim di header: Authorization: Bearer {token}
```

## 📝 Development Scripts

```bash
# Start development server dengan hot reload
npm run dev

# Start production server
npm start

# Create admin account
npm run create-admin
```

## 🚢 Deployment

### MongoDB Atlas
1. Create cluster di MongoDB Atlas
2. Whitelist IP address
3. Copy connection string ke MONGO_URI

### Upstash Redis
1. Create database di Upstash
2. Copy REST URL dan TOKEN

### Server Deployment (Railway/Render/Heroku)
1. Push code ke Git
2. Connect repository
3. Set environment variables
4. Deploy!

## 📄 License

ISC License

## 👨‍💻 Author

Built for SNBT Tryout Marketing System

