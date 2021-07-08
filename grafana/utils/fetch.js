require("dotenv").config();
const { ethers } = require("ethers");
const { ETHUSDC, ETHDAI } = require("./addresses");
const { queryEvents } = require("./helpers");

const chooseVault = (type) => {
  const daiV = ["DD", "DS"];
  const usdcV = ["UD", "US"];
  if (daiV.includes(type)) {
    return "ETHDAI";
  }
  if (usdcV.includes(type)) {
    return "ETHUSDC";
  }
};

const chooseValue = (event, value) => {
  const neg = ["Payback", "Withdraw"];
  const pos = ["Deposit", "Borrow"];
  console.log(event);
  if (neg.includes(event)) {
    console.log(value);
    const test = Math.abs(value) * -1;
    console.log(test);
    return test;
  }

  if (pos.includes(event)) {
    return value;
  }
};

const getEvents = async (provider, fromLast) => {
  const allEvents = await queryEvents(provider, fromLast);

  const eventsData = [];

  let tx = null;
  let currentType = null;
  let val = 0;
  for (let i = 0; i <= allEvents.length - 1; i++) {
    // console.log(i);
    const e = allEvents[i];
    const event = e.event;
    const user = e.args.userAddrs;

    if (allEvents[i].address === ETHDAI) {
      tx = allEvents[i].transactionHash;
      const num = parseFloat(
        ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 18)
      );
      val = num;
      if (event === "Payback") {
        currentType = "DD";
      } else if (event === "Borrow") {
        currentType = "DD";
      } else if (event === "Deposit") {
        currentType = "DS";
      } else if (event === "Withdraw") {
        currentType = "DS";
      }
    }

    if (allEvents[i].address === ETHUSDC) {
      tx = allEvents[i].transactionHash;
      const usdcNum = parseFloat(
        ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 6)
      );
      const num = parseFloat(
        ethers.utils.formatUnits(allEvents[i].args.amount.toString(), 18)
      );

      if (event === "Payback") {
        currentType = "UD";
        val = usdcNum;
      } else if (event === "Borrow") {
        currentType = "UD";
        val = usdcNum;
      } else if (event === "Deposit") {
        currentType = "US";
        val = num;
      } else if (event === "Withdraw") {
        currentType = "US";
        val = num;
      }
    }

    const timestamp = (await provider.getBlock(allEvents[i].blockNumber))
      .timestamp;
    const blocknumber = allEvents[i].blockNumber;

    const eventPoint = {
      user,
      vault: chooseVault(currentType),
      type: event,
      value: chooseValue(event, val),
      blocknumber,
      timestamp,
    };

    eventsData.push(eventPoint);
  }
  return eventsData;
};

module.exports = {
  getEvents,
};
