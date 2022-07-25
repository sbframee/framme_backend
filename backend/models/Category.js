const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
    },
    sort_order: {
        type: String,

    },
    cat_uuid: {
        type: String,

    },
    status: {
        type: String,
    },
    Thumbnail_url:{
        type: String,

    },
    poster_url:[{
        type: String,

    }]

})


module.exports = mongoose.model('category', CategorySchema)