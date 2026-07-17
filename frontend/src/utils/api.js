import axios from "axios";

const publicWorkspaceKey = "nexora-public-workspace";
const getPublicWorkspaceId = () => {
  let id = localStorage.getItem(publicWorkspaceKey);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(publicWorkspaceKey, id); }
  return id;
};

const api = axios.create({
  baseURL:import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  config.headers["x-public-client-id"] = getPublicWorkspaceId();
  return config;
});

export default api;
