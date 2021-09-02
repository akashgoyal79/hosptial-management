const express = require("express");
const router  = express.Router();
const Patient = require("../../models/patient");
const PaChat = require("../../models/paChat");
const DoctorRequest = require("../../models/doctorRequest");
const mw = require("../../middleware");

router.get("/request/doctor",mw.isPatientLoggedIn,(req,res)=>{
	res.render("patient/requestDoctor");
});

router.post("/request/doctor",mw.isPatientLoggedIn,(req,res)=>{
	Patient.find({username:req.body.username},(err,patients)=>{
		if(err)
			{
				console.log(err);
				console.log("Error in finding patient for request Doctor")
				res.render("/request/doctor");
			}
		else
			{
				patient = patients[0];
				symptom = {fname: patient.fname, 
						   lname: patient.lname, 
						   email: patient.username, 
						   age: patient.age,
						   gender : patient.gender,
						   problem : req.body.problem};
				DoctorRequest.create(symptom,(error,request)=>{
					if(error)
						{
							console.log(error);
						}
					else
						{
						PaChat.create({author:"patient",
									   isRequestingDoctor:true,doctorRequest:request},(error2,chat)=>{
							if(error2)
								{
									console.log(error2);
								}
							else
								{
									patient.paChat.push(chat);
									patient.save();
									console.log("Chat added");
									res.redirect("/patient/chat/"+req.user._id);
								}
						});
						}
				})
			}
	});
});

module.exports = router;