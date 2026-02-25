// auth.handler.ts
import { axiosInstance } from "@/config/api.js";
import type { Server } from "socket.io";

export default function authHandler(io: Server) {
  const register = (data: any) => {};
  const login = (data: any) => {};
  const logout = () => {};

  return { register, login, logout };
}


export const registerUser = async ({name}:{name:string}) => {
        let data = JSON.stringify({
  "Username": name,
  "Agent": "AgentMM",
  "UserGroup": "a",
  "CompanyKey": "CB33E42BFAD04F90BA3B25F7EB257810",
  "ServerId": "test01"
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: '/web-root/restricted/player/register-player.aspx',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};
await axiosInstance.request(config).then((response)=>{
  console.log(response.data)
}).catch((err)=>{throw Error(err)})
}