require("dotenv").config();

// WEB3
const { web3, NETWORK } = require("./web3.js");

// TOKEN MAPPINGS
const { tokenMap } = require("./token-address.js");

// EXCHANGES
const { getKyberRate } = require("./exchanges/kyberswap.js");
const { getUniswapRate } = require("./exchanges/uniswap.js");

const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const moment = require("moment-timezone");
const numeral = require("numeral");
const _ = require("lodash");
const axios = require("axios");

// SERVER CONFIG
const PORT = process.env.PORT || 5000;
const app = express();
const server = http
  .createServer(app)
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// User Details
// const PRIVATE_KEY = Buffer.from(process.env.PRIVATE_KEY, "hex"); //exclude 0x prefix
// const USER_ADDRESS = web3.eth.accounts.privateKeyToAccount(
//   "0x" + PRIVATE_KEY.toString("hex")
// ).address;
// console.log(USER_ADDRESS)

// Minimum ETH to swap
const ETH_AMOUNT = web3.utils.toWei("1", "ETHER");
const DEADLINE = 1742680400;
const inputTokenSymbol = "ETH";
const inputTokenAddress = tokenMap[NETWORK][inputTokenSymbol];

async function checkPair(outputTokenSymbol) {
  try {
    if (Object.keys(tokenMap[NETWORK]).includes(outputTokenSymbol)) {
      const outputTokenAddress = tokenMap[NETWORK][outputTokenSymbol];

      data = {
        inputTokenSymbol,
        inputTokenAddress,
        outputTokenSymbol,
        outputTokenAddress,
        inputAmount: ETH_AMOUNT,
      };

      // Get UniSwap rate
      const uniswapResult = await getUniswapRate(data);

      // Get KyberSwap rate
      const kyberResult = await getKyberRate(data);

      console.table([
        {
          "Input Token": inputTokenSymbol,
          "Output Token": outputTokenSymbol,
          "Input Amount": web3.utils.fromWei(ETH_AMOUNT, "Ether"),
          "Uniswap Return": uniswapResult
            ? web3.utils.fromWei(uniswapResult, "Ether")
            : "N/A",
          "Kyber Expected Rate":
            kyberResult && kyberResult.expectedRate
              ? web3.utils.fromWei(kyberResult.expectedRate, "Ether")
              : "N/A",
          "Kyber Min Return":
            kyberResult && kyberResult.slippageRate
              ? web3.utils.fromWei(kyberResult.slippageRate, "Ether")
              : "N/A",
          // Timestamp: moment().tz("America/Chicago").format(),
        },
      ]);
    } else {
      console.warn(`${outputTokenSymbol} not found in token map`);
    }
  } catch (error) {
    console.error(error);
    clearInterval(priceMonitor);
  }
}

// Check markets every n seconds
const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 5000;
priceMonitor = setInterval(() => {
  const monitorTokens = ["DAI"];
  monitorTokens.forEach(async (token) => await checkPair(token));
}, POLLING_INTERVAL);

// Function to get gas limit for trading
async function getGasLimit(source, dest, amount) {
  // let gasLimitRequest = await fetch(`https://${NETWORK == "mainnet" ? "" : NETWORK + "-"}api.kyber.network/gas_limit?source=${source}&dest=${dest}&amount=${amount}`);
  // let gasLimit = await gasLimitRequest.json();
  // return gasLimit.data;
}
