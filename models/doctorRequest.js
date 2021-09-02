const mongoose = require("mongoose");

const doctorRequestSchema = mongoose.Schema({
	fname : String,
	lname : String,
	email : String,
	age   : String,
	gender : String,
	problem : String
});

module.exports = mongoose.model("DoctorRequest",doctorRequestSchema);