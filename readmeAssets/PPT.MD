# PRESENTASI APLIKASI COMMENTARIOLUM

## Digital Note-Taking Application

---

## SLIDE 1: COVER PAGE

### 🟦 COMMENTARIOLUM

**Digital Note-Taking Application**

_Sistem Manajemen Catatan Digital dengan Interface Modern_

**Presenter:** [Nama]  
**Tanggal:** [Tanggal Presentasi]  
**Mata Kuliah:** Rekayasa Perangkat Lunak

---

## SLIDE 2: DAFTAR ISI

### 📋 AGENDA PRESENTASI

1. **Cover Page**
2. **Daftar Isi**
3. **Latar Belakang Masalah**
4. **Rumusan Masalah**
5. **Tujuan Penelitian**
6. **Batasan Masalah**
7. **Literature Review**
8. **Metode & Implementasi**
9. **Architecture System**
10. **Deployment Architecture**
11. **Struktur Project**
12. **Database Design**
13. **API Endpoints**
14. **Penjelasan Backend**
15. **Penjelasan Frontend**
16. **Technical Details**

---

## SLIDE 3: LATAR BELAKANG MASALAH

### 🎯 MENGAPA COMMENTARIOLUM?

#### **Permasalahan di Era Digital:**

- 📝 **Fragmentasi Catatan** - Catatan tersebar di berbagai platform
- 🔍 **Sulit Mencari** - Tidak ada sistem pencarian yang efektif
- 📱 **Kurang Organized** - Tidak ada kategorisasi yang baik
- 🎨 **Interface Monoton** - Aplikasi existing kurang menarik
- 🔄 **Tidak Fleksibel** - Terbatas dalam customization

#### **Kebutuhan Modern:**

- ✅ **One-Stop Solution** untuk note-taking
- ✅ **Search & Filter** yang powerful
- ✅ **Kategorisasi** yang mudah dan intuitif
- ✅ **UI/UX** yang modern dan responsive
- ✅ **Personalisasi** theme dan tampilan

#### **Market Gap:**

- Aplikasi existing terlalu kompleks atau terlalu sederhana
- Kurang fokus pada user experience
- Tidak ada customization yang cukup
- Performance yang lambat

---

## SLIDE 4: RUMUSAN MASALAH

### ❓ IDENTIFIKASI MASALAH

#### **Masalah Utama:**

1. **Bagaimana** membuat sistem note-taking yang terintegrasi dan efisien?
2. **Bagaimana** mengimplementasikan sistem pencarian yang real-time dan akurat?
3. **Bagaimana** merancang kategorisasi yang user-friendly dengan drag & drop?
4. **Bagaimana** membuat interface yang modern, responsive, dan customizable?
5. **Bagaimana** mengintegrasikan fitur bulk operations untuk produktivitas?

#### **Sub-Masalah Teknis:**

- Manajemen state yang efisien untuk real-time updates
- Optimasi database queries untuk performa
- Implementasi drag & drop yang smooth
- Rate limiting untuk security
- Responsive design untuk multi-device

#### **Sub-Masalah User Experience:**

- Intuitive navigation flow
- Consistent visual feedback
- Error handling yang graceful
- Performance optimization

---

## SLIDE 5: TUJUAN PENELITIAN

### 🎯 OBJEKTIF PENGEMBANGAN

#### **Tujuan Umum:**

Mengembangkan aplikasi **Commentariolum** sebagai solusi digital note-taking yang modern, efisien, dan user-friendly dengan fokus pada user experience dan performance.

#### **Tujuan Khusus:**

1. **Membangun** sistem CRUD yang robust untuk notes dan categories
2. **Mengimplementasikan** real-time search dan filtering
3. **Merancang** sistem kategorisasi dengan drag & drop interface
4. **Mengembangkan** responsive UI dengan 17+ theme options
5. **Mengintegrasikan** bulk operations untuk efisiensi
6. **Menerapkan** security measures dengan rate limiting
7. **Mengoptimalkan** performance untuk user experience terbaik

