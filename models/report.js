const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
	problem : String,
	reportTitle : String,
	reportLink : String
});

module.exports = mongoose.model("Report",reportSchema);