// auth.handler.ts
import type { Server } from "socket.io";

export default function authHandler(io: Server) {
  const register = (data: any) => {};
  const login = (data: any) => {};
  const logout = () => {};

  return { register, login, logout };
}