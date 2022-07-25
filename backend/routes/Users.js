const express = require("express");
const Users = require("../models/Users");

const router = express.Router();



router.post("/postUser", async (req, res) => {

    try {
        const value = req.body
        if (!value) res.json({ success: false, message: "Invalid Data" })
        console.log(value)
        const response = await Users.create(value)
        if (response)
            res.json({ success: true, result: response });
        else
            res.json({ success: false, message: "User Not created" });
    } catch (err) {
        res.status(500).json({ success: false, message: err });

    }
})

router.get("/getUsers", async (req, res) => {


    try {

        let data = await Users.find({})





        if (data.length)
            res.json({ success: true, result: data });
        else
            res.json({ success: false, message: "User Not found" });
    } catch (err) {
        res.status(500).json({ success: false, message: err });

    }
})
router.post("/getUser", async (req, res) => {

console.log(req.body)
    try {
        let { user_uuid } = req.body
        let data = await Users.findOne({$or:[{user_name:user_uuid},{user_uuid}] })
        // console.log(data, user_name)
        if (data)
            res.json({ success: true, result: data });
        else
            res.json({ success: false, message: "User Not found" });
    } catch (err) {
        res.status(500).json({ success: false, message: err });

    }
})

router.put("/putUser", async (req, res) => {
    try {

        let value = req.body
        if (!value) res.json({ success: false, message: "Invalid Data" })
        value = Object.keys(value)
            .filter((key) => key !== "_id")
            .reduce((obj, key) => {
                obj[key] = value[key];
                return obj;
            }, {});
        const response = await Users.updateOne({ user_uuid: value.user_uuid }, value)
        if (response.acknowledged)
            res.json({ success: true, result: value });
        else
            res.json({ success: false, message: "user Not updated" });
    } catch (err) {
        res.status(500).json({ success: false, message: err });

    }
})



module.exports = router;
