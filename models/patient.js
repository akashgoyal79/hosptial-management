const mongoose = require("mongoose");

const patientSchema = mongoose.Schema({
	fname : String,
	lname : String,
	username : String, // username is email
	gender : String,
	age : String,
	address : String,
	pincode : Number,
	doctors : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : "Doctor"
		}
	],
	paChat : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : "PaChat"
		}
	],
	pdChat : [
		{
			type : mongoose.Schema.Types.ObjectId,
			ref : "PdChat"
		}
	]
});



module.exports = mongoose.model("Patient",patientSchema);