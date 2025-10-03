import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (username, password) => api.post("/auth/login", { username, password }),
  getProfile: () => api.get("/auth/profile"),
};

export const categoryAPI = {
  getAll: () => api.get("/categories"),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const subCategoryAPI = {
  getAll: (categoryId) => api.get("/subcategories", { params: { categoryId } }),
  getById: (id) => api.get(`/subcategories/${id}`),
  create: (data) => api.post("/subcategories", data),
  update: (id, data) => api.put(`/subcategories/${id}`, data),
  delete: (id) => api.delete(`/subcategories/${id}`),
};

export const questionAPI = {
  getAll: (subCategoryId) => api.get("/questions", { params: { subCategoryId } }),
  getById: (id) => api.get(`/questions/${id}`),
  getForTest: (subCategoryId) => axios.get(`${API_BASE_URL}/questions/test/${subCategoryId}`),
  create: (data) => api.post("/questions", data),
  bulkCreate: (questions) => api.post("/questions/bulk", { questions }),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
};

export const studentAPI = {
  create: (data) => axios.post(`${API_BASE_URL}/students`, data),
  getAll: () => api.get("/students"),
  getById: (id) => api.get(`/students/${id}`),
  getStats: () => api.get("/students/stats/overview"),
  update: (id, data) => api.put(`/students/${id}`, data),
  delete: (id) => api.delete(`/students/${id}`),
};

export const testSessionAPI = {
  start: (studentId, subCategoryId) =>
    axios.post(`${API_BASE_URL}/test-sessions/start`, { studentId, subCategoryId }),
  getSession: (id) => axios.get(`${API_BASE_URL}/test-sessions/${id}`),
  saveAnswer: (id, data) => axios.put(`${API_BASE_URL}/test-sessions/${id}/answer`, data),
  submit: (id) => axios.post(`${API_BASE_URL}/test-sessions/${id}/submit`),
  getResults: (id) => axios.get(`${API_BASE_URL}/test-sessions/${id}/results`),
  getAll: (params) => api.get("/test-sessions", { params }),
  getStats: () => api.get("/test-sessions/stats/overview"),
};

export default api;

