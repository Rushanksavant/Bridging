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

async function calculateBlockNum(timeInterval) {
    const provider = new ethers.providers.EtherscanProvider("goerli");
    const currentBlock = await provider.getBlockNumber()
    const blockTime = 15; // ETH block time is 15 seconds

    //Block number 5 mins ago
    const block = currentBlock - (timeInterval / blockTime);

    return block
}
// Know payBacks

async function txnHistory(address, block5min) { // last 5 mins
    // const block5min = calculateBlockNum(300) // 5min = 300sec

    // Get all txs for address since 5 mins
    let history = await provider.getHistory(address, block5min, currentBlock);
    return history
}

async function knowPayBacks(myAddress, specificAddress, block5min) {
    const history = await txnHistory(myAddress, block5min)
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

// Know ERC20 payBacks

const erc20ABI = [
    'event Approval(address indexed src, address indexed guy, uint256 wad)',
    'event LogNote(bytes4 indexed sig, address indexed usr, bytes32 indexed arg1, bytes32 indexed arg2, bytes data) anonymous',
    'event Transfer(address indexed src, address indexed dst, uint256 wad)',
]

const dERC20_Add = "0x655F2166b0709cd575202630952D71E2bB0d61Af";
const dERC20 = new ethers.Contract(dERC20_Add, erc20ABI, ropstenProvider); // Contract pointer

const wETH_Add = "0x60D4dB9b534EF9260a88b0BED6c486fe13E604Fc";
const wETH = new ethers.Contract(wETH_Add, erc20ABI, ropstenProvider); // Contract pointer


async function erc20TxnHistory(contract, block5min) {

    function arrayFilter(transferTxn) {
        return transferTxn["blockNumber"] >= block5min
    }

    const eventFilter = contract.filters.Transfer(null, "0x9b52aa46AfaED4E9E5F576d19D369C65F9f3ea58", null)
    const events = await contract.queryFilter(eventFilter)
    var filtered = events.filter(arrayFilter)
    return filtered
}

async function erc20KnowPayBacks(contractPointers, block5min) {
    // const block5min = calculateBlockNum(300) // 5min = 300sec
    let erc20PayBack = []

    let i = 0;
    while (i < contractPointers.length) {
        const history = await erc20TxnHistory(contractPointers[i], block5min)
        let j = 0;
        while (j < history.length) {
            erc20PayBack.push({
                "sender": history[j].args.src,
                "tokenERC20": history[j].address,
                "amount": history[j].args.wad.toString()
            })
            j++;
        }
        i++;
    }
    return erc20PayBack
}

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

// --------------------------------------------------------------------------------------------------------------------------------------------- //

// 

module.exports = {
    depositETH: depositETH,
    burnETH: burnETH,
    withdrawETH: withdrawETH,
    approveERC20: approveERC20,
    depositERC20: depositERC20,
    burnERC20: burnERC20,
    withdrawERC20: withdrawERC20,
    calculateBlockNum: calculateBlockNum,
    knowPayBacks: knowPayBacks,
    sendETH: sendETH,
    erc20KnowPayBacks: erc20KnowPayBacks,
    dERC20: dERC20,
    wETH: wETH
}