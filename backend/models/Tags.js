const mongoose = require("mongoose");

const TagsSchema = new mongoose.Schema({
  tag_title: {
    type: String,
  },
  icon_url: {
    type: String,
  },
  tag_uuid: {
    type: String,
  },
  tag_type: {
    type: String,
  },
  min: {
    type: String,
  },
  max: {
    type: String,
  },
  height: {
    type: String,
  },
  width: {
    type: String,
  },
  scale: {
    type: String,
  },
  circle: {
    type: Boolean,
  },
  back: {
    type: Boolean,
  },
});

module.exports = mongoose.model("tags", TagsSchema);
