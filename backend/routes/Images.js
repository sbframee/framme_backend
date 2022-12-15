const express = require("express");
const router = express.Router();

const Image = require("../models/Image");
var fs = require("fs"),
  request = require("request");
const Temps = require("../models/Temps");
var download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);

    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

router.post("/postImage", async (req, res) => {
  try {
    let value = req.body;
    console.log(value);

    const response = await Image.create(value);
    console.log(response);
    if (response) res.json({ success: true, result: response });
    else res.json({ success: false, message: "Image not updated" });
  } catch (err) {
    res.status(500).json({ err });
  }
});

router.put("/putImage", async (req, res) => {
  try {
    const value = req.body;
    // console.log(value)
    const result = await Image.updateOne({ _id: value._id }, value);

    if (result.acknowledged) res.json({ success: true, result: value });
    else res.json({ success: false, message: "Image not updated" });
  } catch (err) {
    res.status(500).json({ err });
  }
});
router.get("/getImages", async (req, res) => {
  try {
    const response = await Image.find({});
    // console.log(response)
    if (response) res.json({ success: true, result: response });
    else res.json({ success: false, message: "Image not found" });
  } catch (err) {
    res.status(500).json({ err });
  }
});
router.get("/getAllBaseImages", async (req, res) => {
  try {
    const response = await Image.find({ img_type: "B" });
    // console.log(response)
    if (response) res.json({ success: true, result: response });
    else res.json({ success: false, message: "Image not found" });
  } catch (err) {
    res.status(500).json({ err });
  }
});
router.get("/getAllUIImages", async (req, res) => {
  try {
    const response = await Image.find({ img_type: "UI" });
    // console.log(response)
    if (response) res.json({ success: true, result: response });
    else res.json({ success: false, message: "Image not found" });
  } catch (err) {
    res.status(500).json({ err });
  }
});
router.post("/getBaseImages", async (req, res) => {
  try {
    const { user_category_uuid } = req.body;
    let result = [];
    let response = await Image.find({ img_type: "B" });
    response = JSON.parse(JSON.stringify(response));
    if (user_category_uuid.length) {
      for (let item of response) {
        if (item.user_category_uuid.length) {
          console.log(user_category_uuid);
          if (
            item.user_category_uuid.filter(
              (a) => user_category_uuid?.filter((b) => a === b).length
            ).length
          )
            result.push(item);
        } else result.push(item);
      }
    } else result = response;

    // console.log(response)
    if (result.length) res.json({ success: true, result });
    else res.json({ success: false, message: "Image not found" });
  } catch (err) {
    res.status(500).json({ err });
  }
});
router.get("/getBaseImages/:img_url", async (req, res) => {
  try {
    const { img_url } = req.params;

    let response = await Image.findOne({
      img_url: "https://framme-media.s3.ap-south-1.amazonaws.com/" + img_url,
    });
    response = JSON.parse(JSON.stringify(response));
    if (response) {
      download(
        "https://framme-media.s3.ap-south-1.amazonaws.com/" + img_url,
        "uploads/" + img_url + ".png",
        function () {
          console.log(img_url, new Date().now + 3600000);
          Temps.create({
            img_name: img_url + ".png",
            expire: new Date().getTime() + 3600000,
          });
          res.json({
            success: true,
            result: {
              ...response,
              img_url: img_url + ".png",
            },
          });
        }
      );
      console.log("uploads/" + img_url);
      // setTimeout(() => fs.unlinkSync("uploads/"+img_url), 300000);
    } else res.json({ success: false, message: "Image not found" });
  } catch (err) {
    res.status(500).json({ err });
  }
});
const deleteTempFile = async () => {
  const temps = await Temps.find({});
  for (let item of temps) {
    if (item.expire < new Date().getTime())
      fs.unlinkSync("uploads/" + item.img_name);
  }
};
setTimeout(deleteTempFile, 3600000);

router.delete("/deleteImages", async (req, res) => {
  try {
    const { item, user_uuid = "none" } = req.body;
    let user = item?.user?.filter((a) => a !== user_uuid);
    let response;
    if (user?.length) {
      response = await Image.updateOne({ img_url: item.img_url }, { user });
    } else {
      fs.unlink(`./uploads/${item.img_url}`, (err) => {
        console.log(err);
      });
      fs.unlink(
        `./uploads/${item.img_url.replace("images", "thumbnail")}`,
        (err) => {
          console.log(err);
        }
      );
      console.log(user);
      response = await Image.deleteOne({
        img_url: item.img_url,
        user: item.user[0],
      });
    }
    // console.log(response)
    if (response) res.json({ success: true, result: "Deleted successfully" });
    else res.json({ success: false, message: "Image not found" });
  } catch (err) {
    res.status(500).json({ err });
  }
});
router.delete("/deleteAdminImages", async (req, res) => {
  try {
    const  item  = req.body;

    fs.unlink(`./uploads/${item.img_url}`, (err) => {
      console.log(err);
    });
    fs.unlink(
      `./uploads/${item.img_url.replace("images", "thumbnail")}`,
      (err) => {
        console.log(err);
      }
    );
    console.log(item);
    const response = await Image.deleteOne({
      img_url: item.img_url,
      user: item.user[0],
    });

    // console.log(response)
    if (response) res.json({ success: true, result: "Deleted successfully" });
    else res.json({ success: false, message: "Image not found" });
  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = router;
