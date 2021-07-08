const { EventPoint } = require("../../db");

const lastBlock = async () => {
  const points = await EventPoint.find({}).sort({ blocknumber: -1 }).limit(1);
  let lastBlock;
  console.log(points);
  if (points.length < 1) {
    lastBlock = 0;
  } else {
    lastBlock = points[0].blocknumber;
  }
  return lastBlock;
};

module.exports = { lastBlock };
