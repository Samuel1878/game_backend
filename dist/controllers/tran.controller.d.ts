import type { Request, Response } from "express";
export declare const deposit: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getDeposits: (req: Request, res: Response) => Promise<void>;
export declare const getDepositById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateDeposit: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteDeposit: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createWithdraw: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getWithdrawals: (req: Request, res: Response) => Promise<void>;
export declare const updateWithdrawals: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=tran.controller.d.ts.map