import axios from "axios";

const api = axios.create({
  baseURL: "https://202.74.74.144/api",
});

export default api;
