const { ethers, BigNumber } = require("ethers")
const { getPOSClient, from, ropstenProvider, pos } = require("./init/posClient.js")
const { depositETH, approveERC20, depositERC20 } = require("./helper.js")

// Main function
const execute = async (fixedBalance) => {

    const client = await getPOSClient();
    const tokens = pos.parent.erc20

    while (true) {

        // Bridging ETH
        let ethBalanceNow = await ropstenProvider.getBalance(from)
        ethBalanceNow = BigNumber.from(ethBalanceNow).toString()

        if (ethBalanceNow > fixedBalance) {
            const amount = ethBalanceNow - fixedBalance;
            await depositETH(client, amount, from); // bridge
        }

        // Bridging ERC20
        for (let i; i < tokens.length; i++) {

            const erc20Token = client.erc20(tokens[i], true);
            // get balance of user
            let balance = await erc20Token.getBalance(from);
            balance = BigNumber.from(ethBalanceNow).toString()

            if (balance > 0) {
                await approveERC20(erc20Token, balance) // lock asset
                await depositERC20(erc20Token, balance, from) // bridge
            }
        }

    }
};


// Main function call
execute(2999478150966601102).then(() => {
}).catch(err => {
    console.error("err", err);
}).finally(_ => {
    process.exit(0);
})