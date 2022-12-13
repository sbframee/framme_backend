const express = require("express");
const Image = require("../models/Image");
const Tags = require("../models/Tags");
const router = express.Router();
const multer = require("multer");
const Users = require("../models/Users");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

router.post("/tagImages", upload.single("images"), async (req, res) => {
  try {
    let value = req.body;

    if (!value) res.json({ success: false, message: "Invalid Data" });
    // value = JSON.parse(value)
    // console.log(req.body)
    // let Thumbnail_url = req.files?.thumbnail?.length ? `thumbnail/${JSON.parse(JSON.stringify(req.files))?.thumbnail[0]?.originalname}` : "@

    // value = req.file ? { ...value, img_url: `/images/${req.file.originalname}` } : value
    let data = await Image.find({
      tag_uuid: value.tag_uuid,
      sort_order: value.sort_order,
    });
    let response;
    if (data.length) {
      response = await Image.updateOne(
        { tag_uuid: value.tag_uuid, sort_order: value.sort_order },
        value
      );
    } else {
      response = await Image.create(value);
    }
    if (response) {
      res.json({ success: true, result: response });
    } else res.json({ success: false, message: "Category Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});
router.post("/tagText", async (req, res) => {
  try {
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    value = Object.keys(value)
      .filter((key) => key !== "_id")
      .reduce((obj, key) => {
        obj[key] = value[key];
        return obj;
      }, {});
    // value = JSON.parse(value)
    // console.log(req.body)
    // let Thumbnail_url = req.files?.thumbnail?.length ? `thumbnail/${JSON.parse(JSON.stringify(req.files))?.thumbnail[0]?.originalname}` : "@
    console.log(value);
    // value = req.file ? { ...value, img_url: `/images/${req.file.originalname}` } : value
    let data = await Image.find({
      tag_uuid: value.tag_uuid,
      user: value.user[0],
      sort_order: value.sort_order,
    });
    let response;
    if (data.length) {
      response = await Image.updateOne(
        { tag_uuid: value.tag_uuid, sort_order: value.sort_order },
        value
      );
    } else {
      response = await Image.create(value);
    }
    if (response) {
      res.json({ success: true, result: response });
    } else res.json({ success: false, message: "Category Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.post("/postTags", async (req, res) => {
  try {
    const value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    console.log(value);
    const response = await Tags.create(value);
    if (response) res.json({ success: true, result: response });
    else res.json({ success: false, message: "Tags Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.get("/getTags", async (req, res) => {
  try {
    let TagsData = await Tags.find({});
    console.log(TagsData);
    TagsData = JSON.parse(JSON.stringify(TagsData));

    let data = [];
    for (let i of TagsData) {
      let response = await Image.findOne({ tag_uuid: i.tag_uuid });
      response = JSON.parse(JSON.stringify(response));
      data.push({ ...i, ...(response || {}) });
    }

    if (data.length) res.json({ success: true, result: data });
    else res.json({ success: false, message: "Tags Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});
router.post("/getUserTags", async (req, res) => {
  try {
    const { user_uuid } = req.body;
    let userData = await Users.findOne({ user_uuid });
 
    let TagsData = await Tags.find(
      userData?.tags?.length ? { tag_uuid: { $in: userData.tags } } : {}
      );
  
    TagsData = JSON.parse(JSON.stringify(TagsData));
    let data = [];
    for (let i of TagsData) {
      let response = await Image.find({
        tag_uuid: i.tag_uuid,
        user: user_uuid,
      });
      response = JSON.parse(JSON.stringify(response));
      console.log(response);
      if (response[0]?.text) {
        data.push({ ...i, text: response });
      } else if (response[0]?.img_url) {
        data.push({ ...i, img_url: response });
      } else {
        data.push({ ...i, text: [], img_url: [] });
      }
    }

    if (data.length) res.json({ success: true, result: data });
    else res.json({ success: false, message: "Tags Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.put("/putTags", async (req, res) => {
  try {
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    value = Object.keys(value)
      .filter((key) => key !== "_id")
      .reduce((obj, key) => {
        obj[key] = value[key];
        return obj;
      }, {});
    console.log(value);
    const response = await Tags.updateOne({ tag_uuid: value.tag_uuid }, value);
    if (response.acknowledged) res.json({ success: true, result: value });
    else res.json({ success: false, message: "Tags Not updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});
router.delete("/deleteTags", async (req, res) => {
  try {
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });
    value = Object.keys(value)
      .filter((key) => key !== "_id")
      .reduce((obj, key) => {
        obj[key] = value[key];
        return obj;
      }, {});
    console.log(value);
    const response = await Tags.deleteOne({ tag_uuid: value.tag_uuid });
    if (response.acknowledged) res.json({ success: true, result: value });
    else res.json({ success: false, message: "Tags Not updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
