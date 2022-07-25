const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
    user_name: {
        type: String,
    },
    user_title: {
        type: String,
    },
    user_uuid: {
        type: String,

    },
    user_category_uuid: [{
        type: String
    }],
    user_sub_category_uuid: [{
        type: String
    }]
})


module.exports = mongoose.model('users', UsersSchema)