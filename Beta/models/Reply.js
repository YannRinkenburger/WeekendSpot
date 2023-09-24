const mongoose = require("mongoose")

const replySchema = new mongoose.Schema({
	text : String,
    username : String,
    commentId : String,
    created_at : Date
})

module.exports = mongoose.model("Reply", replySchema)