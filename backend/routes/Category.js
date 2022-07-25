const express = require("express");
const Category = require("../models/Category");
const Image = require("../models/Image");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {


        cb(null, "./uploads/images");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});


const upload = multer({ storage });
var multipleUpload = upload.fields([{ name: 'images', maxCount: 10 }])
router.post("/postCategory", multipleUpload, async (req, res) => {
    console.log(req.files.thumbnail)
    try {
        let value = req.body.value
        if (!value) res.json({ success: false, message: "Invalid Data" })
        value = JSON.parse(value)
        // console.log(req.body)
        // let Thumbnail_url = req.files?.thumbnail?.length ? `thumbnail/${JSON.parse(JSON.stringify(req.files))?.thumbnail[0]?.originalname}` : "@

        let poster_url = JSON.parse(JSON.stringify(req.files))?.images?.map(a => `/images/${a?.originalname}`) || []
        const response1 = await Image.create({ img_type: "CT", cat_uuid: value.cat_uuid })
        for (let i of poster_url) {
            await Image.create({ img_type: "C-PO", cat_uuid: value.cat_uuid, img_url: i })

        }
        const response = await Category.create({ ...value, poster_url })
        if (response) {
            res.json({ success: true, result: response });
        }
        else
            res.json({ success: false, message: "Category Not created" });
    } catch (err) {
        res.status(500).json({ success: false, message: err });

    }
})

router.get("/getCategories", async (req, res) => {
    try {

        const response = await Category.find({ status: "1" })
        if (response)
            res.json({ success: true, result: response });
        else
            res.json({ success: false, message: "Category Not found" });
    } catch (err) {
        res.status(500).json({ success: false, message: err });

    }
})

router.put("/putCategory", multipleUpload, async (req, res) => {
    if (req.files) {
        console.log(req.files)
    }
    try {

        let value = req.body.value
        value = JSON.parse(value)
        value = Object.keys(value)
            .filter((key) => key !== "_id")
            .reduce((obj, key) => {
                obj[key] = value[key];
                return obj;
            }, {});
        if (!value) res.json({ success: false, message: "Invalid Data" })
        // let Thumbnail_url = req.files?.thumbnail?.length ? `thumbnail/${JSON.parse(JSON.stringify(req.files))?.thumbnail[0]?.originalname}` : ""
        let poster_url = req.files.length ? JSON.parse(JSON.stringify(req.files)).images.map(a => `/images/${a.originalname}`) : []
        for (let i of poster_url) {
            await Image.create({ img_type: "C-PO", cat_uuid: value.cat_uuid, img_url: i })

        }

        // const response1 = await Image.updateOne({ cat_uuid: value.cat_uuid },
        //     {  poster_url })
        value = poster_url.length ? { ...value, $push: { poster_url } } : value
        console.log(value)
        const response = await Category.updateOne({ cat_uuid: value.cat_uuid }, value)

        if (response.acknowledged) {

            res.json({ success: true, result: value });
        }
        else
            res.json({ success: false, message: "Category Not updated" });
    } catch (err) {
        res.status(500).json({ success: false, message: err });

    }
})
router.delete("/deleteCategory", async (req, res) => {

    try {

        let value = req.body
        
        if (!value) res.json({ success: false, message: "Invalid Data" })
console.log(value)

        // const response1 = await Image.updateOne({ cat_uuid: value.cat_uuid },
        //     {  poster_url })

        const response = await Category.deleteMany({ cat_uuid: value.cat_uuid })

        if (response.acknowledged) {

            res.json({ success: true, result: value });
        }
        else
            res.json({ success: false, message: "Category Not updated" });
    } catch (err) {
        res.status(500).json({ success: false, message: err });

    }
})



module.exports = router;
