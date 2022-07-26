const express = require("express");
const Image = require("../models/Image");
const Occasion = require("../models/Occasion");
const router = express.Router();
const multer = require("multer");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const v4 = require("uuid");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "thumbnail") cb(null, "./uploads/thumbnail");
    else cb(null, "./uploads/posters");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/postOccasion", async (req, res) => {
  try {
    let value = req.body;
    // value = JSON.parse(value);
    // console.log(value)
    if (!value) res.json({ success: false, message: "Invalid Data" });

    console.log(value);
    const response = await Occasion.create(value);
    if (response) {
      res.json({ success: true, result: response });
    } else res.json({ success: false, message: "Occasion Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.get("/getOccasions/:status", async (req, res) => {
  try {
    const { status } = req.params;
    const response = await Occasion.find(status?{ status }:{});
    if (response) res.json({ success: true, result: response });
    else res.json({ success: false, message: "Occasion Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});
router.post("/getOccasionsUser", async (req, res) => {
  try {
    let { user_category_uuid, user_sub_category_uuid } = req.body;
    user_category_uuid = JSON.parse(user_category_uuid);
    user_sub_category_uuid = JSON.parse(user_sub_category_uuid);
    console.log(user_category_uuid, user_sub_category_uuid);
    let result = [];
    let response = await Image.find({ img_type: "B" });
    response = JSON.parse(JSON.stringify(response));
    if (user_category_uuid?.length) {
      for (let a of response) {
        if (a.user_category_uuid.length) {
          if (
            a.user_category_uuid.filter(
              (a) => user_category_uuid.filter((b) => a === b).length
            ).length
          ) {
            if (
              user_sub_category_uuid?.length &&
              a.user_sub_category_uuid?.length
            ) {
              if (
                a.user_sub_category_uuid.filter(
                  (a) => user_sub_category_uuid.filter((b) => a === b).length
                ).length
              ) {
                result.push(a);
              }
            } else result.push(a);
          }
        } else result.push(a);
      }
    } else result = response;

    let time = new Date();
    let occasion = await Occasion.find({
      status: "1",
      expiry: { $gte: time.getTime() },
    });

    // console.log("images",response)

    occasion = occasion.filter(
      (a) =>
        result?.filter(
          (c) => c.occ_uuid?.filter((b) => a.occ_uuid === b.occ_uuid).length
        ).length
    );

    // console.log("occasion", occasion);
    if (occasion.length) res.json({ success: true, result: occasion });
    else res.json({ success: false, message: "Occasion Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});
router.get("/getOccasion/:occ_uuid", async (req, res) => {
  try {
    let occ_uuid = req.params.occ_uuid;
    const response = await Occasion.findOne({ occ_uuid });
    if (response) res.json({ success: true, result: response });
    else res.json({ success: false, message: "Occasion Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.put("/putOccasion", async (req, res) => {
  try {
    let value = req.body;

    value = Object.keys(value)
      .filter((key) => key !== "_id")
      .reduce((obj, key) => {
        obj[key] = value[key];
        return obj;
      }, {});
    if (!value) res.json({ success: false, message: "Invalid Data" });
    console.log(value);
    const response = await Occasion.updateOne(
      { occ_uuid: value.occ_uuid },
      value
    );

    if (response.acknowledged) {
      res.json({ success: true, result: value });
    } else res.json({ success: false, message: "Occasion Not updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});
router.post(
  "/putOccasionPosters",
  upload.fields([{ name: "posters" }]),
  async (req, res) => {
    try {
      let value = req.body.value;
      console.log(JSON.stringify(req.files));
      value = JSON.parse(value);
      console.log("value", value);
      const response = await Occasion.updateMany(
        { occ_uuid: value.occ_uuid },
        {
          $push: {
            posters: {
              url: `/posters/${
                JSON.parse(JSON.stringify(req.files)).posters[0].originalname
              }`,
              uuid: uuid(),
            },
          },
        }
      );
      console.log(response);
      if (response) res.json({ success: true, result: response });
      else res.json({ success: false, message: "Image not updated" });
    } catch (err) {
      res.status(500).json({ err });
    }
  }
);
router.delete("/deleteOccasions", async (req, res) => {
  try {
    let value = req.body;
    console.log(value);
    // value = JSON.parse(value)

    // if (!value) res.json({ success: false, message: "Invalid Data" })
    fs.unlink(`./uploads/${value.thumbnail_url}`, (err) => {
      console.log(err);
    });

    const response = await Occasion.deleteMany({ occ_uuid: value.occ_uuid });
    console.log(response);
    if (response.acknowledged) {
      res.json({ success: true, result: value });
    } else res.json({ success: false, message: "Occasion Not updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
