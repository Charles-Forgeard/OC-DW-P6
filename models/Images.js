const mongoose = require('mongoose');

const imgSchema = mongoose.Schema({
    name: {type: String, required: true, index: true},
    img:
    {
        data: Buffer,
        contentType: String
    }
})

module.exports = mongoose.model('Images', imgSchema);