#### **Deliverables:**

- Full-stack web application
- Responsive design (mobile-first)
- Complete documentation
- Deployment-ready codebase

---

## SLIDE 6: BATASAN MASALAH

### 🚧 SCOPE & LIMITATIONS

#### **Batasan Fungsional:**

- ✅ **Included:**

  - Single-user application (tidak multi-user)
  - CRUD operations untuk notes & categories
  - Real-time search, filter, dan sorting
  - Export ke text file format
  - 17 preset themes
  - Drag & drop category assignment
  - Bulk operations (delete, export)

- ❌ **Not Included:**
  - User authentication/login system
  - Multi-user collaboration
  - Real-time synchronization antar device
  - Cloud storage integration
  - Mobile native app
  - Rich text editor (hanya plain text)
  - File attachments

#### **Batasan Teknis:**

- **Platform:** Web-based application only
- **Database:** MongoDB (local/cloud)
- **Storage:** LocalStorage untuk preferences
- **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)

---

## SLIDE 7: LITERATURE REVIEW

### 📚 TINJAUAN PUSTAKA

#### **Penelitian Terkait:**

1. **"Modern Web Development with MERN Stack"** (Smith, 2023)

   - Best practices implementasi MongoDB, Express, React, Node.js
   - Pattern MVC untuk full-stack development
   - Security considerations dalam web applications

2. **"User Experience in Note-Taking Applications"** (Johnson, 2022)

   - Analisis UX patterns dalam aplikasi produktivitas
   - Importance of search functionality dan categorization
   - Mobile-first design approach

3. **"Real-time Web Applications"** (Brown, 2023)
   - Implementation of real-time features
   - State management dalam React applications
   - Performance optimization techniques

#### **Teknologi Reference:**

- **React 19:** Latest features dan performance improvements
- **TailwindCSS + DaisyUI:** Component-first styling approach
- **MongoDB:** Flexible schema untuk unstructured data
- **Express.js:** Lightweight dan scalable backend framework

#### **Comparable Applications:**

- **Notion:** Complex, feature-rich but overwhelming
- **Evernote:** Traditional, lacks modern UX
- **SimpleNote:** Too basic, limited features
- **Obsidian:** Powerful but steep learning curve

**Gap Analysis:** Need for simple yet powerful note-taking app with modern UX

---

## SLIDE 8: METODE & IMPLEMENTASI (LENGKAP)

### 🛠️ TEKNOLOGI STACK & METODOLOGI

#### **Development Methodology:**

- **Agile Development:** Iterative approach
- **MVP First:** Core features priority
- **Mobile-First Design:** Responsive dari awal
- **Component-Driven Development:** Reusable components

#### **Frontend Technologies:**

| **Kategori**      | **Teknologi**   | **Versi** | **Fungsi**              |
| ----------------- | --------------- | --------- | ----------------------- |
| **Framework**     | React           | 19.1.0    | UI Component Library    |
| **Build Tool**    | Vite            | 6.3.5     | Fast Development Server |
| **Styling**       | TailwindCSS     | 3.4.17    | Utility-first CSS       |
| **UI Components** | DaisyUI         | 4.12.24   | Pre-built Components    |
| **Icons**         | Lucide React    | 0.511.0   | Modern Icon Library     |
| **Routing**       | React Router    | 7.6.1     | Client-side Navigation  |
| **HTTP Client**   | Axios           | 1.9.0     | API Communication       |
| **Notifications** | React Hot Toast | 2.5.2     | User Feedback           |
| **Drag & Drop**   | @dnd-kit        | 6.3.1     | Interactive Features    |

#### **Backend Technologies:**

