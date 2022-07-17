const { ethers, BigNumber } = require("ethers")
const { getPOSClient, from, ropstenProvider } = require("./init/posClient.js")

const execute = async (fixedBalance) => {

    while (true) {

        let ethBalanceNow = await ropstenProvider.getBalance(from)
        ethBalanceNow = BigNumber.from(ethBalanceNow).toString()
        if (ethBalanceNow > fixedBalance) {

            const client = await getPOSClient();
            const amount = ethBalanceNow - fixedBalance;
            const result = await client.depositEther(amount, from);

            const txHash = await result.getTransactionHash();
            console.log("txHash = ", txHash);
            const receipt = await result.getReceipt();
            console.log("receipt = ", receipt);
        } else {
            console.log("No new ETH recieved")
        }
    }
};

execute(2999478150966601102).then(() => {
}).catch(err => {
    console.error("err", err);
}).finally(_ => {
    process.exit(0);
})