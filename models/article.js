//Import mongoose
const mongoose = require('mongoose');

//Set up articleSchema
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        validate: [
            function(value) {
                return value.length <= 120
            },
            'Title is too long (120 max)'
        ],
        default: 'New Post'
    },
    text: String,
    published: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        set: function(value) {
            return value.toLowerCase().replace(' ', '-')
        }
    }
});

//Static -  an abstraction of the find method in routes/article.js
articleSchema.static({
    list: function(callback) {
        this.find({}, null, {sort: {_id: -1}}, callback);
    }
})

//Compile all above into a model
module.exports = mongoose.model('Article', articleSchema);