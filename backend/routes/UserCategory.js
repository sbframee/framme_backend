const express = require("express");
const UserCategory = require("../models/UserCategory");

const router = express.Router();



router.post("/postUserCategory", async (req, res) => {

    try {
        const value = req.body
        if (!value) res.json({ success: false, message: "Invalid Data" })
        console.log(value)
        const response = await UserCategory.create(value)
        if (response)
            res.json({ success: true, result: response });
        else
            res.json({ success: false, message: "User Category Not created" });
    } catch (err) {
        res.status(500).json({ success: false, message: err });

    }
})

router.get("/getUserCategory", async (req, res) => {


    try {

        let data = await UserCategory.find({})





        if (data.length)
            res.json({ success: true, result: data });
        else
            res.json({ success: false, message: "User Not found" });
    } catch (err) {
        res.status(500).json({ success: false, message: err });

    }
})



router.put("/putUserCategory", async (req, res) => {
    try {

        let value = req.body
        if (!value) res.json({ success: false, message: "Invalid Data" })
        value = Object.keys(value)
            .filter((key) => key !== "_id")
            .reduce((obj, key) => {
                obj[key] = value[key];
                return obj;
            }, {});
        const response = await UserCategory.updateOne({ user_category_uuid: value.user_category_uuid }, value)
        if (response.acknowledged)
            res.json({ success: true, result: value });
        else
            res.json({ success: false, message: "user Category Not updated" });
    } catch (err) {
        res.status(500).json({ success: false, message: err });

    }
})



module.exports = router;
