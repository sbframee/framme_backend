const express = require("express");
const { v4: uuid } = require("uuid");
const ContactList = require("../models/contact_list");

const router = express.Router();

router.post("/postContactList", async (req, res) => {
  try {
    let value = req.body;
    if (!value) res.json({ success: false, message: "Invalid Data" });

    console.log(req.body);
value={...value,contact_uuid:uuid()}
    const response = await ContactList.create(value);
    if (response) {
      res.json({ success: true, result: response });
    } else res.json({ success: false, message: "Contact Not created" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.get("/getContactList/:user_uuid", async (req, res) => {
  try {
    const response = await ContactList.find({
      user_uuid: req.params.user_uuid,
    });
    console.log(response);
    if (response) res.json({ success: true, result: response });
    else res.json({ success: false, message: "Contact Not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

router.put("/putContactList", async (req, res) => {

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
    const response = await ContactList.updateOne(
      { contact_uuid: value.contact_uuid },
      value
    );

    if (response.acknowledged) {
      res.json({ success: true, result: value });
    } else res.json({ success: false, message: "Contact Not updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});
router.delete("/deleteContactList", async (req, res) => {
  try {
    let value = req.body;

    if (!value) res.json({ success: false, message: "Invalid Data" });
    console.log(value);

    // const response1 = await Image.updateOne({ cat_uuid: value.cat_uuid },
    //     {  poster_url })

    const response = await ContactList.deleteMany({ contact_uuid: value.contact_uuid });

    if (response.acknowledged) {
      res.json({ success: true, result: value });
    } else res.json({ success: false, message: "Contact Not updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
});

module.exports = router;
