const express = require("express");
const { scraper } = require("./scraper");
const EPService = require("./services/EventPoints");
const RPService = require("./services/RatePoints");
const dataFiller = require("./utils/dataFiller");
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
const app = express();

const { MongoClient } = require("mongodb");
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect(async (err, db) => {
  app.post("/query", jsonParser, async (req, res) => {
    const ratesTargets = [
      "DYDXUSDC",
      "DYDXDAI",
      "AAVEUSDC",
      "AAVEDAI",
      "COMPOUNDUSDC",
      "COMPOUNDDAI",
    ];

    let flag = false;

    const targets = req.body.targets[0].data.only;
    targets.forEach((e) => {
      if (ratesTargets.includes(e)) {
        flag = true;
      }
    });
    if (flag) {
      const [bundle, isOld] = await RPService.lastRow();
      if (isOld) {
        await RPService.formatGrafana(db);
      }
      const metrics = bundle.rates.filter((e) => targets.includes(e.target));
      console.log(metrics);
      res.send(
        dataFiller(bundle.rates.filter((e) => targets.includes(e.target)))
      );
    } else {
      const lastBlock = (await EPService.lastBlock()) + 1;
      const eventPoints = await scraper(lastBlock);
      await EPService.addMany(eventPoints);
      const data0 = await EPService.formatGrafana();
      const metrics = data0.filter((e) => targets.includes(e.target));
      res.send(dataFiller(metrics));
    }
  });

  app.post("/search", jsonParser, async (req, res) => {
    console.log("search");
    res.send([
      "ETHUSDC-DEBT",
      "ETHDAI-DEBT",
      "DYDXUSDC",
      "DYDXDAI",
      "AAVEUSDC",
      "AAVEDAI",
      "COMPOUNDUSDC",
      "COMPOUNDDAI",
    ]);
  });

  app.get("/", async (req, res) => {
    console.log("hit");
    res.send(JSON.stringify([]));
  });

  app.listen(4000, () => {
    console.log("server started");
  });
});
