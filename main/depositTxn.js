const { BigNumber } = require('ethers');
const { getPOSClient, from, ropstenProvider } = require('../init/posClient.js');
const {
  depositETH,
  approveERC20,
  depositERC20,
  calculateBlockNum,
  knowPayBacks,
  erc20KnowPayBacks,
  contractAddresses,
  sendETH,
  sendERC20,
  delay,
} = require('./helper.js');

/**
 * @title Main function
 * @dev If ETH balance > minBalanceETH, repay ETH to senders (except 0xspecific)
 * @dev If ETH balance > minBalanceETH, bridge ERC20s to Polygon
 * @dev If ETH balance > minBalanceETH, bridge ETH to Polygon
 * @param specificAddress Address allowed to send funds to 0xmain(our wallet)
 */
const execute = async (specificAddress, recursiveInterval) => {
  const client = await getPOSClient();
  const minBalanceETH = 1000000 * 5000000000; // minimum eth balance of wallet
  const [block, currentBlock] = await calculateBlockNum(recursiveInterval);

  let latestPayBack = await knowPayBacks(
    from,
    specificAddress,
    block,
    currentBlock
  ); // 0xmain, 0xspecific, block no. 5 min ago, current block no.
  let latestERC20PayBack = await erc20KnowPayBacks(
    contractAddresses,
    specificAddress,
    block
  ); // ERC20 addresses, 0xspecific, block no. 5 min ago
  console.log('');

  let ethBalanceNow1 = await ropstenProvider.getBalance(from);
  ethBalanceNow1 = BigNumber.from(ethBalanceNow1).toString();

  // #### Repaying payBacks (ETH sent from other addresses except 0xspecific)

  const estimatedGas =
    (await (await ropstenProvider.getGasPrice()).toString()) * 30000;

  if (latestPayBack.length > 0) {
    let i = 0;
    while (i < latestPayBack.length) {
      const transaction = await sendETH(
        specificAddress,
        (latestPayBack[i]['amount'] - estimatedGas).toString()
      ); // deducting gas from original amount
      ethBalanceNow1 = ethBalanceNow1 - latestPayBack[i]['amount']; // update current ETH wallet balance
      delay(3000); // 3 seconds delay after txn initialization
      console.log(transaction);
      i++;
    }
  } else {
    console.log('No payBacks in last 5 mins');
  }
  console.log(
    '--------------------------------------------------------------------------------'
  );

  // #### Repaying payBacks (ERC20 sent from other addresses except 0xspecific)

  if (latestERC20PayBack.length > 0) {
    // Condition 1 (should have payBacks)
    if (ethBalanceNow1 > 500000000000000) {
      // Condition 2 (should have sufficient ETH) 0.0005 ETH

      let i = 0;
      while (i < latestERC20PayBack.length) {
        const transaction = await sendERC20(
          specificAddress,
          latestERC20PayBack[i]['amount'],
          latestERC20PayBack[i]['tokenERC20']
        );
        await transaction.wait();
        console.log(transaction);
        i++;
      }
    } else {
      console.log(
        'Insufficient balance to pay for gas fees, these tokens will be bridged to Polygon when wallet balance is sufficient'
      );
    }
  } else {
    console.log('No ERC20 payBacks in last 5 mins');
  }
  console.log(
    '--------------------------------------------------------------------------------'
  );

  // #### Bridging ERC20

  let ethBalanceNow2 = await ropstenProvider.getBalance(from);
  ethBalanceNow2 = BigNumber.from(ethBalanceNow2).toString();

  if (ethBalanceNow2 > 500000000000000) {
    // 0.0005 ETH
    let i = 0;
    while (i < contractAddresses.length) {
      const erc20Token = client.erc20(contractAddresses[i], true);
      let balance = await erc20Token.getBalance(from);
      balance = BigNumber.from(balance).toString();
      if (balance > 0) {
        await approveERC20(erc20Token, balance); // lock asset
        await depositERC20(erc20Token, balance, from); // bridge
      }
      i++;
    }
  } else {
    console.log('Insufficient balance to pay for gas fees');
  }
  console.log(
    '--------------------------------------------------------------------------------'
  );

  // #### Bridging ETH

  let ethBalanceNow3 = await ropstenProvider.getBalance(from);
  ethBalanceNow3 = BigNumber.from(ethBalanceNow3).toString();

  if (ethBalanceNow3 > minBalanceETH) {
    console.log('possible');
    let amount = ethBalanceNow3 - minBalanceETH;
    // amount = BigNumber.from(amount).toString();
    console.log(amount);
    await depositETH(client, amount.toString(), from); // bridge
  } else {
    console.log(
      'Wallet balance <',
      minBalanceETH / 1e18,
      'ETH, hence cannot check for ETH'
    );
  }

  console.log('');
};

module.exports = { main: execute };
// Main function call
// execute('0xdd160613122C9b3ceb2a2709123e3020CaDa2546', 300)
//   .then(() => {})
//   .catch((err) => {
//     console.error('err', err);
//   })
//   .finally((_) => {
//     process.exit(0);
//   });
