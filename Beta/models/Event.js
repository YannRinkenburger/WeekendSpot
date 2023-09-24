const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
	title : String,
	description : String,
	date : String,
	uhrzeit : String,
	time : String,
	category : [false, false, false, false],
	tickets : [Object],
	lowestPrice : Number,
	organizer : String,
	minimum_age : Number,
	links : [String],
	location : String,
	street : String
})

module.exports = mongoose.model("Event", eventSchema)