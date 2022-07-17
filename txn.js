const { ethers, BigNumber } = require("ethers")
const { getPOSClient, from, ropstenProvider } = require("./init/posClient.js")

// let fixedBalance = await ropstenProvider.getBalance(from)
// fixedBalance = BigNumber.from(fixedBalance).toString()

const execute = async (fixedBalance) => {

    while (true) {

        let balanceNow = await ropstenProvider.getBalance(from)
        balanceNow = BigNumber.from(balanceNow).toString()
        if (balanceNow > fixedBalance) {

            const client = await getPOSClient();
            const amount = balanceNow - fixedBalance;
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