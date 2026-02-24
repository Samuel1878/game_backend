import type { Socket } from "socket.io";
import { axiosInstance } from "../config/api.js";

export const getUserBallance = async (name: string) => {
  try {
    let data = JSON.stringify({
      Username: name,
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
    if (response.status === 200) return response?.data;
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const depositHandler = (socket:Socket, data:any) => {
    socket.emit("new-deposit")
    console.log(data)
    return
}