const mongoose = require("mongoose")

const authCodeSchema = new mongoose.Schema({
	code : Number,
    email : String,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600,
    }
})

module.exports = mongoose.model("AuthCode", authCodeSchema)