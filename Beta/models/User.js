const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
	firstname: String,
	lastname: String,
	username : String,
	email: {
		type : String,
		required : true,
		lowercase : true
	},
	password: String,
	friends: [{ type : String, ref: "User" }],
	year : Number,
	participations : Number,
	is_creator : Boolean
})

module.exports = mongoose.model("User", userSchema)