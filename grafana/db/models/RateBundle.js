const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RateSchema = new Schema({
  rates: Array,
  createdAt: String,
});

const EventPoint = mongoose.model("ratebundle", RateSchema);

module.exports = EventPoint;
