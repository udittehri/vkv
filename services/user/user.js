const mongoose = require('mongoose');
const messages = require('./../../common/messages');

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    role: {
        type: Number,
        enum: [1, 2, 3], // 1-> Doctor , 2->Assitant, 3-> Patient
        default: 3
    },
    status: {
        type: Number,
        enum: [1, 2, 3, 4], // 1-> Active , 2->Inactive, 3-> Blocked, 4-> Left Organisation
        default: 1
    },
    
    password_reset_token: String,

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('User', schema);
