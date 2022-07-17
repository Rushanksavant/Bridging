const dotenv = require('dotenv');
const path = require('path');
const env = dotenv.config({
    path: path.join(__dirname, '../.env')
});

if (env.error) {
    throw new Error("no env file found");
}

module.exports = {
    parent: {
        rpc: process.env.ROOT_RPC,
    },
    child: {
        rpc: 'https://rpc-mumbai.matic.today',
    },
    pos: { // https://docs.polygon.technology/docs/develop/network-details/mapped-tokens
        parent: {
            test: [
                "0x60D4dB9b534EF9260a88b0BED6c486fe13E604Fc", // PoS-WETH
                "0x655F2166b0709cd575202630952D71E2bB0d61Af" // DummyERC20Token
            ],
            erc20: ["0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // PoS-WETH
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // PoS-USDC
                "0xc00e94cb662c3520282e6f5717214004a7f26888", // PoS-COMP
                "0x80fB784B7eD66730e8b1DBd9820aFD29931aab03", // PoS-LEND
                "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e", // PoS-YFI
                "0xdac17f958d2ee523a2206206994597c13d831ec7", // PoS-USDT
                "0x6b175474e89094c44da98b954eedeac495271d0f", // PoS-DAI
                "0x4fabb145d64652a948d72533023f6e7a623c7c53", // PoS-BUSD
                "0x0f5d2fb29fb7d3cfee444a200298f468908cc942", // PoS-MANA
                "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", // PoS-WBTC
                "0xb6ed7644c69416d67b522e20bc294a9a9b405b31", // PoS-0xBTC
                "0x2BF91c18Cd4AE9C2f2858ef9FE518180F7B5096D", // PoS-KIWI
                "0xbca3c97837a39099ec3082df97e28ce91be14472", // PoS-DUST
                "0x20f7a3ddf244dc9299975b4da1c39f8d5d75f05a", // PoS-SPN
                "0xf2F3bD7Ca5746C5fac518f67D1BE87805a2Be82A", // DummyERC20Token
            ],
            chainManagerAddress: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74', // Address of RootChainManager for POS Portal
        },
        child: {
            test: [
                "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa", // PoS-WETH
                "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1" // DummyERC20Token
            ],
            erc20: ["0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // PoS-WETH
                "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // PoS-USDC
                "0x8505b9d2254A7Ae468c0E9dd10Ccea3A837aef5c", // PoS-COMP
                "0x313d009888329C9d1cf4f75CA3f32566335bd604", // PoS-LEND
                "0xDA537104D6A5edd53c6fBba9A898708E465260b6", // PoS-YFI
                "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // PoS-USDT
                "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", // PoS-DAI
                "0xdAb529f40E671A1D4bF91361c21bf9f0C9712ab7", // PoS-BUSD
                "0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4", // PoS-MANA
                "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", // PoS-WBTC
                "0x71B821aa52a49F32EEd535fCA6Eb5aa130085978", // PoS-0xBTC
                "0x578360AdF0BbB2F10ec9cEC7EF89Ef495511ED5f", // PoS-KIWI
                "0x556f501CF8a43216Df5bc9cC57Eb04D4FFAA9e6D", // PoS-DUST
                "0xeAb9Cfb094db203e6035c2e7268A86DEbeD5BD14", // PoS-SPN
                "0xeFfdCB49C2D0EF813764B709Ca3c6fe71f230E3e", // DummyERC20Token
            ],
            weth: '0x714550C2C1Ea08688607D86ed8EeF4f5E4F22323',
        },
    },
    SYNCER_URL: 'https://testnetv3-syncer.api.matic.network/api/v1', // Backend service which syncs the Matic sidechain state to a MySQL database which we use for faster querying. This comes in handy especially for constructing withdrawal proofs while exiting assets from Plasma.
    WATCHER_URL: 'https://testnetv3-watcher.api.matic.network/api/v1', // Backend service which syncs the Matic Plasma contract events on Ethereum mainchain to a MySQL database which we use for faster querying. This comes in handy especially for listening to asset deposits on the Plasma contract.
    user1: {
        // '<paste your private key here>' - A sample private key prefix with `0x`
        privateKey: process.env.USER1_PRIVATE_KEY,
        //'<paste address belonging to private key here>', Your address
        address: process.env.USER1_FROM
    },
    user2: {
        address: process.env.USER2_FROM
    },
    proofApi: 'https://apis.matic.network/'
}