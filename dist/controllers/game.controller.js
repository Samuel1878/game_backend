var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { axiosInstance } from "../config/api.js";
import axios from "axios";
export const getGameList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameIDs = req.query.gameIDs;
        let data = JSON.stringify({
            CompanyKey: "CB33E42BFAD04F90BA3B25F7EB257810",
            ServerId: "test01",
            GpId: 10000,
            gameId: 0,
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
    }
    catch (error) {
        console.error("Error fetching game list:", error);
        next(error);
    }
});
export const getGameByGpId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gpid } = req.query;
        let data = JSON.stringify({
            CompanyKey: "CB33E42BFAD04F90BA3B25F7EB257810",
            ServerId: "test01",
            GpId: gpid,
            IsGetAll: false
        });
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://ex-api-demo-yy.568win.com//web-root/restricted/information/get-game-list.aspx",
            headers: {
                "Content-Type": "application/json",
            },
            data: data
        };
        yield axiosInstance
            .request(config)
            .then((response) => {
            res.status(200).json(response.data);
        })
            .catch((error) => {
            console.log(error);
            res.status(400).json({ message: "Thirdparty server error" });
            next(error);
        });
    }
    catch (error) {
        console.error("Error fetching hot game list", error);
        res.status(500).json({ message: "Internal server error" });
        next(error);
    }
});
//# sourceMappingURL=game.controller.js.map