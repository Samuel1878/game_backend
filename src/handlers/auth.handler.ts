// auth.handler.ts
import { axiosInstance } from "@/config/api.js";
import { pool } from "@/config/db.config.js";
import type { Server } from "socket.io";

export default function authHandler(io: Server) {
  const register = (data: any) => {};
  const login = (data: any) => {};
  const logout = () => {};

  return { register, login, logout };
}

export const registerUserToSBO = async ({
  name,
  password,
}: {
  name: string;
  password?: string;
}) => {
  const client = await pool.connect();
  try {
    const exists = await client.query("SELECT id FROM users WHERE name=$1", [
      name,
    ]);
    exists &&
      (await axiosInstance
        .post("/web-root/restricted/player/register-player.aspx", {
          Username: name,
          UserGroup: "a",
          Agent: "AgentMM",
          CompanyKey:
            process.env.COMPANY_KEY || "44348206360E4C218C9C5CA41E7EA02A",
          ServerId: process.env.SERVER_ID || "test02",
        })
        .then((response) => {
          if (response.data?.error && response.data?.error?.id > 0) {
            throw new Error(
              "External API registration failed: " + response.data.message,
            );
          }
          console.log("External registration successful for user:", name);
        })
        .catch((error) => {
          throw error;
        }));
  } catch (apiError) {}
};
// export const registerUser = async ({name}:{name:string}) => {
//         let data = JSON.stringify({
//   "Username": name,
//   "Agent": "AgentMM",
//   "UserGroup": "a",
//   "CompanyKey": "CB33E42BFAD04F90BA3B25F7EB257810",
//   "ServerId": "test01"
// });

// let config = {
//   method: 'post',
//   maxBodyLength: Infinity,
//   url: '/web-root/restricted/player/register-player.aspx',
//   headers: { 
//     'Content-Type': 'application/json'
//   },
//   data : data
// };
// await axiosInstance.request(config).then((response)=>{
//   console.log(response.data)
// }).catch((err)=>{throw Error(err)})
// }
