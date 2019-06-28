var mongoose = require("mongoose")

// Check  this  out later
// var sanitize = require("mongo-sanitize");

var MAus_Schema = new mongoose.Schema({
    applicationUrl: String,
    customProperty: String,
    application: String,
    language:  String,
    tenantId: String,
    businessSegmentName: String,
    userSsoId: String,
    category: String,
    comments: {
        trim: true,
        type: String
    },
    ratingContent: Number,
    ratingUsability: Number,
    ratingOverall: Number,
    visitingReason: String,
    recommend: String,
    emailAddress: {
        trim: true,
        type: String
    },
    feedbackContact: String,
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("MAusSchema", MAus_Schema)