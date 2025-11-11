import axios from "axios";
import { API_URL } from "../api/config";

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("user");
};
