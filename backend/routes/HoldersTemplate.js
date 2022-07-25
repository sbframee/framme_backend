const express = require("express");
const HolderTemplate = require("../models/HolderTemplate");
const router = express.Router();

router.post("/postHolderTemplate",   async (req, res) => {

    try {
        let value = req.body
        // console.log(req.body)
        // value = JSON.parse(value)
        // console.log("value", value)
        const response = await HolderTemplate.create( value )
        // console.log(response)
        if (response)
            res.json({ success: true, result: response });
        else
            res.json({ success: false, message: "Image not updated" });
    } catch (err) {
        res.status(500).json({ err })
    }
})
router.get("/getHolderTemplate",   async (req, res) => {

    try {
   
        const response = await HolderTemplate.find( {} )
        console.log(response)
        if (response)
            res.json({ success: true, result: response });
        else
            res.json({ success: false, message: "Image not found" });
    } catch (err) {
        res.status(500).json({ err })
    }
})
module.exports = router;