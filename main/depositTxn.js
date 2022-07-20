const { ethers, BigNumber } = require("ethers")
const { getPOSClient, from, ropstenProvider, pos } = require("../init/posClient.js")
const { depositETH, approveERC20, depositERC20, calculateBlockNum, knowPayBacks, erc20KnowPayBacks, contractAddresses, sendETH } = require("./helper.js")

/**
 * @title Main function
 * @dev If ETH balance > minBalanceETH, repay ETH to senders (except 0xspecific)
 * @dev If ETH balance > minBalanceETH, bridge ERC20s to Polygon
 * @dev If ETH balance > minBalanceETH, bridge ETH to Polygon
 * @param specificAddress Address allowed to send funds to 0xmain(our wallet)
 */
const execute = async (specificAddress, recursiveInterval) => {

    const client = await getPOSClient();
    const tokens = pos.parent.test
    const minBalanceETH = 3000000 * 500000000 // minimum eth balance of wallet
    let ethBalanceNow1 = await ropstenProvider.getBalance(from)
    ethBalanceNow1 = BigNumber.from(ethBalanceNow1).toString()
    const [block, currentBlock] = await calculateBlockNum(recursiveInterval)


    // Repaying payBacks (ETH sent from other addresses except 0xspecific)
    const estimatedGas = await (await ropstenProvider.getGasPrice()).toString() * 30000

    let latestPayBack = await knowPayBacks(from, specificAddress, block, currentBlock) // 0xmain, 0xspecific, block no. 5 min ago, current block no.
    if (latestPayBack.length > 0) {
        let i = 0;
        while (i < latestPayBack.length) {
            const transaction = await sendETH(latestPayBack[i]["sender"], latestPayBack[i]["amount"] - estimatedGas) // deducting gas from original amount
            ethBalanceNow1 = ethBalanceNow1 - latestPayBack[i]["amount"] // update current ETH wallet balance
            console.log(transaction)
            i++
        }
    } else {
        console.log("No payBacks in last 5 mins")
    }
    console.log("--------------------------------------------------------------------------------")


    // Repaying payBacks (ERC20 sent from other addresses except 0xspecific)
    let latestERC20PayBack = await erc20KnowPayBacks(contractAddresses, specificAddress, block) // ERC20 addresses, 0xspecific, block no. 5 min ago
    console.log(latestERC20PayBack)

    // Bridging ERC20

    // let ethBalanceNow2 = await ropstenProvider.getBalance(from)
    // ethBalanceNow2 = BigNumber.from(ethBalanceNow2).toString()

    // if (ethBalanceNow2 > minBalanceETH) {
    let i = 0;
    while (i < tokens.length) {
        const erc20Token = client.erc20(tokens[i], true);
        let balance = await erc20Token.getBalance(from);
        balance = BigNumber.from(balance).toString()
        if (balance > 0) {
            await approveERC20(erc20Token, balance) // lock asset 
            await depositERC20(erc20Token, balance, from) // bridge
        }
        i++;
    }
    // } else {
    //     console.log("Wallet balance <", minBalanceETH / 1e18, "ETH, hence cannot check for ERC20s")
    // }
    console.log("--------------------------------------------------------------------------------")


    // Bridging ETH

    if (ethBalanceNow1 > minBalanceETH) {
        console.log("possible")
        const amount = ethBalanceNow1 - minBalanceETH;
        console.log(amount)
        await depositETH(client, amount, from); // bridge
    } else {
        console.log("Wallet balance <", minBalanceETH / 1e18, "ETH, hence cannot check for ETH")
    }

};


module.exports = { main: execute }
// Main function call
execute("0xdd160613122C9b3ceb2a2709123e3020CaDa2546", 300).then(() => {
}).catch(err => {
    console.error("err", err);
}).finally(_ => {
    process.exit(0);
})