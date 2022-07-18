const { ethers, BigNumber } = require("ethers")

async function callHistory(address) {
    const provider = new ethers.providers.EtherscanProvider("goerli");
    const currentBlock = await provider.getBlockNumber()
    const blockTime = 15; // ETH block time is 15 seconds

    //Block number 2 hours, 24 hours and 48 hours ago
    const block2min = currentBlock - (48 * 60 * 60 / blockTime); // 2min = 120sec

    // Get all txs for address since 2 mins
    let history = await provider.getHistory(address, block2min, currentBlock);
    return history
}

async function call() {
    const history = await callHistory("0xdd160613122C9b3ceb2a2709123e3020CaDa2546")
    let i = 0;
    while (i < history.length) {
        if (history[i].to == "0xdd160613122C9b3ceb2a2709123e3020CaDa2546") {
            console.log(history[i].timestamp)
        }
        i++;
    }
}
call()