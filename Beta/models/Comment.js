const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
	text : String,
    event : String,
    username : String,
    created_at : Date
})

module.exports = mongoose.model("Comment", commentSchema)