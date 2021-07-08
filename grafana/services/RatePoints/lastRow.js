const { RateBundle } = require("../../db");

const lastRow = async () => {
  const lastBundle = await RateBundle.find({}).sort({ createdAt: -1 }).limit(1);
  if (!lastBundle[0]) {
    return [{}, true];
  }
  const now = new Date();
  const last = new Date(lastBundle[0].createdAt);
  const day = 86400000;
  const diff = now.getTime() - last.getTime();
  return [lastBundle[0], diff > day];
};

module.exports = { lastRow };
