// import pkg from '@maticnetwork/maticjs';
const { use, POSClient } = require('@maticnetwork/maticjs');

// import pkgEjs from '@maticnetwork/maticjs-ethers';
const { Web3ClientPlugin } = require('@maticnetwork/maticjs-ethers');

const { providers, Wallet, utils } = require("ethers");

const { parent, user1, child, user2, pos, proofApi } = require("./config.js")

// install ethers plugin
use(Web3ClientPlugin)

const provider = new providers.JsonRpcProvider(parent.rpc);


const posClient = new POSClient();

async function initializeClient() {
    await posClient.init({
        network: 'testnet',
        version: 'mumbai',
        parent: {
            provider: new Wallet(user1.privateKey, provider),
            defaultConfig: {
                from: user1.address
            }
        },
        child: {
            provider: child.rpc,
            defaultConfig: {
                from: user2.address
            }
        }
    })
}
// initializeClient()
// console.log(posClient)

module.exports = {
    getPOSClient: initializeClient,
    child: child,
    pos: pos,
    from: user1.address,
    privateKey: user1.privateKey,
    to: user2.address,
    proofApi: proofApi,
};