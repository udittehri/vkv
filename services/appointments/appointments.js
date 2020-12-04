const mongoose = require('mongoose');
const messages = require('./../../common/messages');

var schema = new mongoose.Schema({
    
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, messages.USER_ID_REQUIRED],
    },
    appointmentNumber: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    rx: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        enum: [1, 2, 3, 4], // 1-> Pending , 2->Decline, 3-> Completed,
        default: 1
    },

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Appoitments', schema);
