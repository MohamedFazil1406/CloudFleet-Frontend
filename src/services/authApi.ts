import api from "./api";

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../types/auth";

/*
 * Login
 */
export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", request);

  return response.data;
};

/*
 * Register
 */
export const register = async (
  request: RegisterRequest,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/register", request);

  return response.data;
};
