import axios from "axios";

const publicWorkspaceKey = "nexora-public-workspace";
const getPublicWorkspaceId = () => {
  let id = localStorage.getItem(publicWorkspaceKey);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(publicWorkspaceKey, id); }
  return id;
};

const api = axios.create({
  baseURL:"http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  config.headers["X-Public-Client-Id"] = getPublicWorkspaceId();
  return config;
});

export default api;
