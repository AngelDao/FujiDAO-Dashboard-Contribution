const { RateBundle } = require("../../db");

const formatGrafana = async (db) => {
  const response = [
    { target: "DYDXDAI", datapoints: [] },
    { target: "DYDXUSDC", datapoints: [] },
    { target: "AAVEDAI", datapoints: [] },
    { target: "AAVEUSDC", datapoints: [] },
    { target: "COMPOUNDDAI", datapoints: [] },
    { target: "COMPOUNDUSDC", datapoints: [] },
  ];
  console.log("entered");

  const today = new Date();
  const temp = new Date();
  const monthAgo = new Date(temp.setDate(today.getDate() - 30));
  const collection = await db.db("borrowingMarkets").collection("rates");

  //   console.log(today);
  //   console.log(monthAgo);

  const todayISO = today.toISOString();
  //   console.log(todayISO);
  const monthISO = monthAgo.toISOString();

  const dydxUSDCRates = [];
  const aaveUSDCRates = [];
  const compoundUSDCRates = [];

  const dydxDAIRates = [];
  const aaveDAIRates = [];
  const compoundDAIRates = [];

  let amount = 0;

  for (let i = 0; i <= Infinity; i += 3000) {
    let done = true;
    console.log(i);
    const dydxUSDCPoint = await collection
      .find({
        protocol: "DyDx-V1",
        symbol: "USDC",
      })
      .sort({ createdAt: 1 })
      .skip(i)
      .limit(1)
      .toArray();
    if (dydxUSDCPoint.length > 0) {
      done = false;
      const point = dydxUSDCPoint[0];
      const timestamp = new Date(point.createdAt);
      response[1].datapoints.push([point.borrowRate, timestamp.getTime()]);
    }
    const dydxDAIPoint = await collection
      .find({
        protocol: "DyDx-V1",
        symbol: "DAI",
      })
      .sort({ createdAt: 1 })
      .skip(i)
      .limit(1)
      .toArray();
    if (dydxDAIPoint.length > 0) {
      done = false;
      const point = dydxDAIPoint[0];
      const timestamp = new Date(point.createdAt);
      response[0].datapoints.push([point.borrowRate, timestamp.getTime()]);
    }
    const aaveUSDCPoint = await collection
      .find({
        protocol: "Aave-V2",
        symbol: "USDC",
      })
      .sort({ createdAt: 1 })
      .skip(i)
      .limit(1)
      .toArray();
    if (aaveUSDCPoint.length > 0) {
      done = false;
      const point = aaveUSDCPoint[0];
      const timestamp = new Date(point.createdAt);
      response[3].datapoints.push([point.borrowRate, timestamp.getTime()]);
    }
    const aaveDAIPoint = await collection
      .find({
        protocol: "Aave-V2",
        symbol: "DAI",
      })
      .sort({ createdAt: 1 })
      .skip(i)
      .limit(1)
      .toArray();
    if (aaveDAIPoint.length > 0) {
      done = false;
      const point = aaveDAIPoint[0];
      const timestamp = new Date(point.createdAt);
      response[2].datapoints.push([point.borrowRate, timestamp.getTime()]);
    }
    const compoundUSDCPoint = await collection
      .find({
        protocol: "Compound-V2",
        symbol: "USDC",
      })
      .sort({ createdAt: 1 })
      .skip(i)
      .limit(1)
      .toArray();
    if (compoundUSDCPoint.length > 0) {
      done = false;
      const point = compoundUSDCPoint[0];
      const timestamp = new Date(point.createdAt);
      response[5].datapoints.push([point.borrowRate, timestamp.getTime()]);
    }
    const compoundDAIPoint = await collection
      .find({
        protocol: "Compound-V2",
        symbol: "DAI",
      })
      .sort({ createdAt: 1 })
      .skip(i)
      .limit(1)
      .toArray();
    if (compoundDAIPoint.length > 0) {
      done = false;
      const point = compoundDAIPoint[0];
      const timestamp = new Date(point.createdAt);
      response[4].datapoints.push([point.borrowRate, timestamp.getTime()]);
    }
    if (done) {
      break;
    }
  }

  const now = new Date();

  await RateBundle.create({ rates: response, createdAt: now.toISOString() });
  console.log(response);
};

module.exports = { formatGrafana };
