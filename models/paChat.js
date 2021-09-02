const mongoose = require("mongoose");

const paChatSchema = mongoose.Schema({
	author : String,
	text : String,
	isRequestingDoctor : {
		type : Boolean,
		default : false
	},
	doctorRequest : {
		type : mongoose.Schema.Types.ObjectId,
		ref : "DoctorRequest"
	},
	isSendingReport : {
		type : Boolean,
		default : false
	},
	report : {
		type : mongoose.Schema.Types.ObjectId,
		ref : "Report"
	}
});

module.exports = mongoose.model("PaChat",paChatSchema);