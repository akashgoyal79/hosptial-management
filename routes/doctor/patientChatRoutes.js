const express = require("express");
const router  = express.Router();
const Patient = require("../../models/patient");
const PdChat  = require("../../models/pdChat");
const Doctor  = require("../../models/doctor");
const Report  = require("../../models/report");
const mw      = require("../../middleware");

router.get("/doctor/:did/patient/:pid",(req,res)=>{
	
	Patient.findById(req.params.pid).populate({path:"pdChat",
											   model:"PdChat",
											   populate : {path:"report",
														   model : "Report"}}).exec((err,patient)=>{
		let pdchat = patient.pdChat.filter((dchat)=>{
			return dchat.doctor == req.params.did;
		});
		
		res.render("patient/doctorChat",{did:req.params.did, pid:req.params.pid, chats:pdchat});
	});
	
});

router.get("/doctor/:did/patient/:pid/message",(req,res)=>{
	res.render("patient/doctorMessage",{did:req.params.did, pid:req.params.pid});
});

router.get("/doctor/:did/patient/:pid/report",(req,res)=>{
	res.render("patient/report",{did:req.params.did, pid:req.params.pid});
});

router.post("/doctor/:did/patient/:pid/report",(req,res)=>{
	Patient.findById(req.params.pid,(err,patient)=>{
		Doctor.findById(req.params.did,(error,doctor)=>{
		Report.create(req.body.report,(error2,newReport)=>{
		PdChat.create({author:"Patient",isSendingReport:true,report: newReport, doctor:doctor},(error3,newChat)=>{
			patient.pdChat.push(newChat);
			patient.save();
			res.redirect("/doctor/"+req.params.did+"/patient/"+req.params.pid);
		});
			});
		});
	});	
});

router.post("/doctor/:did/patient/:pid/message",(req,res)=>{
	Patient.findById(req.params.pid,(err,patient)=>{
		Doctor.findById(req.params.did,(error,doctor)=>{
			chat = {
				text : req.body.message
			}
			if(req.user.isPatient)
				{
					chat.author="Patient";
				}
			else if(req.user.isDoctor)
				{
					chat.author="Doctor";
				}
			PdChat.create({author:chat.author,text:chat.text, doctor:doctor},(error2,newChat)=>{
				patient.pdChat.push(newChat);
				patient.save();
				res.redirect("/doctor/"+req.params.did+"/patient/"+req.params.pid);
			});
		});
	});
});

module.exports = router;