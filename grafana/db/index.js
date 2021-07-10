const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/test");
const EventPoint = require("./models/EventPoint");
const RateBundle = require("./models/RateBundle");

module.exports = { EventPoint, RateBundle };
