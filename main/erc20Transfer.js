const { ethers, Contract } = require("ethers");
const { ropstenProvider } = require("../init/posClient.js")
const { abiDAI } = require("./erc20ABI.js");

const erc20ABI = [
    'event Approval(address indexed src, address indexed guy, uint256 wad)',
    'event LogNote(bytes4 indexed sig, address indexed usr, bytes32 indexed arg1, bytes32 indexed arg2, bytes data) anonymous',
    'event Transfer(address indexed src, address indexed dst, uint256 wad)',
    'function approve(address usr, uint256 wad) returns (bool)',
    'function transfer(address dst, uint256 wad) returns (bool)'
]

// To convert normal(JSON) ABI to Human Readable format 
// function getHumanReadable_ABI(normal_ABI) {
//     const iface = new ethers.utils.Interface(normal_ABI);
//     console.log(iface.format(ethers.utils.FormatTypes.full));
// }

// getHumanReadable_ABI(abiDAI)

async function sendERC20(recipient, amount, tokenAddress) {
    const wallet = new Wallet("a3281cad9d21a15724903e9400dd5e87440ea8b6c59a0847a2222ddfc53ddaff", ropstenProvider)
    const signer = wallet.connect(ropstenProvider)
    const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, ropstenProvider);

    const transaction = await tokenContract.connect("0x84A5695eCDb9655Abb87626cCE2A57598114bCF4").transfer(recipient, amount)
    return transaction
}

const transaction = await sendERC20("0xdd160613122C9b3ceb2a2709123e3020CaDa2546", 1000000000000000000, "0x655F2166b0709cd575202630952D71E2bB0d61Af")
console.log(transaction)
