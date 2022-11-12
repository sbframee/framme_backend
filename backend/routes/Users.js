const express = require("express");
const Users = require("../models/Users");
const { v4: uuid } = require("uuid");
const router = express.Router();
const OTP = require("../models/otp");
const Details = require("../models/Details");
var msg91 = require("msg91-templateid")(
  "312759AUCbnlpoZeD61714959P1",
  "foodDo",
  "4"
);
router.post("/postUser", async (req, res) => {
  try {
    const value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    console.log(value);
    const response = await Users.create(value);
    if (response) res.json({ success: true, result: response });
    else res.json({ success: false, message: "User Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});
router.post("/varifyOtp", async (req, res) => {
  try {
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    let user_mobile = value.user_name;
    user_mobile = "+91" + user_mobile;
    console.log(value);
    let otp_key;
    const pastOTP = await OTP.findOne({ user_mobile }).exec();

    if (pastOTP) {
      otp_key = await pastOTP.otp;
      await OTP.findOneAndUpdate(
        { user_mobile },
        { expiry_time: Date.now() + 600000 }
      );
    } else {
      const generatedOTP = +Math.ceil(Math.random() * Math.pow(10, 10))
        .toString()
        .slice(0, 6);
      otp_key = await generatedOTP;
      console.log(generatedOTP, user_mobile);
      const createdOTPDoc = await OTP.create({
        user_mobile,
        otp: generatedOTP,
      });
    }
    const MESSAGE = `${otp_key} is your foodDo login OTP. dT0A1c4Hq0D - FOODDO`;
    var mobileNo = +`${user_mobile}`.replace("+91", "");
    console.log(MESSAGE, mobileNo);
    if (otp_key && mobileNo)
      msg91.send(
        user_mobile,
        MESSAGE,
        "1307160922320559546",
        function (err, response) {
          if (err) throw err;
          if (response) {
            Details.updateMany({}, { $inc: { sms_count: 1 } }).then((a)=>console.log(a));
            res.json({ success: true, result: value });
          } else res.json({ success: false, message: "User Not created" });
        }
      );
    else res.json({ success: false, message: "User Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});
router.get("/getUsers", async (req, res) => {
  try {
    let data = await Users.find({});

    if (data.length) res.json({ success: true, result: data });
    else res.json({ success: false, message: "User Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});
router.post("/getUser", async (req, res) => {
  console.log(req.body);
  try {
    let { user_uuid } = req.body;
    let data = await Users.findOne({
      $or: [{ user_name: user_uuid }, { user_uuid }],
    });
    // console.log(data, user_name)
    if (data) res.json({ success: true, result: data });
    else res.json({ success: false, message: "User Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.post("/varifyUser", async (req, res) => {
  try {
    let { user_name, otp } = req.body;

    const otpdata = await OTP.findOne({ user_mobile: "+91" + user_name, otp });
    if (!otpdata) {
      res.json({ success: false, message: "OTP NOT VAlID" });
      return;
    }
    let data = await Users.findOne({ user_name });
    console.log(data, user_name);
    await OTP.deleteOne({ user_mobile: "+91" + user_name, otp });
    if (data) res.json({ success: true, result: data });
    else {
      let value = { user_name, user_uuid: uuid() };
      console.log(value);
      let response = await Users.create(value);
      if (response) res.json({ success: true, result: value });
      else res.json({ success: false, message: "User Not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.put("/putUser", async (req, res) => {
  try {
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    value = Object.keys(value)
      .filter((key) => key !== "_id")
      .reduce((obj, key) => {
        obj[key] = value[key];
        return obj;
      }, {});
    const response = await Users.updateOne(
      { user_uuid: value.user_uuid },
      value
    );
    if (response.acknowledged) res.json({ success: true, result: value });
    else res.json({ success: false, message: "user Not updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
