const mongoose = require('mongoose')

const UserCategorySchema = new mongoose.Schema({
    user_sub_category_title: {
        type: String,
    },
    user_sub_category_uuid: {
        type: String,
    },
    user_category_uuid: {
        type: String,
    },
})


module.exports = mongoose.model('user_sub_category', UserCategorySchema)