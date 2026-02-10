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
export interface depositFormData {    
  id?:number;
  inv_id:string;
  user_id:number | null;
  payment:string | null;
  request_amount:number | null;
  actual_amount?:number;
  uuid:string|null;
  completed:boolean;
  status:string;
  remark?:string;
  account_no:string | null;
  account_name:string | null;
  created_at?:string;
  updated_at?:string;
  tid:string;
  payment_account?:string | null;
  payment_number?:string | null;
  ref_no?:string|null;
}