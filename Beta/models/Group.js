const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema({
	name : String,
    users : [{ type : String, ref: "User" }],
    created_at : Date,
    created_by : { type : String, ref: "User" }
})

module.exports = mongoose.model("Group", groupSchema)