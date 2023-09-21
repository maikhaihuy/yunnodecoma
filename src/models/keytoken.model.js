'use strict'

const { Schema, Types, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({
    user:{
        type: Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey:{
        type: String,
        required: true,
    },
    privateKey:{
        type: String,
        required: true,
    },
    refreshTokensUsed:{
        type: Array,
        default: [],
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
  colletion: COLLECTION_NAME,
  timestamps: true,
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);