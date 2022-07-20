const { ethers, Contract } = require("ethers");
const { ropstenProvider } = require("../init/posClient.js")
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
        return transferTxn["blockNumber"] >= 7252400
    }

    const eventFilter = contract.filters.Transfer(null, "0x9b52aa46AfaED4E9E5F576d19D369C65F9f3ea58", null)
    const events = await contract.queryFilter(eventFilter)
    var filtered = events.filter(arrayFilter)
    return filtered
}

async function erc20KnowPayBacks(contractPointers) {
    const provider = new ethers.providers.EtherscanProvider("goerli");
    const currentBlock = await provider.getBlockNumber()
    const blockTime = 15; // ETH block time is 15 seconds
    let erc20PayBack = []

    //Block number 5 mins ago
    const block5min = currentBlock - (300 / blockTime); // 5min = 300sec

    let i;
    while (i < contractPointers.length) {
        const history = await erc20TxnHistory(contractPointers[i], block5min)
        consoles.log(history)
        // let j
        // while (j < history.length) {
        //     erc20PayBack.push({
        //         "sender": history[j].args.src,
        //         "tokenERC20": history[j].address,
        //         "amount": history[j].args.wad.toString()
        //     })
        // }
    }
    return erc20PayBack
}

async function call() {
    const ans = await erc20KnowPayBacks([dERC20, wETH_Add])
    console.log(ans)
}
call()