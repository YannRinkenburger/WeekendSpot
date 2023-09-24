const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
	event : String,
	username : String
})

module.exports = mongoose.model("Post", postSchema)