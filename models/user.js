const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = mongoose.Schema({
	username : String,
	password : String,
	isPatient : {
		type : Boolean,
		default : false
	},
	isDoctor : {
		type : Boolean,
		default : false
	},
	isAdmin : {
		type : Boolean,
		default : false
	}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);

