const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema({
	username : String, //username is email
	gender : String,
	fname : String,
	lname : String,
	patients : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : "Patient"	
	    }
		],
	specialization : String
});

module.exports = mongoose.model("Doctor",doctorSchema);

