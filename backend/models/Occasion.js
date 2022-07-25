const mongoose = require("mongoose");

const OccasionSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  sort_order: {
    type: String,
  },
  occ_uuid: {
    type: String,
  },
  occ_date: {
    type: Number,
  },
  cat_uuid: [{ type: String }],
  status: {
    type: String,
  },
  expiry: {
    type: Number,
  },
  thumbnail_url: {
    type: String,
  },
  posters: [
    {
      url: {
        type: String,
      },
      id: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("occasion", OccasionSchema);
