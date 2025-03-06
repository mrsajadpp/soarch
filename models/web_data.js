const mongoose = require('mongoose');

const webDataSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    origin: {
        type: String,
        required: [true, 'Oirigin is required'],
        trim: true
    },
    url: {
        type: String,
        required: [true, 'URL is required'],
        trim: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('WebData', webDataSchema);
