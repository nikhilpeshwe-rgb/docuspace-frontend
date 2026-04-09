import apiClient from "./axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
};

export const registerApi = async (data: RegisterRequest): Promise<string> => {
  const response = await apiClient.post("/auth/register", data);
  return response.data;
};