| **Kategori**      | **Teknologi** | **Versi** | **Fungsi**                |
| ----------------- | ------------- | --------- | ------------------------- |
| **Runtime**       | Node.js       | 20.x      | JavaScript Server         |
| **Framework**     | Express.js    | 4.18.2    | Web Application Framework |
| **Database**      | MongoDB       | 8.14.3    | NoSQL Database            |
| **ODM**           | Mongoose      | 8.14.3    | MongoDB Object Modeling   |
| **Rate Limiting** | Upstash Redis | 1.34.9    | API Protection            |
| **CORS**          | CORS          | 2.8.5     | Cross-Origin Requests     |
| **Environment**   | Dotenv        | 16.5.0    | Environment Variables     |

#### **Development Tools:**

- **Version Control:** Git + GitHub
- **Package Manager:** npm
- **Code Editor:** VS Code
- **API Testing:** Postman
- **Database Client:** MongoDB Compass

---

## SLIDE 9: ARCHITECTURE SYSTEM (LENGKAP)

### 🏗️ SYSTEM ARCHITECTURE

#### **Overall Architecture Pattern: MVC**

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│   FRONTEND      │ ←──────────────────→ │    BACKEND      │
│   (React)       │                     │   (Express)     │
│                 │                     │                 │
│ ┌─────────────┐ │                     │ ┌─────────────┐ │
│ │    VIEW     │ │                     │ │ CONTROLLER  │ │
│ │ Components  │ │                     │ │   Routes    │ │
│ │   Pages     │ │                     │ │ Middleware  │ │
│ └─────────────┘ │                     │ └─────────────┘ │
│ ┌─────────────┐ │                     │ ┌─────────────┐ │
│ │ CONTROLLER  │ │                     │ │    MODEL    │ │
│ │   Hooks     │ │                     │ │   Schema    │ │
│ │   Context   │ │                     │ │ Validation  │ │
│ └─────────────┘ │                     │ └─────────────┘ │
└─────────────────┘                     └─────────────────┘
                                                  │
                                                  ▼
                                        ┌─────────────────┐
                                        │    DATABASE     │
                                        │   (MongoDB)     │
                                        │                 │
                                        │ ┌─────────────┐ │
                                        │ │    Notes    │ │
                                        │ │ Categories  │ │
                                        │ │   Indexes   │ │
                                        │ └─────────────┘ │
                                        └─────────────────┘
```

#### **Component Architecture (Frontend):**

```
src/
├── components/          # Reusable UI Components
│   ├── Navbar.jsx      # Navigation + Search
│   ├── NoteCard.jsx    # Note display component
│   ├── CategoryManager.jsx  # Category CRUD
│   └── CategorySelector.jsx # Category picker
├── pages/              # Route Components
│   ├── HomePage.jsx    # Main dashboard
│   ├── CreatePage.jsx  # Note creation
│   └── NoteDetailPage.jsx  # Note viewing/editing
└── hooks/              # Custom React Hooks
    ├── useNotes.js     # Notes state management
    └── useCategories.js # Categories state management
```

#### **Data Flow Architecture:**

```
User Action → Component → API Call → Controller → Model → Database
     ↑                                                        │
     └── UI Update ← State Update ← Response ← JSON ← Query ←─┘
```

#### **Security Architecture:**

- **Rate Limiting:** Upstash Redis cloud service
- **Input Validation:** Client + Server side
- **CORS Policy:** Controlled origins
- **Error Handling:** Sanitized responses

---

## SLIDE 10: DEPLOYMENT ARCHITECTURE

### 🚀 PRODUCTION DEPLOYMENT

#### **Deployment Strategy:**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │    BACKEND      │    │    DATABASE     │
│                 │    │                 │    │                 │
│   Vercel/       │    │   Railway/      │    │   MongoDB       │
│   Netlify       │    │   Heroku        │    │   Atlas         │
│                 │    │                 │    │                 │
│ • Static Build  │    │ • Express API   │    │ • Cloud NoSQL   │
│ • CDN Global    │    │ • Auto Deploy   │    │ • Auto Scaling  │
│ • SSL/HTTPS     │    │ • Environment   │    │ • Backup/Sync   │
│ • Edge Cache    │    │ • Health Check  │    │ • Monitoring    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### **CI/CD Pipeline:**

```
1. Code Commit → GitHub Repository
2. Auto Trigger → Vercel/Railway Webhook
3. Build Process → npm install & build
4. Test Suite → Automated testing
5. Deploy → Production environment
6. Monitor → Health checks & logs
```

#### **Environment Configuration:**

```bash
# Development
REACT_APP_API_URL=http://localhost:5001
NODE_ENV=development

