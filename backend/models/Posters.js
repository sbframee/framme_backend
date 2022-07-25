const mongoose = require("mongoose");

const PosterSchema = new mongoose.Schema({
  posters: 
    {
      type: String,
    },
  expiry: 
    {
      type: Number,
    },
  sort_order: 
    {
      type: Number,
    },
  
});

module.exports = mongoose.model("posters", PosterSchema);
