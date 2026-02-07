export interface User {
  id?: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  password: string; // hashed password
  role?: string;
  level?: number;
  uid?: string;
  created_at?: Date;
  updated_at?: Date;
}
export interface UserRequest {
  name: string;
  password: string;
}
export interface ApiResponse {
  url: string
  serverId: string
  error: {
    id: number
    msg: string
  }
}
// export interface ApiDataResponse {
//   response: ApiResponse
// }