import { Server, Socket } from "socket.io";
import { depositHandler, getUserBallance } from "@/handlers/user.handlers.js";
import type { SessionRequest } from "./auth.js";

export const initSocket = (io: Server) => {
  // 🔐 Middleware runs before connection
  io.use((socket: Socket, next) => {
    const req = socket.request as SessionRequest;

    // Session available in socket.request
    if (req.session?.userName) {
      socket.data.userName = req.session.userName;
      next();
    } else {
      next(new Error("Unauthorized"));
    }
  });
  io.on("connection", async (socket: Socket) => {
      const req = socket.request as any;
  
      if (!req.session.userName) {
        return socket.disconnect();
      }
  
      console.log("Socket connected:", socket.id);
 
    socket.on("join", (uid) => {
        socket.join(`user-${uid}`);
        console.log("JOINED", uid)
    });
       const response = await getUserBallance(req.session.userName);
    socket.emit("balance-update", response);
    socket.on("admin", (uid)=>{
      socket.join(`admin-${uid}`);
      console.log("ADMIN MONITORING", uid);
    })
    socket.on("agent:created", (data)=>{
      console.log(data)
    })
    socket.on("deposit", (data:any) => depositHandler(socket, data));
      socket.on("disconnect", () => {
        console.log("Disconnected:", socket.data.userName);
      });
  
  
    });
};
