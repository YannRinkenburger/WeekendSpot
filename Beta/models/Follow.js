const mongoose = require("mongoose")

const followSchema = new mongoose.Schema({
	fromUser : String,
	toUser : String,
	confirmed : Boolean
})

module.exports = mongoose.model("Follow", followSchema)