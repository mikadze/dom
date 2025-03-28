import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const signup = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};

export const getSessions = async () => {
  const response = await api.get("/session");
  return response.data;
};

export const getSeatMap = async (id: string) => {
  const response = await api.get(`/bookings/sessions/${id}/seats`);
  return response.data;
};

export const reserveSeats = async (
  sessionId: number,
  seats: { rowNumber: number; seatNumber: number }[]
) => {
  const response = await api.post(`/bookings/sessions/${sessionId}/reserve`, {
    sessionId,
    seats,
  });
  return response.data;
};

export const confirmBooking = async (reservationToken: string) => {
  const response = await api.post(`/bookings/confirm`, {
    reservationToken,
  });
  
  return response.data;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
