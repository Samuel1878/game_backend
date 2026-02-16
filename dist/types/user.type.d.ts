export interface User {
    id?: number;
    name: string;
    phone?: string | null;
    email?: string | null;
    password: string;
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
    url: string;
    serverId: string;
    error: {
        id: number;
        msg: string;
    };
}
export interface depositFormData {
    id?: number;
    inv_id?: string;
    user_id: number | null;
    payment: string | null;
    request_amount: number | null;
    actual_amount?: number;
    uuid?: string | null;
    completed?: boolean;
    status?: string;
    remark?: string;
    account_no: string | null;
    account_name: string | null;
    created_at?: string;
    updated_at?: string;
    tid: string;
    payment_account?: string | null;
    payment_number?: string | null;
    ref_no?: string | null;
}
export interface paramType {
    user_id: number | null;
    uuid: string | null;
}
export interface withdrawalInfo {
    id?: number;
    user_id?: number;
    uid?: string;
    amount: number;
    payment_method?: string;
    status?: string;
    withdraw_name?: string;
    withdraw_no?: string;
    remark?: string;
    created_at?: string;
    updated_at?: string;
    txn_id?: string;
    is_completed?: boolean;
}
//# sourceMappingURL=user.type.d.ts.map