require("dotenv").config();
const { ethers } = require("ethers");
const { getEvents } = require("./utils/fetch");

const main = async (fromLast) => {
  let provider;

  if (process.env.PROJECT_ID) {
    provider = new ethers.providers.InfuraProvider(
      "homestead",
      process.env.PROJECT_ID
    );
  }

  let stats;
  if (provider) {
    try {
      console.log("scraper started");
      stats = await getEvents(provider, fromLast);
      console.log("scraper ended");
    } catch (err) {
      console.log("stats crash:");
      console.log(err);
    }
  } else {
    console.log("no provider");
  }
  return stats;
};

module.exports = {
  scraper: main,
};
