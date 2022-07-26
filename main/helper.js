const { ethers, Wallet } = require('ethers');
const { ropstenProvider } = require('../init/posClient.js');
const { user1, pos } = require('../init/config.js');

// ETH -> Polygon for ether

const depositETH = async (client, amount, userAddress) => {
  const result = await client.depositEther(amount, userAddress);
  const txHash = await result.getTransactionHash();
  console.log('Deposit ETH txHash = ', txHash);
  const txReceipt = await result.getReceipt();

  console.log('ETH deposited');
};

// --------------------------------------------------------------------------------------------------------------------------------------------- //

// ETH -> Polygon for erc20

const approveERC20 = async (erc20RootToken, amount) => {
  const approveResult = await erc20RootToken.approve(amount);
  const txHash = await approveResult.getTransactionHash();
  console.log('Approve ERC20 txHash = ', txHash);
  const txReceipt = await approveResult.getReceipt();

  console.log('ERC20 approved');
};
const depositERC20 = async (erc20RootToken, amount, userAddress) => {
  const result = await erc20RootToken.deposit(amount, userAddress);
  const txHash = await result.getTransactionHash();
  console.log('Deposit ERC20 txHash = ', txHash);
  const txReceipt = await result.getReceipt();

  console.log('ERC20 deposited');
};

// --------------------------------------------------------------------------------------------------------------------------------------------- //

async function calculateBlockNum(timeInterval) {
  const provider = new ethers.providers.EtherscanProvider('goerli');
  const currentBlock = await provider.getBlockNumber();
  const blockTime = 15; // ETH block time is 15 seconds

  //Block number 5 mins ago
  const block = currentBlock - timeInterval / blockTime;

  return [block, currentBlock];
}

// Know payBacks

async function knowPayBacks(
  myAddress,
  specificAddress,
  block5min,
  currentBlock
) {
  const provider = new ethers.providers.EtherscanProvider('goerli');
  // Get all txs for address since 5 mins
  let history = await provider.getHistory(myAddress, block5min, currentBlock);

  let i = 0;
  let payBack = [];
  while (i < history.length) {
    if (
      history[i].to == myAddress &&
      history[i].from != specificAddress &&
      history[i].value.toString() >= 200000000000000
    ) {
      payBack.push({
        sender: history[i].from,
        amount: history[i].value.toString(),
      });
    }
    i++;
  }
  return payBack;
}

// --------------------------------------------------------------------------------------------------------------------------------------------- //

// Know ERC20 payBacks

const erc20ABI = [
  'event Approval(address indexed src, address indexed guy, uint256 wad)',
  'event LogNote(bytes4 indexed sig, address indexed usr, bytes32 indexed arg1, bytes32 indexed arg2, bytes data) anonymous',
  'event Transfer(address indexed src, address indexed dst, uint256 wad)',
  'function decimals() view returns (uint8)',
  'function approve(address usr, uint256 wad) returns (bool)',
  'function transfer(address dst, uint256 wad) returns (bool)',
];

async function erc20TxnHistory(contractAddress, block5min) {
  const contractPointer = new ethers.Contract(
    contractAddress,
    erc20ABI,
    ropstenProvider
  );

  function arrayFilter(transferTxn) {
    return transferTxn['blockNumber'] >= block5min;
  }

  const eventFilter = contractPointer.filters.Transfer(
    null,
    user1.address,
    null
  );
  const events = await contractPointer.queryFilter(eventFilter);
  var filtered = events.filter(arrayFilter);
  return filtered;
}

async function erc20KnowPayBacks(
  contractAddresses,
  specificAddress,
  block5min
) {
  let erc20PayBack = [];

  let i = 0;
  while (i < contractAddresses.length) {
    const history = await erc20TxnHistory(contractAddresses[i], block5min);
    let j = 0;
    while (j < history.length) {
      if (history[j].args.src !== specificAddress) {
        erc20PayBack.push({
          sender: history[j].args.src,
          tokenERC20: history[j].address,
          amount: history[j].args.wad.toString(),
        });
      }
      j++;
    }
    i++;
  }
  return erc20PayBack;
}

// --------------------------------------------------------------------------------------------------------------------------------------------- //

// Send ETH

const sendETH = async (recipient, amount) => {
  const gasPrice = ropstenProvider.getGasPrice();
  const wallet = new Wallet(user1.privateKey, ropstenProvider);
  const signer = wallet.connect(ropstenProvider);

  const tx = {
    from: wallet.address,
    to: recipient,
    value: amount,
    gasPrice: gasPrice,
    gasLimit: ethers.utils.hexlify(100000), // 100 gwei
    nonce: ropstenProvider.getTransactionCount(wallet.address, 'latest'),
  };

  const transaction = await signer.sendTransaction(tx);
  return transaction;
};

// --------------------------------------------------------------------------------------------------------------------------------------------- //

// Send ERC20

async function sendERC20(recipient, amount, tokenAddress) {
  const wallet = new Wallet(user1.privateKey, ropstenProvider);
  const signer = wallet.connect(ropstenProvider);

  const tokenContract = new ethers.Contract(
    tokenAddress,
    erc20ABI,
    ropstenProvider
  );
  const decimal = await tokenContract.decimals();
  amount = amount / 10 ** decimal;
  amount = ethers.utils.parseUnits(amount.toString() + '.0', decimal);

  const transaction = await tokenContract
    .connect(signer)
    .transfer(recipient, amount);
  return transaction;
}

// --------------------------------------------------------------------------------------------------------------------------------------------- //

// Time delay

function codeExecutionDelay(seconds) {
  var start = new Date().getTime();
  var end = start;
  while (end < start + seconds) {
    end = new Date().getTime();
  }
}

// --------------------------------------------------------------------------------------------------------------------------------------------- //

module.exports = {
  depositETH: depositETH,
  approveERC20: approveERC20,
  depositERC20: depositERC20,
  calculateBlockNum: calculateBlockNum,
  knowPayBacks: knowPayBacks,
  sendETH: sendETH,
  erc20KnowPayBacks: erc20KnowPayBacks,
  contractAddresses: pos.parent.test, // pos.parent.erc20 when using mainnet
  sendERC20: sendERC20,
  delay: codeExecutionDelay,
};
