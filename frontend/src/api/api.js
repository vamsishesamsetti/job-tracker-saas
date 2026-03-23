import axios from "axios";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: "http://localhost:4000/api/v1",
});

/* REQUEST */
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

/* RESPONSE */
API.interceptors.response.use(
  (res) => res,
  (err) => {

    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("Something went wrong");
    }

    return Promise.reject(err);
  }
);

export default API;