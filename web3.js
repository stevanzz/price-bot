const Web3 = require("web3");
const NETWORK = process.env.NETWORK || "mainnet";
const RPC_URL = process.env.RPC_URL.replace("{NETWORK}", NETWORK);
const web3 = new Web3(RPC_URL);

// if (process.env.RPC_URL.includes('ropsten')) {
//   const PROJECT_ID = "766f61b00f2a4af8bb3dd21270b79f6b" //Replace this with your own Project ID
//   const WS_PROVIDER = `wss://ropsten.infura.io/ws/v3/${PROJECT_ID}`
//   web3 = new Web3(new Web3.providers.WebsocketProvider(WS_PROVIDER));
// }

module.exports = { web3, NETWORK };
