const express = require("express");
const router = express.Router();
const passport = require("passport");
const Patient = require("../../models/patient");
const User = require("../../models/user");
const mw = require("../../middleware");

router.get("/patient/register",(req,res)=>{
	res.render("patient/register");
});

router.post("/patient/register",(req,res)=>{
	const patient = req.body.patient;
	User.register({username:patient.username, isPatient: true},req.body.password,(err,user)=>{
		if(err){
			console.log(err);
			res.redirect("/patient/register");
		}
		else{
			console.log("patient registered");
			Patient.create(patient,(error,newPatient)=>{
				if(error){
					console.log(error);
					res.redirect("/patient/register");
				}
				else{
					console.log("A new patient is added to database");
				}
			});
			res.render("patient/login");
		}
	});
});

router.get("/patient/login",(req,res)=>{
	res.render("patient/login");
});

router.post("/patient/login",passport.authenticate("local",{
	failureRedirect : "/patient/login",
	successRedirect : "/patient/doctors"
}),(req,res)=>{
	console.log("success");
});

router.get("/patient/doctors",mw.isPatientLoggedIn,(req,res)=>{
	Patient.find({username : req.user.username}).populate("doctors").exec((err,patients)=>{
		res.render("patient/patient",{doctors:patients[0].doctors,patient:patients[0]});
	});
});

router.get("/logout",(req,res)=>{
	req.logout();
	res.redirect("/");
});

router.get("/patient/register/edit",mw.isPatientLoggedIn,(req,res)=>{
	Patient.find({username : req.user.username},(err,patients)=>{
		patient=patients[0];
		if(err){
			console.log(err);
			res.redirect("/patient/doctors");
		}
		else{
			res.render("patient/edit",{patient:patient});
		}
	});
});

router.put("/patient/register/edit",mw.isPatientLoggedIn,(req,res)=>{
	Patient.findOneAndUpdate({username : req.user.username},req.body.patient,(err,patient)=>{
		if(err){
			console.log(err);
			res.redirect("/patient/register/edit");
		}
		else{
			console.log("patient successfully updated");
			res.redirect("/patient/doctors");
		}
	});
});

module.exports= router;