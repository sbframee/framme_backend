const express = require("express");
const Category = require("../models/Category");
const Image = require("../models/Image");
const router = express.Router();





router.post("/postCategory", async (req, res) => {
  try {
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });

    console.log(req.body);
    // let Thumbnail_url = req.files?.thumbnail?.length ? `thumbnail/${JSON.parse(JSON.stringify(req.files))?.thumbnail[0]?.originalname}` : "@

    // const response1 = await Image.create({
    //   img_type: "CT",
    //   cat_uuid: value.cat_uuid,
    // });
    // let poster_url=[]
    // for (let i of poster_url) {
    //   await Image.create({
    //     img_type: "C-PO",
    //     cat_uuid: value.cat_uuid,
    //     img_url: i,
    //   });
    // }
    const response = await Category.create({
      ...value,
      // poster_url
    });
    if (response) {
      res.json({ success: true, result: response });
    } else res.json({ success: false, message: "Category Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.get("/getCategories", async (req, res) => {
  try {
    const response = await Category.find({ status: "1" });
    console.log(response)
    if (response) res.json({ success: true, result: response });
    else res.json({ success: false, message: "Category Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.put("/putCategory", async (req, res) => {
  if (req.files) {
    console.log(req.files);
  }
  try {
    let value = req.body;
    // value = JSON.parse(value);
    value = Object.keys(value)
      .filter((key) => key !== "_id")
      .reduce((obj, key) => {
        obj[key] = value[key];
        return obj;
      }, {});
    if (!value) res.json({ success: false, message: "Invalid Data" });
    // let Thumbnail_url = req.files?.thumbnail?.length ? `thumbnail/${JSON.parse(JSON.stringify(req.files))?.thumbnail[0]?.originalname}` : ""
    // let poster_url = req.files.length
    //   ? JSON.parse(JSON.stringify(req.files)).images.map(
    //       (a) => `/images/${a.originalname}`
    //     )
    //   : [];
    // for (let i of poster_url) {
    //   await Image.create({
    //     img_type: "C-PO",
    //     cat_uuid: value.cat_uuid,
    //     img_url: i,
    //   });
    // }

    // const response1 = await Image.updateOne({ cat_uuid: value.cat_uuid },
    //     {  poster_url })
    // value = poster_url.length ? { ...value, $push: { poster_url } } : value;
    console.log(value);
    const response = await Category.updateOne(
      { cat_uuid: value.cat_uuid },
      value
    );

    if (response.acknowledged) {
      res.json({ success: true, result: value });
    } else res.json({ success: false, message: "Category Not updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});
router.delete("/deleteCategory", async (req, res) => {
  try {
    let value = req.body;

    if (!value) res.json({ success: false, message: "Invalid Data" });
    console.log(value);

    // const response1 = await Image.updateOne({ cat_uuid: value.cat_uuid },
    //     {  poster_url })

    const response = await Category.deleteMany({ cat_uuid: value.cat_uuid });

    if (response.acknowledged) {
      res.json({ success: true, result: value });
    } else res.json({ success: false, message: "Category Not updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
