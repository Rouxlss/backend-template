const { Schema, model } = require('mongoose');

const codeSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    status : {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model('Code', codeSchema);