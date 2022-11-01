const express = require("express");
const router = express.Router();

const Poster = require("../models/Posters");

router.post("/postPosters", async (req, res) => {
  try {
    let value = req.body;

    console.log("value", value);
    const response = await Poster.create(value);
    console.log(response);
    if (response) res.json({ success: true, result: response });
    else res.json({ success: false, message: "Image not updated" });
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.put("/putPoster", async (req, res) => {
  try {
    const value = req.body;
    // console.log(value)
    const result = await Poster.updateOne({ _id: value._id }, value);

    if (result.acknowledged) res.json({ success: true, result: value });
    else res.json({ success: false, message: "Image not updated" });
  } catch (err) {
    res.status(500).json({ err });
  }
});
router.get("/getPoster", async (req, res) => {
  try {
    let time = new Date();
    const response = await Poster.find({ expiry: { $gte: time.getTime() } });
    // console.log(response);
    if (response) res.json({ success: true, result: response });
    else res.json({ success: false, message: "Image not found" });
  } catch (err) {
    res.status(500).json({ err });
  }
});
router.delete("/deletePoster", async (req, res) => {
  try {
    let value = req.body;
    console.log(value)
    let response = [];
    for (let item of value) {
      const responsedata = await Poster.deleteOne({ posters: item.posters });
      if (responsedata.acknowledged) response.push(item);
    }
    console.log(response);
    if (response.length) res.json({ success: true, result: response });
    else res.json({ success: false, message: "Image not found" });
  } catch (err) {
    res.status(500).json({ err });
  }
});

// router.post("/getBaseImages", async (req, res) => {
//   try {
//     const { user_category_uuid } = req.body;
//     let result = [];
//     let response = await Image.find({ img_type: "B" });
//     response = JSON.parse(JSON.stringify(response));
//     if (user_category_uuid.length) {
//       for (let item of response) {
//         if (item.user_category_uuid.length) {
//           console.log(user_category_uuid);
//           if (
//             item.user_category_uuid.filter(
//               (a) => user_category_uuid?.filter((b) => a === b).length
//             ).length
//           )
//             result.push(item);
//         } else result.push(item);
//       }
//     } else result = response;

//     // console.log(response)
//     if (result.length) res.json({ success: true, result });
//     else res.json({ success: false, message: "Image not found" });
//   } catch (err) {
//     res.status(500).json({ err });
//   }
// });
// router.delete("/deleteImages", async (req, res) => {
//   try {
//     const value = req.body;
//     fs.unlink(`./uploads/${value.img_url}`, (err) => {
//       console.log(err);
//     });
//     fs.unlink(
//       `./uploads/${value.img_url.replace("images", "thumbnail")}`,
//       (err) => {
//         console.log(err);
//       }
//     );
//     // console.log(value)
//     const response = await Image.deleteOne({
//       img_url: value.img_url,
//       user: value.user[0],
//     });
//     // console.log(response)
//     if (response.acknowledged)
//       res.json({ success: true, result: "Deleted successfully" });
//     else res.json({ success: false, message: "Image not found" });
//   } catch (err) {
//     res.status(500).json({ err });
//   }
// });
module.exports = router;
