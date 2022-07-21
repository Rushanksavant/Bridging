const { ethers, Contract, Wallet } = require("ethers");
const { ropstenProvider } = require("../init/posClient.js")

async function call() {
    const estimatedGas = await (await ropstenProvider.getGasPrice()).toString() * 60000
    console.log(estimatedGas)
}
call()
// 0.00007833
// 0.0001013
// 72000000600000