const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
	text : String,
    user : String,
    group : String,
    created_at : Date,
    is_share : Boolean
})

module.exports = mongoose.model("Message", messageSchema)