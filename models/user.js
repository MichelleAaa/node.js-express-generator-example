const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true //No duplicate usernames allowed
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false //By default, when a new user document is created admin will be set to false.
    }
});

module.exports = mongoose.model('User', userSchema);