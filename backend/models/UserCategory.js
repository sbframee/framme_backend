const mongoose = require('mongoose')

const UserCategorySchema = new mongoose.Schema({
    user_category_title: {
        type: String,
    },
    user_category_uuid: {
        type: String,
    },
})


module.exports = mongoose.model('user_category', UserCategorySchema)