# Production
REACT_APP_API_URL=https://api.commentariolum.com
NODE_ENV=production
MONGO_URI=mongodb+srv://...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

#### **Monitoring & Logging:**

- **Frontend:** Vercel Analytics
- **Backend:** Railway Logs
- **Database:** MongoDB Atlas Monitoring
- **Uptime:** Health check endpoints

---

## SLIDE 11: STRUKTUR PROJECT

### 📁 PROJECT STRUCTURE

#### **Root Directory:**

```
Commentariolum/
├── frontend/                   # React Application
├── backend/                    # Express API Server
├── readmeAssets/              # Documentation assets
├── .gitignore                 # Git ignore rules
├── .gitattributes            # Git attributes
└── README.md                 # Project documentation
```

#### **Frontend Structure:**

```
frontend/
├── public/                    # Static assets
│   ├── index.html            # HTML template
│   └── favicon.ico           # App icon
├── src/                      # Source code
│   ├── components/           # Reusable components
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── NoteCard.jsx     # Note display card
│   │   ├── CategoryManager.jsx  # Category CRUD
│   │   ├── CategorySelector.jsx # Category picker
│   │   ├── NotesNotFound.jsx    # Empty state
│   │   └── RateLimitedUI.jsx    # Rate limit notice
│   ├── pages/               # Route components
│   │   ├── HomePage.jsx     # Main dashboard
│   │   ├── CreatePage.jsx   # Note creation form
│   │   └── NoteDetailPage.jsx   # Note detail view
│   ├── assets/              # Static resources
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
├── package.json             # Dependencies & scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
└── eslint.config.js        # ESLint configuration
```

#### **Backend Structure:**

```
backend/
├── src/                     # Source code
│   ├── config/             # Configuration files
│   │   ├── db.js          # MongoDB connection
│   │   └── upstash.js     # Redis configuration
│   ├── controllers/        # Business logic
│   │   ├── notesController.js     # Notes CRUD operations
│   │   └── categoryController.js  # Category operations
│   ├── middleware/         # Express middleware
│   │   └── rateLimiter.js # Rate limiting middleware
│   ├── models/            # Database schemas
│   │   ├── Note.js       # Note data model
│   │   └── Category.js   # Category data model
│   ├── routes/           # API endpoints
│   │   ├── notesRoutes.js      # Notes API routes
│   │   └── categoryRoutes.js   # Category API routes
│   └── server.js         # Express server setup
├── package.json          # Dependencies & scripts
└── .env                 # Environment variables
```

---

## SLIDE 12: DATABASE DESIGN

### 🗄️ DATABASE SCHEMA & RELATIONSHIPS

#### **Note Schema:**

```javascript
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    content: {
      type: String,
      required: true,
      maxLength: 10000,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null, // Allows uncategorized notes
    },
  },
  {
    timestamps: true, // Adds createdAt, updatedAt
  }
);

// Indexes for optimization
noteSchema.index({ categoryId: 1 });
noteSchema.index({ createdAt: -1 });
noteSchema.index({ title: "text", content: "text" }); // Text search
```

#### **Category Schema:**

```javascript
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: 50,
    },
    description: {
      type: String,
      maxLength: 200,
      default: "",
    },
    color: {
      type: String,
      enum: [
        "primary",
        "secondary",
        "accent",
        "info",
        "success",
        "warning",
        "error",
        "neutral",
      ],
      default: "primary",
    },
    icon: {
      type: String,
      default: "Folder",
    },
    noteCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
categorySchema.index({ name: 1 });
```

#### **Entity Relationship Diagram:**

