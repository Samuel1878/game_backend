import axios from "axios";
import type { NextFunction, Request, Response} from "express"
export const getGameList = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const gameIDs = req.query.gameIDs as number[] | undefined;
    let data = JSON.stringify({
      CompanyKey: "CB33E42BFAD04F90BA3B25F7EB257810",
      ServerId: "test01",
      GpId: 3,
      IsGetAll: false,
    });

    let config = {
      method: "post",
      maxBodyLength: 100,
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
