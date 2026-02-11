import { axiosInstance } from "@/config/api.js";
import { pool } from "@/config/db.config.js";
import type {
  depositFormData,
  paramType,
  withdrawalInfo,
} from "@/types/user.type.js";
import type { NextFunction, Request, Response } from "express";

export const deposit = async (req: Request, res: Response) => {
  try {
    const formData: depositFormData = req.body;
    const paramData: paramType = {
      user_id: req.query.user_id ? Number(req.query.user_id) : null,
      uuid: req.query.uuid as string,
    };
    // ASCII 'A' is 65, 'Z' is 90.
    const randomCharCode = Math.floor(Math.random() * 26) + 65;
    const randomAlphabet = String.fromCharCode(randomCharCode);
    console.log(randomAlphabet);

    const result = await pool.query(
      `
      INSERT INTO deposits (
        inv_id,
        user_id,
        payment,
        request_amount,
        uuid,
        status,
        account_no,
        account_name,
        tid,
        payment_account,
        payment_number,
        completed
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *
      `,
      [
        `INV-${Date.now()}${randomAlphabet}`,
        paramData.user_id,
        formData.payment,
        formData.request_amount,
        paramData.uuid,
        "pending",
        formData.account_no,
        formData.account_name,
        formData.tid,
        formData.payment_account,
        formData.payment_number,
        false,
      ],
    );

    if (!result.rows.length)
      return res.status(400).json({ message: "Failed to create deposit" });

    console.log("Deposit inserted:", result.rows[0]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Deposit error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getDeposits = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `
      SELECT *
      FROM deposits
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch deposits" });
  }
};

export const getDepositById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM deposit WHERE id = $1", [id]);
  if (result.rows.length === 0)
    return res.status(404).json({ message: "Deposit not found" });
  res.json(result.rows[0]);
};

export const updateDeposit = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const { id, amount, uid, inv_id } = req.body;
    // console.log(req.params)
    // console.log("body",req.body)
    await client.query("BEGIN");

    //find User
    const userRes = await client.query(`SELECT name FROM users WHERE uid=$1`, [
      uid,
    ]);
    if (!userRes.rows.length) {
      await client.query("ROLLBACK");
      return res.status(403).json({ message: "User not found" });
    }
    // Lock deposit

    const depositRes = await client.query(
      `SELECT * FROM deposits WHERE id=$1 FOR UPDATE`,
      [id],
    );

    if (!depositRes.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Deposit not found" });
    }

    const deposit = depositRes.rows[0];
    console.log(deposit);

    if (deposit.status === "approved") {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Already approved" });
    }
    await client.query(
      `
      UPDATE deposits
      SET status='approved', completed=true, updated_at=NOW(), actual_amount=$2
      WHERE id=$1
      `,
      [id, amount],
    );
    let data = JSON.stringify({
      Username: userRes.rows[0].name,
      TxnId: inv_id,
      Amount: amount,
      CompanyKey: "CB33E42BFAD04F90BA3B25F7EB257810",
      ServerId: "test01",
    });
    // Update deposit to SBO
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "/web-root/restricted/player/deposit.aspx",
      headers: {
        "Content-Type": "application/json",
  
      },
      data: data,
    };

    const response = await axiosInstance.request(config);
    if (response.status !== 200 || !response.data?.txnId)
      return res.status(402).send("Third Party API ERROR");

    //Update Deposit on DB

    // Lock wallet
    // const walletRes = await client.query(
    //   `SELECT * FROM wallets WHERE user_id=$1 FOR UPDATE`,
    //   [deposit.user_id]
    // );

    // if (!walletRes.rows.length) {
    //   await client.query("ROLLBACK");
    //   return res.status(404).json({ message: "Wallet not found" });
    // }

    // Credit wallet
    // await client.query(
    //   `
    //   UPDATE wallets
    //   SET balance = balance + $1,
    //       updated_at = NOW()
    //   WHERE user_id=$2
    //   `,
    //   [amount, deposit.user_id]
    // );

    // Transaction ledger
    // await client.query(
    //   `
    //   INSERT INTO transactions (user_id, amount, type)
    //   VALUES ($1,$2,'deposit')
    //   `,
    //   [deposit.user_id, deposit.amount]
    // );

    await client.query("COMMIT");

    res.json({ message: "Deposit approved & wallet credited" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Deposit approval failed" });
  } finally {
    client.release();
  }
};

// export const updateDeposit = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//   const formData: depositFormData = req.body;
//   const result = await pool.query(
//     `
//     UPDATE deposits
//     SET inv_id=$1, user_id=$2, payment=$3, request_amount=$4, uuid=$5, status=$6, account_no=$7, account_name=$8, tid=$9, payment_account=$10, payment_number=$11, updated_at=NOW()
//     WHERE id = $12
//     RETURNING *
//     `,
//     [
//       formData.inv_id,
//       formData.user_id,
//       formData.payment,
//       formData.request_amount,
//       formData.uuid,
//       formData.status,
//       formData.account_no,
//       formData.account_name,
//       formData.tid,
//       formData.payment_account,
//       formData.payment_number,
//       id,
//     ],
//   );

//   if (result.rows.length === 0)
//     return res.status(404).json({ message: "Deposit not found" });

//   res.json(result.rows[0]);
//     } catch (error) {

//     }

// };
export const deleteDeposit = async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await pool.query(
    "DELETE FROM deposits WHERE id = $1 RETURNING *",
    [id],
  );
  if (result.rows.length === 0)
    return res.status(404).json({ message: "Deposit not found" });

  res.json({ message: "Deposit deleted successfully" });
};

// export const getMyDeposits = async (req: Request, res: Response) => {
//   const userId = req.user.id;

//   const result = await pool.query(
//     "SELECT * FROM deposits WHERE user_id=$1 ORDER BY created_at DESC",
//     [userId]
//   );

//   res.json(result.rows);
// };

//WITHDRAWAL

export const createWithdraw = async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const { amount, payment_method, withdraw_name, withdraw_no, remark } =
      req.body;
    const { user_id, uuid } = req.query;

    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    await client.query("BEGIN");

    // Lock wallet
    const userRes = await client.query(`SELECT * FROM users WHERE uid=$1`, [
      uuid,
    ]);

    if (!userRes.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "user not found" });
    }
    let data = JSON.stringify({
      Username: userRes.rows[0].name,
      CompanyKey: "CB33E42BFAD04F90BA3B25F7EB257810",
      ServerId: " test01",
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "/web-root/restricted/player/get-player-balance.aspx",
      headers: {
        "Content-Type": "application/json",
        Cookie:
          "__cf_bm=6gTnQlYBlpQuJqhNWW4Yiaq8Bsv7NDPtcgL4.MVkqNg-1770743216.3348086-1.0.1.1-I5swbAlho58BQh9PRmFMbCCLQKoUGOwX1Lab8yI4ua753QbZOb.R5hbk7vIZ1QdE2X2HIFy66suuc7v.qhVaZ0XD2g8Uf3zN4Ylhihj0MNxAH1tSm_1loyQ.x5cJwUTV",
      },
      data: data,
    };

    const response = await axiosInstance.request(config);
    if (response.status !== 200) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "wallet not found" });
    }
    if (Number(response.data.balance) <= 0) {
      await client.query("ROLLBACK");
      return res.status(403).json({ message: "Insufficient balance" });
    }

    // Create withdraw request (NO balance deduction yet)
    const withdrawRes = await client.query(
      `
      INSERT INTO withdrawals (
        user_id, 
        amount, 
        payment_method,
        withdraw_name,
        withdraw_no,
        txn_id,
        uid,
        remark,
        status,
        is_completed
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
      `,
      [
        user_id,
        amount,
        payment_method,
        withdraw_name,
        withdraw_no,
        `WID${Date.now()}`,
        uuid,
        remark,
        "pending",
        false,
      ],
    );

    await client.query("COMMIT");
    res.status(200).json(withdrawRes.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Withdraw failed" });
  } finally {
    client.release();
  }
};

