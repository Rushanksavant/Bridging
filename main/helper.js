const { ethers, Wallet } = require("ethers")
const { ropstenProvider } = require("../init/posClient.js")
const { user1 } = require("../init/config.js")


// ETH -> Polygon for ether

const depositETH = async (client, amount, userAddress) => {
    const result = await client.depositEther(amount, userAddress);
    const txHash = await result.getTransactionHash();
    console.log("Deposit ETH txHash = ", txHash);
    const txReceipt = await result.getReceipt();

    console.log("ETH deposited")
}
const burnETH = async (client, tokenAddressETH, amount) => {
    const tokenETH = client.erc20(tokenAddressETH);
    const result = await erc20Token.withdrawStart(amount);
    const txHash = await result.getTransactionHash();
    console.log("Burn ETH txHash = ", txHash);
    const txReceipt = await result.getReceipt();

    return txHash
}
const withdrawETH = async (client, tokenAddressETH, txnHash) => {
    const erc20RootToken = client.erc20(tokenAddressETH, true);
    const result = await erc20Token.withdrawExit(txnHash);
    const txHash = await result.getTransactionHash();
    console.log("Withdraw ETH txHash = ", txHash);
    const txReceipt = await result.getReceipt();
}

// --------------------------------------------------------------------------------------------------------------------------------------------- //

// ETH -> Polygon for erc20

const approveERC20 = async (erc20RootToken, amount) => {
    const gasPrice = ropstenProvider.getGasPrice();
    const approveResult = await erc20RootToken.approve(amount);
    const txHash = await approveResult.getTransactionHash();
    console.log("Approve ERC20 txHash = ", txHash);
    const txReceipt = await approveResult.getReceipt();

    console.log("ERC20 approved")
}
const depositERC20 = async (erc20RootToken, amount, userAddress) => {
    const gasPrice = ropstenProvider.getGasPrice();
    const result = await erc20RootToken.deposit(amount, userAddress);
    const txHash = await result.getTransactionHash();
    console.log("Deposit ERC20 txHash = ", txHash);
    const txReceipt = await result.getReceipt();

    console.log("ERC20 deposited")
}
const burnERC20 = async (client, tokenAddress, amount) => {
    const erc20Token = client.erc20(tokenAddress);
    const result = await erc20Token.withdrawStart(amount);
    const txHash = await result.getTransactionHash();
    console.log("Burn ERC20 txHash = ", txHash);
    const txReceipt = await result.getReceipt();

    return txHash
}
const withdrawERC20 = async (client, tokenAddress, txHash) => {
    const erc20RootToken = client.erc20(tokenAddress, true);
    const result = await erc20Token.withdrawExit(txHash);
    const txHashExit = await result.getTransactionHash();
    console.log("Exit ERC20 txHash = ", txHashExit);
    const txReceipt = await result.getReceipt();
}

// --------------------------------------------------------------------------------------------------------------------------------------------- //

// Know payBacks

async function txnHistory(address) { // last 5 mins
    const provider = new ethers.providers.EtherscanProvider("goerli");
    const currentBlock = await provider.getBlockNumber()
    const blockTime = 15; // ETH block time is 15 seconds

    //Block number 5 mins ago
    const block5min = currentBlock - (300 / blockTime); // 5min = 300sec

    // Get all txs for address since 5 mins
    let history = await provider.getHistory(address, block5min, currentBlock);
    return history
}

async function knowPayBacks(myAddress, specificAddress) {
    const history = await txnHistory(myAddress)
    let i = 0;
    let payBack = [];
    while (i < history.length) {
        if (history[i].to == myAddress &&
            history[i].from != specificAddress &&
            history[i].value.toString() >= 200000000000000) {

            payBack.push({
                "sender": history[i].from,
                "amount": history[i].value.toString()
            })

        }
        i++;
    }
    return payBack;
}

// async function caller() {
//     const pays = await knowPayBacks("0x9b52aa46AfaED4E9E5F576d19D369C65F9f3ea58", "0xdd160613122C9b3ceb2a2709123e3020CaDa2546")
//     console.log(pays)
// }
// caller()

// --------------------------------------------------------------------------------------------------------------------------------------------- //

// Send ETH

const sendETH = async (recipient, amount) => {
    const gasPrice = ropstenProvider.getGasPrice();
    const wallet = new Wallet(user1.privateKey, ropstenProvider)
    const signer = wallet.connect(ropstenProvider)

    const tx = {
        from: wallet.address,
        to: recipient,
        value: amount,
        gasPrice: gasPrice,
        gasLimit: ethers.utils.hexlify(100000), // 100 gwei
        nonce: ropstenProvider.getTransactionCount(wallet.address, "latest")
    }

    const transaction = await signer.sendTransaction(tx);
    return transaction
}

module.exports = {
    depositETH: depositETH,
    burnETH: burnETH,
    withdrawETH: withdrawETH,
    approveERC20: approveERC20,
    depositERC20: depositERC20,
    burnERC20: burnERC20,
    withdrawERC20: withdrawERC20,
    knowPayBacks: knowPayBacks,
    sendETH: sendETH
}