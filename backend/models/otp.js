const mongoose = require("mongoose");

const OTP = mongoose.Schema({

    expiry_time: { type: Number },
    user_mobile: { type: String },
    otp: { type: Number }
    
});

module.exports = mongoose.model("OTPs", OTP);