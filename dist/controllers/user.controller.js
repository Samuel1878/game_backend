export const Register = (req, res, next) => {
    console.log(req.body);
    let data = JSON.stringify({
        "Username": "TestPlayer002",
        "UserGroup": "a",
        "Agent": "AgentUSD01",
        "CompanyKey": process.env.COMPANY_KEY,
        "ServerId": process.env.SERVER_ID
    });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.BASIC_URL + 'web-root/restricted/player/register-player.aspx',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    // axios(config)
    // .then((response) => {
    //   console.log(JSON.stringify(response.data));
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
    next();
    return;
};
//# sourceMappingURL=user.controller.js.map