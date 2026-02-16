import { axiosInstance } from "@/config/api.js";
import axios from "axios";
import type { NextFunction, Request, Response} from "express"
export const getGameList = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const gameIDs = req.query.gameIDs as number[] | undefined;
    let data = JSON.stringify({
      CompanyKey: "CB33E42BFAD04F90BA3B25F7EB257810",
      ServerId: "test01",
      GpId: 10000,
      gameId:0,
      IsGetAll: false,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://ex-api-demo-yy.568win.com//web-root/restricted/information/get-game-list.aspx",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        console.log(error);
        next(error);
      });
  } catch (error) {
    console.error("Error fetching game list:", error);
    next(error);
  }
};
export const getGameByGpId = async (req:Request, res:Response, next:NextFunction)=>{
  try {
      const { gpid } = req.query
      let data = JSON.stringify({
        CompanyKey: "CB33E42BFAD04F90BA3B25F7EB257810",
        ServerId: "test01",
        GpId: gpid,
        IsGetAll: false
    });

    let config = {
      method: "post",
      maxBodyLength:Infinity ,
      url: "https://ex-api-demo-yy.568win.com//web-root/restricted/information/get-game-list.aspx",
      headers: {
        "Content-Type": "application/json",
      },
      data: data
    };
    await axiosInstance
    .request(config)
      .then((response) => {
        res.status(200).json(response.data);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({message:"Thirdparty server error"})
        next(error);
      });
  } catch (error) {
    console.error("Error fetching hot game list", error);
    res.status(500).json({message:"Internal server error"});
    next(error)
  }
}
