const { ethers, BigNumber } = require("ethers")

const callHistory = async (address) => {
    let provider = new ethers.providers.EtherscanProvider("goerli");
    let history = await provider.getHistory(address);
    console.log(history)
}
callHistory("0xdd160613122C9b3ceb2a2709123e3020CaDa2546")