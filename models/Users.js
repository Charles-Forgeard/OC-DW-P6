const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    //_id: String / est automatiquement généré par mongoDB.
    email: {type: String, required: true, index: true, unique: true},
    password: {type: String, required: true},
    locked: {type: Number, default: 0}
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Users', userSchema);