import axios from "axios";
export const getGameList = async (req, res, next) => {
    try {
        let data = JSON.stringify({
            CompanyKey: "CB33E42BFAD04F90BA3B25F7EB257810",
            ServerId: "test01",
            GpId: 1,
            IsGetAll: true,
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
            console.log(JSON.stringify(response.data));
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
};
//# sourceMappingURL=game.controller.js.map