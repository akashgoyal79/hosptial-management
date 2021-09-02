const mongoose = require("mongoose");

const pdChatSchema = mongoose.Schema({
	author : String,
	text : String,
	isSendingReport : {
		type : Boolean,
		default : false
	},
	report : {
		type : mongoose.Schema.Types.ObjectId,
		ref : "Report"
	},
	doctor : {
		type : mongoose.Schema.Types.ObjectId,
		ref : "Doctor"
	}
});

module.exports = mongoose.model("PdChat",pdChatSchema);