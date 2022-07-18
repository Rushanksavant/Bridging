const { ethers, Wallet } = require("ethers")
const { ropstenProvider } = require("./init/posClient.js")
const { user1 } = require("./init/config.js")

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
    console.log(transaction)
}
sendETH("0x84A5695eCDb9655Abb87626cCE2A57598114bCF4", 0.001 * 1e18)