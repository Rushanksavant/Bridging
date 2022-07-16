import pkg from '@maticnetwork/maticjs';
const { use, POSClient } = pkg;

import pkgEjs from '@maticnetwork/maticjs-ethers';
const { Web3ClientPlugin } = pkgEjs;

import { providers, Wallet } from "ethers";

import config from "./config.js"

// install ethers plugin
use(Web3ClientPlugin)

const provider = new providers.JsonRpcProvider(config.parent.rpc);


const posClient = new POSClient();
await posClient.init({
    network: 'testnet',
    version: 'mumbai',
    parent: {
        provider: new Wallet(config.user1.privateKey, provider),
        defaultConfig: {
            from: config.user1.address
        }
    },
    child: {
        provider: config.child.rpc,
        defaultConfig: {
            from: config.user2.address
        }
    }
})

// console.log(posClient)