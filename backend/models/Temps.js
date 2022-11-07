const mongoose = require("mongoose");

const TempSchema = new mongoose.Schema({
  img_name: {
    type: String,
  },
  expire: {
    type: Number,
  },
});

module.exports = mongoose.model("temps", TempSchema);
