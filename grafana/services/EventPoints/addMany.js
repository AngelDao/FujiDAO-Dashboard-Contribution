const { EventPoint } = require("../../db");

const isUnique = async (blocknumber, type, vault, timestamp) => {
  const points = await EventPoint.find({
    blocknumber,
    type,
    vault,
    timestamp,
  }).exec();
  if (points.length > 0) {
    // console.log(points);
  }
  //   console.log(points);
  return points.length === 0;
};

const addMany = async (arr) => {
  //   console.log(arr);
  for (let i = 0; i <= arr.length - 1; i++) {
    // console.log(arr.length);
    // console.log(i);
    const event = arr[i];
    if (
      await isUnique(
        event.blocknumber,
        event.type,
        event.vault,
        event.timestamp
      )
    ) {
      await EventPoint.create(event);
      console.log("unique");
    } else {
      console.log("notunique");
    }
  }
};

module.exports = { addMany };
