const mongoose = require("mongoose");

const TempSchema = new mongoose.Schema({
  img_name: {
    type: String,
  },
  expireed: {
    type: Number,
  },
});

module.exports = mongoose.model("temps", TempSchema);