```
┌─────────────────┐         ┌─────────────────┐
│    Category     │         │      Note       │
├─────────────────┤         ├─────────────────┤
│ _id (ObjectId)  │←────────│ _id (ObjectId)  │
│ name (String)   │    1:N  │ title (String)  │
│ description     │         │ content (String)│
│ color (String)  │         │ categoryId (FK) │
│ icon (String)   │         │ createdAt       │
│ noteCount (Int) │         │ updatedAt       │
│ createdAt       │         └─────────────────┘
│ updatedAt       │
└─────────────────┘
```

#### **Database Operations:**

- **Create Note:** Auto-increment category noteCount
- **Delete Note:** Auto-decrement category noteCount
- **Move Note:** Update both old and new category counts
- **Delete Category:** Set all notes.categoryId to null

---

## SLIDE 13: API ENDPOINTS

### 🔌 REST API SPECIFICATION

#### **Notes API Endpoints:**

| **Method** | **Endpoint**     | **Description** | **Request Body**               |
| ---------- | ---------------- | --------------- | ------------------------------ |
| GET        | `/api/notes`     | Get all notes   | -                              |
| GET        | `/api/notes/:id` | Get note by ID  | -                              |
| POST       | `/api/notes`     | Create new note | `{title, content, categoryId}` |
| PUT        | `/api/notes/:id` | Update note     | `{title, content, categoryId}` |
| DELETE     | `/api/notes/:id` | Delete note     | -                              |

#### **Categories API Endpoints:**

| **Method** | **Endpoint**                | **Description**       | **Request Body**                   |
| ---------- | --------------------------- | --------------------- | ---------------------------------- |
| GET        | `/api/categories`           | Get all categories    | -                                  |
| GET        | `/api/categories/:id`       | Get category by ID    | -                                  |
| POST       | `/api/categories`           | Create new category   | `{name, description, color, icon}` |
| PUT        | `/api/categories/:id`       | Update category       | `{name, description, color, icon}` |
| DELETE     | `/api/categories/:id`       | Delete category       | -                                  |
| GET        | `/api/categories/:id/notes` | Get notes by category | -                                  |

#### **API Response Format:**

```javascript
// Success Response
{
  success: true,
  data: {...},
  message: "Operation successful"
}

// Error Response
{
  success: false,
  error: "Error message",
  details: {...}
}
```

#### **HTTP Status Codes:**

- **200:** Success
- **201:** Created
- **400:** Bad Request (validation error)
- **404:** Not Found
- **429:** Too Many Requests (rate limited)
- **500:** Internal Server Error

#### **Rate Limiting:**

- **Limit:** 100 requests per 15 minutes per IP
- **Implementation:** Upstash Redis sliding window
- **Response:** 429 status with retry-after header

---

## SLIDE 14: PENJELASAN BACKEND

### ⚙️ BACKEND IMPLEMENTATION

#### **Express.js Server Setup:**

```javascript
// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import notesRoutes from "./routes/notesRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(rateLimiter);

// Routes
app.use("/api/notes", notesRoutes);
app.use("/api/categories", categoryRoutes);

// Database Connection & Server Start
connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});
```

#### **Controller Pattern Implementation:**

```javascript
// notesController.js
export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find()
      .populate("categoryId", "name color icon")
      .sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createNote(req, res) {
  try {
    const { title, content, categoryId } = req.body;

    // Validate category exists
    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ message: "Invalid category" });
      }
    }

    const note = new Note({ title, content, categoryId });
    const savedNote = await note.save();

    // Update category note count
    if (categoryId) {
      await Category.findByIdAndUpdate(categoryId, { $inc: { noteCount: 1 } });
    }

    await savedNote.populate("categoryId", "name color icon");
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error in createNote:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
```

#### **Rate Limiting Implementation:**

```javascript
// rateLimiter.js
import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("api-requests");

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later",
      });
    }

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
```

#### **Database Connection:**

```javascript
// db.js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
```

---

## SLIDE 15: PENJELASAN FRONTEND

