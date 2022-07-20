const { ethers, Contract, Wallet } = require("ethers");
const { ropstenProvider } = require("../init/posClient.js")

async function call() {
    const estimatedGas = await (await ropstenProvider.getGasPrice()).toString() * 60000
    console.log(estimatedGas)
}
call()