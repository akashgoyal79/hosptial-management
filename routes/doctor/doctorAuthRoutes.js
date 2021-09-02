const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../../models/user");
const Doctor = require("../../models/doctor");
const mw = require("../../middleware");

router.get("/doctor/login",(req,res)=>{
	res.render("doctor/login");
});

router.post("/doctor/login",passport.authenticate("local",{
	failureRedirect : "/doctor/login",
	successRedirect : "/doctor/patients"
}),(req,res)=>{});

router.get("/doctor/patients",mw.isDoctorLoggedIn,(req,res)=>{
	Doctor.find({username:req.user.username}).populate("patients").exec((err,doctors)=>{
		res.render("doctor/doctor",{patients:doctors[0].patients,doctor:doctors[0]});
	});
});

router.get("/doctor/register/view",mw.isDoctorLoggedIn,(req,res)=>{
	Doctor.findOne({username : req.user.username},(err,doctor)=>{
		if(err){
			console.log(err);
		}
		else{
			res.render("doctor/view",{doctor:doctor});
		}
	});
});

module.exports = router;