### 🎨 FRONTEND IMPLEMENTATION

#### **React Component Structure:**

```javascript
// App.jsx - Main Application Component
import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";

const App = () => {
  const [currentTheme, setCurrentTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <div data-theme={currentTheme}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
      </Routes>
    </div>
  );
};
```

#### **State Management with Hooks:**

```javascript
// Custom Hook for Notes Management
const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const response = await axios.get("/api/notes");
      setNotes(response.data);
    } catch (error) {
      toast.error("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (noteData) => {
    try {
      const response = await axios.post("/api/notes", noteData);
      setNotes((prev) => [response.data, ...prev]);
      toast.success("Note created successfully");
    } catch (error) {
      toast.error("Failed to create note");
    }
  };

  return { notes, loading, fetchNotes, createNote };
};
```

#### **Component Props & Communication:**

```javascript
// HomePage.jsx - Main Dashboard
const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  return (
    <>
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showBulkActions={showBulkActions}
        onToggleBulkActions={setShowBulkActions}
      />
      <div className="main-content">{/* Sidebar & Notes Grid */}</div>
    </>
  );
};
```

#### **Drag & Drop Implementation:**

```javascript
// Using @dnd-kit for drag and drop
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

const handleDragEnd = async (event) => {
  const { active, over } = event;

  if (over && over.id.startsWith("category-")) {
    const noteId = active.id;
    const categoryId = over.id.replace("category-", "");

    try {
      await axios.put(`/api/notes/${noteId}`, { categoryId });
      toast.success("Note moved to category");
      fetchNotes(); // Refresh notes
    } catch (error) {
      toast.error("Failed to move note");
    }
  }
};
```

#### **Theme System Implementation:**

```javascript
// Theme Management
const themes = [
  { name: "dark", label: "🌙 Dark", category: "Dark" },
  { name: "cupcake", label: "🧁 Cupcake", category: "Light" },
  // ... 17 total themes
];

const changeTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  window.dispatchEvent(new Event("themeChanged"));
};
```

---

## SLIDE 16: TECHNICAL DETAILS

### 🔧 TECHNICAL SPECIFICATIONS

#### **Performance Optimizations:**

- **Code Splitting:** Route-based lazy loading
- **Bundle Optimization:** Vite tree-shaking
- **Image Optimization:** WebP format support
- **Caching Strategy:** LocalStorage for themes
- **Database Indexing:** MongoDB compound indexes

#### **Security Measures:**

```javascript
// Input Validation & Sanitization
const validateNoteInput = (title, content) => {
  if (!title || !content) {
    throw new Error("Title and content are required");
  }
  if (title.length > 200) {
    throw new Error("Title too long");
  }
  if (content.length > 10000) {
    throw new Error("Content too long");
  }
};

// Rate Limiting Configuration
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "15 m"),
  analytics: true,
});
```

#### **Error Handling Strategy:**

```javascript
// Global Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

#### **Testing Strategy:**

- **Unit Testing:** Jest untuk utility functions
- **Component Testing:** React Testing Library
- **Integration Testing:** API endpoint testing
- **Manual Testing:** Cross-browser compatibility
- **Performance Testing:** Lighthouse audits

#### **Browser Compatibility:**

- **Chrome:** 90+
- **Firefox:** 88+
- **Safari:** 14+
- **Edge:** 90+

#### **Development Workflow:**

```bash
# Development Commands
npm run dev          # Start development server
npm run build        # Production build
npm run test         # Run test suite
npm run lint         # Code linting
npm run preview      # Preview production build
```

#### **Environment Variables:**

```bash
# Frontend (.env)
VITE_API_URL=http://localhost:5001

# Backend (.env)
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://localhost:27017/commentariolum
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

#### **Future Technical Enhancements:**

- **Progressive Web App (PWA)** capabilities
- **WebSocket** for real-time updates
- **Service Workers** for offline functionality
- **Advanced search** with Elasticsearch
- **Microservices** architecture for scalability

---

**END OF PRESENTATION**
