import { API_BASE_URL, BACKEND_SERVER, MOCK_API_ON } from "@/config";
import axios from "axios";

const api = axios.create({
  baseURL:
    MOCK_API_ON === true
      ? API_BASE_URL
      : `${BACKEND_SERVER}${API_BASE_URL}`,
  // headers: {
  //     "Content-Type": "application/json",
  // },
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const { href } = window.location;
      const routeName = href ? href.substring(href.lastIndexOf("/") + 1) : "";
      if (
        ![
          "login",
          "register",
          "forgot-password",
          "resend-verification",
        ].includes(routeName)
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);

export default api;
