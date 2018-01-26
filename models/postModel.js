'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: {
        type: String
    },
    shortDescription: {
        type: String
    },
    description: {
        type: String
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    updated_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Posts', PostSchema);