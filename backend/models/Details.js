const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  sms_count: {
    type: Number,
  },
});

module.exports = mongoose.model("details", CategorySchema);
