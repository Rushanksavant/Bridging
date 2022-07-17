const { ethers, BigNumber } = require("ethers")
const { getPOSClient, from, ropstenProvider, pos } = require("./init/posClient.js")
const { depositETH, approveERC20, depositERC20 } = require("./helper.js")

// Main function
const execute = async () => {

    const client = await getPOSClient();
    const tokens = pos.parent.test
    const minBalanceETH = 3000000 * 5000000000 // minimum eth balance of wallet

    while (true) {
        // Bridging ETH
        let ethBalanceNow = await ropstenProvider.getBalance(from)
        ethBalanceNow = BigNumber.from(ethBalanceNow).toString()
        if (ethBalanceNow > minBalanceETH) {
            console.log("possible")
            const amount = ethBalanceNow - minBalanceETH;
            await depositETH(client, amount, from); // bridge
        }


        // Bridging ERC20
        let ethBalanceNow2 = await ropstenProvider.getBalance(from)
        ethBalanceNow2 = BigNumber.from(ethBalanceNow2).toString()
        if (ethBalanceNow2 > minBalanceETH) {
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
        } else {
            console.log("Wallet balance <", minBalanceETH / 1e18, "ETH, hence cannot check for ERC20s")
        }

    }
};


// Main function call
execute().then(() => {
}).catch(err => {
    console.error("err", err);
}).finally(_ => {
    process.exit(0);
})