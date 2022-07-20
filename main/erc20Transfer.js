const { ethers } = require("ethers");
const { ropstenProvider } = require("../init/posClient.js")
const erc20ABI = [
    'event Approval(address indexed src, address indexed guy, uint256 wad)',
    'event LogNote(bytes4 indexed sig, address indexed usr, bytes32 indexed arg1, bytes32 indexed arg2, bytes data) anonymous',
    'event Transfer(address indexed src, address indexed dst, uint256 wad)',
]

const dERC20_Add = "0x655F2166b0709cd575202630952D71E2bB0d61Af";
// Contract pointer
const dERC20 = new ethers.Contract(dERC20_Add, erc20ABI, ropstenProvider);
// console.log(dERC20)

// contract.on("Transfer", (from, to, value, event) => {
//     let info = {
//         from: from,
//         to: to,
//         value: ethers.utils.formatUnits(value, 6),
//         data: event,
//     }
// })

async function call() {
    const eventFilter = dERC20.filters.Transfer(null, "0x9b52aa46AfaED4E9E5F576d19D369C65F9f3ea58", null)
    const events = await dERC20.queryFilter(eventFilter)
    console.log(events)
}
call()