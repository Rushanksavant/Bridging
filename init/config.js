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
    pos: {
        parent: {
            erc20: ["0x0D8775F648430679A709E98d2b0Cb6250d2887EF", // Bat
                "0xc00e94cb662c3520282e6f5717214004a7f26888", // Comp
                "0x6b175474e89094c44da98b954eedeac495271d0f", // Dai
                "0x1985365e9f78359a9B6AD760e32412f4a445E862", // Rep
                "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", // Uni
                "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // Usdc
                "0xdac17f958d2ee523a2206206994597c13d831ec7", // Usdt
                "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", // Wbtc
                "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", // Wbtc
                "0xe41d2489571d322189246dafa5ebde1f4699f498", // Zrx
                "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e", // Yei
                "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2", // Sushi
                "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2", // Mkr
                "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9", // Aave
                "0x0000000000085d4780B73119b644AE5ecd22b376", // Tusd
                "0x514910771af9ca656af840dff83e8264ecf986ca"], // Link
            chainManagerAddress: '0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74', // Address of RootChainManager for POS Portal
        },
        child: {
            erc20: ["0x3Cef98bb43d732E2F285eE605a8158cDE967D219", // Bat
                "0x8505b9d2254A7Ae468c0E9dd10Ccea3A837aef5c", // Comp
                "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", // Dai
                "0xC2C84b533a9518241e73D525AFC89C3C57769E9F", // Rep
                "0xb33EaAd8d922B1083446DC23f610c2567fB5180f", // Uni
                "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // Usdc
                "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // Usdt
                "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", // Wbtc
                "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", // Wbtc
                "0x5559Edb74751A0edE9DeA4DC23aeE72cCA6bE3D5", // Zrx
                "0xDA537104D6A5edd53c6fBba9A898708E465260b6", // Yei
                "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a", // Sushi
                "0x6f7C932e7684666C9fd1d44527765433e01fF61d", // Mkr
                "0xD6DF932A45C0f255f85145f286eA0b292B21C90B", // Aave
                "0x2e1AD108fF1D8C782fcBbB89AAd783aC49586756", // Tusd
                "0xb0897686c545045aFc77CF20eC7A532E3120E0F1"], // Link
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