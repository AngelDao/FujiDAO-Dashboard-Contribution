const { EventPoint } = require("../../db");

const formatGrafana = async () => {
  const events = await EventPoint.find({}).sort({ blocknumber: 1 });

  const arr = events;

  const response = [
    { target: "ETHDAI-DEBT", datapoints: [] },
    { target: "ETHDAI-COLL", datapoints: [] },
    { target: "ETHUSDC-DEBT", datapoints: [] },
    { target: "ETHUSDC-COLL", datapoints: [] },
    { target: "USERSWITHDEBT", datapoints: [] },
    { target: "USERSWITHONLYCOLL", datapoints: [] },
  ];
  const accounts = {};
  let currentEthDaiSupply = 0;
  let currentEthUsdcSupply = 0;
  let currentDaiDebt = 0;
  let currentUsdcDebt = 0;

  arr.forEach((e) => {
    // console.log(response);
    const type = `${e.vault}-${e.type}`;
    const event = e.type;
    const timestamp = e.timestamp * 1000;
    const num = e.value;
    const user = e.user;
    // console.log(typeof num);

    if (!accounts[user]) {
      //   console.log("not present", user);
      accounts[user] = {
        ETHDAI: { debt: 0, coll: 0 },
        ETHUSDC: { debt: 0, coll: 0 },
      };
    }
    // console.log(event);
    if (e.vault === "ETHDAI") {
      if (event === "Payback") {
        currentDaiDebt += num;
        response[0].datapoints.push([currentDaiDebt, timestamp]);
        accounts[user].ETHDAI.debt += num;
      } else if (event === "Borrow") {
        currentDaiDebt += num;
        response[0].datapoints.push([currentDaiDebt, timestamp]);
        accounts[user].ETHDAI.debt += num;
      } else if (event === "Deposit") {
        currentEthDaiSupply += num;
        response[1].datapoints.push([currentEthDaiSupply, timestamp]);
        accounts[user].ETHDAI.coll += num;
      } else if (event === "Withdraw") {
        currentEthDaiSupply += num;
        response[1].datapoints.push([currentEthDaiSupply, timestamp]);
        accounts[user].ETHDAI.coll += num;
      }
    } else if (e.vault === "ETHUSDC") {
      if (event === "Payback") {
        currentUsdcDebt += num;
        response[2].datapoints.push([currentUsdcDebt, timestamp]);
        accounts[user].ETHUSDC.debt += num;
      } else if (event === "Borrow") {
        currentUsdcDebt += num;
        response[2].datapoints.push([currentUsdcDebt, timestamp]);
        accounts[user].ETHUSDC.debt += num;
      } else if (event === "Deposit") {
        currentEthUsdcSupply += num;
        response[3].datapoints.push([currentEthUsdcSupply, timestamp]);
        accounts[user].ETHUSDC.coll += num;
      } else if (event === "Withdraw") {
        currentEthUsdcSupply += num;
        response[3].datapoints.push([currentEthUsdcSupply, timestamp]);
        accounts[user].ETHUSDC.coll += num;
      }
    }
    let debtcount = 0;
    let collcount = 0;
    // console.log(accounts);
    Object.entries(accounts).forEach(([key, value]) => {
      const { ETHDAI, ETHUSDC } = value;
      //   console.log(debtcount);
      if (ETHDAI.debt > 0 || ETHUSDC.debt > 0) {
        debtcount += 1;
      }
      if (
        ETHDAI.debt === 0 &&
        ETHUSDC === 0 &&
        (ETHDAI.coll > 0 || ETHUSDC.coll > 0)
      ) {
        collcount += 1;
      }
    });
    response[4].datapoints.push([debtcount, timestamp]);
    response[5].datapoints.push([collcount, timestamp]);
  });

  return response;
};

module.exports = { formatGrafana };
