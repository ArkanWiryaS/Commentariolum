# SNBT Tryout API Documentation

Base URL: `http://localhost:5001/api`

## Authentication

### 1. Login Admin
**POST** `/auth/login`

Request:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response:
```json
{
  "_id": "...",
  "username": "admin",
  "name": "Administrator",
  "email": "admin@tryout.com",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2. Get Admin Profile
**GET** `/auth/profile`
Headers: `Authorization: Bearer {token}`

---

## Categories

### 1. Get All Categories
**GET** `/categories`

### 2. Get Category by ID
**GET** `/categories/:id`

### 3. Create Category (Admin)
**POST** `/categories`
Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "name": "Tes Potensi Skolastik (TPS)",
  "description": "Tes kemampuan kognitif",
  "order": 1
}
```

### 4. Update Category (Admin)
**PUT** `/categories/:id`
Headers: `Authorization: Bearer {token}`

### 5. Delete Category (Admin)
**DELETE** `/categories/:id`
Headers: `Authorization: Bearer {token}`

---

## Sub Categories

### 1. Get All Sub Categories
**GET** `/subcategories?categoryId={categoryId}`

### 2. Get Sub Category by ID
**GET** `/subcategories/:id`

### 3. Create Sub Category (Admin)
**POST** `/subcategories`
Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "name": "Penalaran Umum - Induktif",
  "categoryId": "category_id",
  "questionCount": 10,
  "timeLimit": 20,
  "order": 1
}
```

### 4. Update Sub Category (Admin)
**PUT** `/subcategories/:id`

### 5. Delete Sub Category (Admin)
**DELETE** `/subcategories/:id`

---

## Questions

### 1. Get Questions for Test (Public)
**GET** `/questions/test/:subCategoryId`

Response (without correct answer):
```json
[
  {
    "_id": "...",
    "text": "Soal pertanyaan...",
    "optionA": "Jawaban A",
    "optionB": "Jawaban B",
    "optionC": "Jawaban C",
    "optionD": "Jawaban D",
    "optionE": "Jawaban E",
    "subCategoryId": "...",
    "order": 1
  }
]
```

### 2. Get All Questions (Admin)
**GET** `/questions?subCategoryId={subCategoryId}`
Headers: `Authorization: Bearer {token}`

### 3. Create Question (Admin)
**POST** `/questions`
Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "text": "Jika A = B dan B = C, maka...",
  "optionA": "A = C",
  "optionB": "A ≠ C",
  "optionC": "A > C",
  "optionD": "A < C",
  "optionE": "Tidak dapat ditentukan",
  "correctAnswer": "A",
  "explanation": "Berdasarkan sifat transitif...",
  "subCategoryId": "subcategory_id",
  "order": 1
}
```

### 4. Bulk Create Questions (Admin)
**POST** `/questions/bulk`
Headers: `Authorization: Bearer {token}`

Request:
```json
{
  "questions": [
    {
      "text": "Soal 1...",
      "optionA": "...",
      "optionB": "...",
      "optionC": "...",
      "optionD": "...",
      "optionE": "...",
      "correctAnswer": "A",
      "explanation": "...",
      "subCategoryId": "...",
      "order": 1
    }
  ]
}
```

### 5. Update Question (Admin)
**PUT** `/questions/:id`

### 6. Delete Question (Admin)
**DELETE** `/questions/:id`

---

## Students

### 1. Register Student (Public)
**POST** `/students`

Request:
```json
{
  "name": "John Doe",
  "class": "12 IPA 1",
  "school": "SMA Negeri 1 Jakarta",
  "targetUniversity": "Universitas Indonesia",
  "phone": "081234567890",
  "email": "john@example.com"
}
```

Response:
```json
{
  "_id": "student_id",
  "name": "John Doe",
  "class": "12 IPA 1",
  "school": "SMA Negeri 1 Jakarta",
  "targetUniversity": "Universitas Indonesia",
  "phone": "081234567890",
  "email": "john@example.com",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### 2. Get All Students (Admin)
**GET** `/students`
Headers: `Authorization: Bearer {token}`

### 3. Get Student Statistics (Admin)
**GET** `/students/stats/overview`
Headers: `Authorization: Bearer {token}`

---

## Test Sessions

### 1. Start Test Session (Public)
**POST** `/test-sessions/start`

Request:
```json
{
  "studentId": "student_id",
  "subCategoryId": "subcategory_id"
}
```

Response:
```json
{
  "testSession": {
    "_id": "session_id",
    "studentId": "...",
    "subCategoryId": "...",
    "startTime": "2025-01-01T10:00:00.000Z",
    "status": "in_progress"
  },
  "questions": [...],
  "timeLimit": 20
}
```

### 2. Get Test Session (Public)
**GET** `/test-sessions/:id`

### 3. Save Answer (Public)
**PUT** `/test-sessions/:id/answer`

Request:
```json
{
  "questionId": "question_id",
  "selectedAnswer": "A",
  "markedForReview": false
}
```

### 4. Submit Test (Public)
**POST** `/test-sessions/:id/submit`

Response:
```json
{
  "testSession": {...},
  "results": {
    "totalQuestions": 10,
    "correctAnswers": 8,
    "wrongAnswers": 1,
    "unanswered": 1,
    "score": "80.00",
    "totalTime": 1200
  },
  "answers": [...]
}
```

### 5. Get Test Results (Public)
**GET** `/test-sessions/:id/results`

### 6. Get All Test Sessions (Admin)
**GET** `/test-sessions?status=completed&studentId=...`
Headers: `Authorization: Bearer {token}`

### 7. Get Test Statistics (Admin)
**GET** `/test-sessions/stats/overview`
Headers: `Authorization: Bearer {token}`

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `429` - Too Many Requests (Rate Limited)
- `500` - Internal Server Error