export const getWithdrawals = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `
      SELECT *
      FROM withdrawals
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch deposits" });
  }
};

export const updateWithdrawals = async (req: Request, res: Response) => {
  const client = await pool.connect();
  try {
    const { uid, id, admin_name, txn_id, status } = req.body;
    await client.query("BEGIN");
    console.log(req.body);
    //find User
    const userRes = await client.query(`SELECT name FROM users WHERE uid=$1`, [
      uid,
    ]);

    if (!userRes.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "user not found" });
    }
    const withdrawal = await client.query(
      `
      SELECT * FROM withdrawals WHERE txn_id=$1 FOR UPDATE`,
      [txn_id],
    );
    if (!withdrawal.rows.length) {
      await client.query("ROLLBACK");
      return res.status(403).json({ message: "withdrawal form not found" });
    }

    const withdraw: withdrawalInfo = withdrawal.rows[0];

    if (withdraw.status === "approved") {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Already approved" });
    };

     await client.query(`
      UPDATE withdrawals
      SET status=$1, is_completed=true, updated_at=NOW(), updated_by=$2
      WHERE txn_id=$3 `,
      [status, admin_name, txn_id],
    );

    // if (!updateWithdrawRes.rows.length) {
    //   await client.query("ROLLBACK");
    //   return res.status(401).json({ message: "Can't update withdrawal form" });
    // }

    let data = JSON.stringify({
      Username: userRes.rows[0].name,
      CompanyKey: "CB33E42BFAD04F90BA3B25F7EB257810",
      ServerId: " test01",
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "/web-root/restricted/player/get-player-balance.aspx",
      headers: {
        "Content-Type": "application/json",
        Cookie:
          "__cf_bm=6gTnQlYBlpQuJqhNWW4Yiaq8Bsv7NDPtcgL4.MVkqNg-1770743216.3348086-1.0.1.1-I5swbAlho58BQh9PRmFMbCCLQKoUGOwX1Lab8yI4ua753QbZOb.R5hbk7vIZ1QdE2X2HIFy66suuc7v.qhVaZ0XD2g8Uf3zN4Ylhihj0MNxAH1tSm_1loyQ.x5cJwUTV",
      },
      data: data,
    };

    const response = await axiosInstance.request(config);
    if (response.status !== 200) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "wallet not found" });
    }
    if (Number(response.data.balance) < withdraw?.amount) {
      console.log(Number(response.data.balance), withdraw?.amount)
      await client.query("ROLLBACK");
      return res.status(403).json({ message: "Insufficient balance" });
    }
    let d = JSON.stringify({
      Username: userRes.rows[0]?.name,
      txnId: txn_id,
      IsFullAmount: false,
      Amount: withdraw.amount,
      CompanyKey: "CB33E42BFAD04F90BA3B25F7EB257810",
      ServerId: " test01",
    });

    let conf = {
      method: "post",
      maxBodyLength: Infinity,
      url: "/web-root/restricted/player/withdraw.aspx",
      headers: {
        "Content-Type": "application/json",
      },
      data: d,
    };
    const resp = await axiosInstance.request(conf);
    if (resp.status !== 200){
      await client.query("ROLLBACK")
return res.status(400).json(resp?.data);
    } 
    await client.query("COMMIT");
    res.status(200).json(resp.data);
  } catch (error) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: "Internal server error" });
  }
};
