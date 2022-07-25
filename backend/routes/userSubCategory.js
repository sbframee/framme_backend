const express = require("express");
const UserSubCategory = require("../models/userSubCategory");

const router = express.Router();

router.post("/postUserSubCategory", async (req, res) => {
  try {
    const value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    console.log(value);
    const response = await UserSubCategory.create(value);
    if (response) res.json({ success: true, result: response });
    else res.json({ success: false, message: "User Sub Category Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.post("/getUserSubCategory", async (req, res) => {
  try {
    let data = await UserSubCategory.find({
      user_category_uuid: req.body.user_category_uuid,
    });

    if (data.length) res.json({ success: true, result: data });
    else res.json({ success: false, message: "User Sub Category Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});
router.get("/getUserSubCategory", async (req, res) => {
  try {
    let data = await UserSubCategory.find({});

    if (data.length) res.json({ success: true, result: data });
    else res.json({ success: false, message: "User Sub Category Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.put("/putUserSubCategory", async (req, res) => {
  try {
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    value = Object.keys(value)
      .filter((key) => key !== "_id")
      .reduce((obj, key) => {
        obj[key] = value[key];
        return obj;
      }, {});
    const response = await UserSubCategory.updateOne(
      { user_sub_category_uuid: value.user_sub_category_uuid },
      value
    );
    if (response.acknowledged) res.json({ success: true, result: value });
    else res.json({ success: false, message: "user Sub Category Not updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
