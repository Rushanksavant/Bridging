const { ethers, BigNumber } = require("ethers")
const { getPOSClient, from, ropstenProvider, pos } = require("./init/posClient.js")


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
            const result = await client.depositEther(amount, from);

            const txHash = await result.getTransactionHash();
            console.log("txHash = ", txHash);
            const receipt = await result.getReceipt();
            console.log("receipt = ", receipt);
        }

        // Bridging ERC20
        for (let i; i < tokens.length; i++) {

            const erc20Token = posClient.erc20(tokens[i], true);
            // get balance of user
            let balance = await erc20Token.getBalance(from);
            balance = BigNumber.from(ethBalanceNow).toString()

            if (balance > 0) {

                const result = await erc20Token.deposit(balance, from);

                const txHash = await result.getTransactionHash();

                const txReceipt = await result.getReceipt();
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