const { initial } = require('lodash');
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    _listId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
    }
});

const Task = mongoose.model('Task', taskSchema)
module.exports = { Task }