const mongoose = require('mongoose')

const holder_template = new mongoose.Schema({
    ht_uuid: {
        type: String,

    },
    ht_title: {
        type: String,

    },

    holder: [{
        text_color: {
            type: String,

        },
        label_uuid: { type: String },
        a: { type: String },
        b: { type: String },
        c: { type: String },
        d: { type: String },
    }],
 
})


module.exports = mongoose.model('holder_templates', holder_template)