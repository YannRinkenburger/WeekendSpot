const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
	title : String,
	description : String,
	date : Date,
	uhrzeit : String,
	time : String,
	category : [Boolean],
	tickets : [Object],
	organizer : String,
	minimum_age : Number,
	links : [String],
	likes : Number,
	shares : Number,
	location : String,
	street : String
})

module.exports = mongoose.model("Event", eventSchema)