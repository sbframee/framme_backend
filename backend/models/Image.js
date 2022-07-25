const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    img_url: {
        type: String,

    },
    img_type: {
        type: String,

    },
    user_category_uuid: [{ type: String }],
    user_sub_category_uuid: [{ type: String }],
    occ_uuid: [{
        occ_uuid: { type: String }, sort_order: { type: String }
    }],
    sort_order: { type: String },
    coordinates: [{
        base_img_url: { type: String },
        a: { type: String },
        b: { type: String },
        c: { type: String },
        d: { type: String },
    }],
    user: [{ type: String }],
    holder: [{
        text_color: {
            type: String,

        },
        fontFamily: {
            type: String,

        },
        label_uuid: { type: String },
        a: { type: String },
        b: { type: String },
        c: { type: String },
        d: { type: String },
    }],
    cat_uuid: { type: String },
    tag_uuid: { type: String },
    text: { type: String },
})


module.exports = mongoose.model('images', imageSchema)