const { web3, NETWORK } = require("../web3.js");

const KYBER_RATE_ADDRESS = "0x96b610046d63638d970e6243151311d8827d69a5";

// using Kyber Proxy
const KYBER_FACTORY_ADDRESS = {
  mainnet: "0x9AAb3f75489902f3a48495025729a0AF77d4b11e",
  ropsten: "0xd719c34261e099Fdb33030ac8909d5788D3039C4",
}

const KYBER_RATE_ABI = [
  {
    constant: false,
    inputs: [{ name: "alerter", type: "address" }],
    name: "removeAlerter",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "pendingAdmin",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getOperators",
    outputs: [{ name: "", type: "address[]" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "sendTo", type: "address" },
    ],
    name: "withdrawToken",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "newAlerter", type: "address" }],
    name: "addAlerter",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "newAdmin", type: "address" }],
    name: "transferAdmin",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "newFactor", type: "uint256" }],
    name: "setQuantityFactor",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "claimAdmin",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "newAdmin", type: "address" }],
    name: "transferAdminQuickly",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getAlerters",
    outputs: [{ name: "", type: "address[]" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "newOperator", type: "address" }],
    name: "addOperator",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "worstCaseRateFactorInBps",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "quantityFactor",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "operator", type: "address" }],
    name: "removeOperator",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "kyberNetwork",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "sendTo", type: "address" },
    ],
    name: "withdrawEther",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "src", type: "address" },
      { name: "dest", type: "address" },
      { name: "srcQty", type: "uint256" },
      { name: "usePermissionless", type: "bool" },
    ],
    name: "getExpectedRate",
    outputs: [
      { name: "expectedRate", type: "uint256" },
      { name: "slippageRate", type: "uint256" },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      { name: "token", type: "address" },
      { name: "user", type: "address" },
    ],
    name: "getBalance",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "bps", type: "uint256" }],
    name: "setWorstCaseRateFactor",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "admin",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "_kyberNetwork", type: "address" },
      { name: "_admin", type: "address" },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "newFactor", type: "uint256" },
      { indexed: false, name: "oldFactor", type: "uint256" },
      { indexed: false, name: "sender", type: "address" },
    ],
    name: "QuantityFactorSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "newMin", type: "uint256" },
      { indexed: false, name: "oldMin", type: "uint256" },
      { indexed: false, name: "sender", type: "address" },
    ],
    name: "MinSlippageFactorSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "token", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "sendTo", type: "address" },
    ],
    name: "TokenWithdraw",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "sendTo", type: "address" },
    ],
    name: "EtherWithdraw",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "pendingAdmin", type: "address" }],
    name: "TransferAdminPending",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "newAdmin", type: "address" },
      { indexed: false, name: "previousAdmin", type: "address" },
    ],
    name: "AdminClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "newAlerter", type: "address" },
      { indexed: false, name: "isAdd", type: "bool" },
    ],
    name: "AlerterAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, name: "newOperator", type: "address" },
      { indexed: false, name: "isAdd", type: "bool" },
    ],
    name: "OperatorAdded",
    type: "event",
  },
];

const KYBER_NETWORK_PROXY_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "trader",
        type: "address",
      },
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "src",
        type: "address",
      },
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "dest",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "destAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "actualSrcAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "actualDestAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "platformWallet",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "platformFeeBps",
        type: "uint256",
      },
    ],
    name: "ExecuteTrade",
    type: "event",
  },
  {
    inputs: [
      {
        name: "src",
        type: "address",
      },
      {
        name: "dest",
        type: "address",
      },
      {
        name: "srcQty",
        type: "uint256",
      },
    ],
    name: "getExpectedRate",
    outputs: [
      {
        name: "expectedRate",
        type: "uint256",
      },
      {
        name: "slippageRate",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "src", type: "address" },
      { internalType: "contract IERC20", name: "dest", type: "address" },
      { internalType: "uint256", name: "srcQty", type: "uint256" },
      { internalType: "uint256", name: "platformFeeBps", type: "uint256" },
      { internalType: "bytes", name: "hint", type: "bytes" },
    ],
    name: "getExpectedRateAfterFee",
    outputs: [
      { internalType: "uint256", name: "expectedRate", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "src", type: "address" },
      { internalType: "uint256", name: "srcAmount", type: "uint256" },
      { internalType: "contract IERC20", name: "dest", type: "address" },
      { internalType: "address payable", name: "destAddress", type: "address" },
      { internalType: "uint256", name: "maxDestAmount", type: "uint256" },
      { internalType: "uint256", name: "minConversionRate", type: "uint256" },
      {
        internalType: "address payable",
        name: "platformWallet",
        type: "address",
      },
    ],
    name: "trade",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract ERC20", name: "src", type: "address" },
      { internalType: "uint256", name: "srcAmount", type: "uint256" },
      { internalType: "contract ERC20", name: "dest", type: "address" },
      { internalType: "address payable", name: "destAddress", type: "address" },
      { internalType: "uint256", name: "maxDestAmount", type: "uint256" },
      { internalType: "uint256", name: "minConversionRate", type: "uint256" },
      { internalType: "address payable", name: "walletId", type: "address" },
      { internalType: "bytes", name: "hint", type: "bytes" },
    ],
    name: "tradeWithHint",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "src", type: "address" },
      { internalType: "uint256", name: "srcAmount", type: "uint256" },
      { internalType: "contract IERC20", name: "dest", type: "address" },
      { internalType: "address payable", name: "destAddress", type: "address" },
      { internalType: "uint256", name: "maxDestAmount", type: "uint256" },
      { internalType: "uint256", name: "minConversionRate", type: "uint256" },
      {
        internalType: "address payable",
        name: "platformWallet",
        type: "address",
      },
      { internalType: "uint256", name: "platformFeeBps", type: "uint256" },
      { internalType: "bytes", name: "hint", type: "bytes" },
    ],
    name: "tradeWithHintAndFee",
    outputs: [{ internalType: "uint256", name: "destAmount", type: "uint256" }],
    stateMutability: "payable",
    type: "function",
  },
];

const kyberRateContract = new web3.eth.Contract(
  // KYBER_RATE_ABI,
  // KYBER_RATE_ADDRESS
  KYBER_NETWORK_PROXY_ABI,
  KYBER_FACTORY_ADDRESS[NETWORK]
);

async function getKyberRate(data) {
  const {
    inputTokenSymbol,
    inputTokenAddress,
    outputTokenSymbol,
    outputTokenAddress,
    inputAmount,
  } = data;
  try {
    const kyberResult = await kyberRateContract.methods
      .getExpectedRate(inputTokenAddress, outputTokenAddress, inputAmount)
      .call();
    return kyberResult;
  } catch (error) {
    error.message = `[getKyberRate][${inputTokenSymbol} to ${outputTokenSymbol}] ${error.message}`;
    throw error;
  }
}

module.exports = { getKyberRate };
