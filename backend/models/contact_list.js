const mongoose = require("mongoose");

const Contact_list = new mongoose.Schema({
  user_uuid: {
    type: String,
  },
  contact_uuid: {
    type: String,
  },
  name: {
    type: String,
  },

  mobile: [
    {
      mobile: {
        type: String,
      },
      uuid: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("contact_lists", Contact_list);
