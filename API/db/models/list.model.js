const mongoose = require('mongoose')
const Schema = mongoose.Schema

const listSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    _userId: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

const List = mongoose.model('List', listSchema)
module.exports = { List }