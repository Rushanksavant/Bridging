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



// ETH -> Polygon for erc20

const approveERC20 = async (erc20RootToken, amount) => {
    const approveResult = await erc20RootToken.approve(amount);
    const txHash = await approveResult.getTransactionHash();
    console.log("Approve ERC20 txHash = ", txHash);
    const txReceipt = await approveResult.getReceipt();

    console.log("ERC20 approved")
}
const depositERC20 = async (erc20RootToken, amount, userAddress) => {
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

module.exports = {
    depositETH: depositETH,
    burnETH: burnETH,
    withdrawETH: withdrawETH,
    approveERC20: approveERC20,
    depositERC20: depositERC20,
    burnERC20: burnERC20,
    withdrawERC20: withdrawERC20
}