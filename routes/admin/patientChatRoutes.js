const express = require("express");
const router  = express.Router();
const User = require("../../models/user");
const Patient = require("../../models/patient");
const PaChat  = require("../../models/paChat");
const Report = require("../../models/report");
const mw = require("../../middleware");

router.get("/patient/chat/:id",(req,res)=>{
	User.findById(req.params.id,(err,user)=>{
		Patient.find({username:user.username}).populate({path:"paChat",
														 model:"PaChat",
														 populate :[{path:"doctorRequest",
																    model : "DoctorRequest"},
																    {path:"report",
																	 model : "Report"}]})
			.exec((error,patients)=>{
			res.render("patient/adminChat",{patient:patients[0],id : req.params.id});
		});
	});
});

router.get("/admin/message/:id",(req,res)=>{
	res.render("patient/adminMessage",{id:req.params.id});
});

router.post("/admin/message/:id",(req,res)=>{
	Patient.findById(req.params.id,(err,patient)=>{
		chat ={
			text: req.body.message
		}
		if(req.user.isPatient)
			{
				chat.author = "Patient";
			}
		else if(req.user.isAdmin)
			{
				chat.author = "Management";
			}
		PaChat.create(chat,(error,newChat)=>{
			patient.paChat.push(newChat);
			patient.save();
			User.find({username:patient.username},(error2,users)=>{
				res.redirect("/patient/chat/"+users[0]._id);
			});
		})
	});
});

router.get("/patients",mw.isAdminLoggedIn,(req,res)=>{
	Patient.find({},(err,patients)=>{
		User.find({isPatient: true},(error,users)=>{
			res.render("admin/allPatients",{patients : patients, users : users});
		});
		
	});
});

router.get("/admin/:id/report/new",(req,res)=>{
	res.render("admin/report",{id:req.params.id});
});

router.post("/admin/:id/report/new",(req,res)=>{
	Report.create(req.body.report,(err,newReport)=>{
		PaChat.create({author:"Management",isSendingReport: true, report:newReport},(error,newChat)=>{
			User.findById(req.params.id,(error2,user)=>{
				Patient.find({username:user.username},(error3,patients)=>{
					patient = patients[0];
					patient.paChat.push(newChat);
					patient.save();
					res.redirect("/patient/chat/"+req.params.id);
				});
			});
		});
	});
});

module.exports = router;