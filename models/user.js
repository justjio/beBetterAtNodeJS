//Import mongoose
const mongoose = require('mongoose')

//Schema setup
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        set: function(value) {
            return value.trin.toLowerCase();
        },
        validate: [
            function(email) {
                return (email.match(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i) != null);
            },
            'Invalid email'
        ]
    },
    password: String,
    admin: {
        type: Boolean,
        default: false
    }
});

//Compile to model and export
module.exports = mongoose.model('User', userSchema);