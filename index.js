require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const Web3 = require("web3");
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

// WEB3 CONFIG
const web3 = new Web3(process.env.RPC_URL);

// EXCHANGE
const { kyberRateContract } = require("./exchange/kyber.js");
const {
  uniswapFactoryContract,
  UNISWAP_EXCHANGE_ABI,
} = require("./exchange/uniswap.js");

// Minimum ETH to swap
const ETH_AMOUNT = web3.utils.toWei("1", "ETHER");

async function checkPair(args) {
  const {
    inputTokenSymbol,
    inputTokenAddress,
    outputTokenSymbol,
    outputTokenAddress,
    inputAmount,
  } = args;

  const exchangeAddress = await uniswapFactoryContract.methods
    .getExchange(outputTokenAddress)
    .call();
  const exchangeContract = new web3.eth.Contract(
    UNISWAP_EXCHANGE_ABI,
    exchangeAddress
  );

  const uniswapResult = await exchangeContract.methods
    .getEthToTokenInputPrice(inputAmount)
    .call();
  let kyberResult = await kyberRateContract.methods
    .getExpectedRate(
      inputTokenAddress,
      outputTokenAddress,
      inputAmount.toString()
    )
    .call();

  console.table([
    {
      "Input Token": inputTokenSymbol,
      "Output Token": outputTokenSymbol,
      "Input Amount": web3.utils.fromWei(inputAmount, "Ether"),
      "Uniswap Return": web3.utils.fromWei(uniswapResult, "Ether"),
      "Kyber Expected Rate": web3.utils.fromWei(
        kyberResult.expectedRate,
        "Ether"
      ),
      "Kyber Min Return": web3.utils.fromWei(kyberResult.worstRate, "Ether"),
      // Timestamp: moment().tz("America/Chicago").format(),
    },
  ]);
}

let priceMonitor;
let monitoringPrice = false;

async function monitorPrice() {
  if (monitoringPrice) {
    return;
  }

  monitoringPrice = true;

  try {
    // ADD YOUR CUSTOM TOKEN PAIRS HERE!!!

    await checkPair({
      inputTokenSymbol: "ETH",
      inputTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      outputTokenSymbol: "MKR",
      outputTokenAddress: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
      inputAmount: ETH_AMOUNT,
    });

    await checkPair({
      inputTokenSymbol: "ETH",
      inputTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      outputTokenSymbol: "DAI",
      outputTokenAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
      inputAmount: ETH_AMOUNT,
    });

    await checkPair({
      inputTokenSymbol: "ETH",
      inputTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      outputTokenSymbol: "KNC",
      outputTokenAddress: "0xdd974d5c2e2928dea5f71b9825b8b646686bd200",
      inputAmount: ETH_AMOUNT,
    });

    await checkPair({
      inputTokenSymbol: "ETH",
      inputTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      outputTokenSymbol: "LINK",
      outputTokenAddress: "0x514910771af9ca656af840dff83e8264ecf986ca",
      inputAmount: ETH_AMOUNT,
    });
  } catch (error) {
    console.error(error);
    monitoringPrice = false;
    clearInterval(priceMonitor);
    return;
  }

  monitoringPrice = false;
}

// Check markets every n seconds
const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 3000; // 3 Seconds
priceMonitor = setInterval(async () => {
  await monitorPrice();
}, POLLING_INTERVAL);

// Function to get gas limit for trading
async function getGasLimit(source, dest, amount) {
  // let gasLimitRequest = await fetch(`https://${NETWORK == "mainnet" ? "" : NETWORK + "-"}api.kyber.network/gas_limit?source=${source}&dest=${dest}&amount=${amount}`);
  // let gasLimit = await gasLimitRequest.json();
  // return gasLimit.data;
}
