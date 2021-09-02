const express = require("express");
const router = express.Router();
const Patient = require("../../models/patient");
const Doctor = require("../../models/doctor");
const PaChat  = require("../../models/paChat");
const mw = require("../../middleware");

router.get("/allocate/:id/:pid",mw.isAdminLoggedIn,(req,res)=>{
	Doctor.find({},(err,doctors)=>{
		res.render("admin/allocate",{doctors:doctors,id:req.params.id,pid:req.params.pid});
	});
});

router.post("/:id/patient/:pid/allocate/doctor/:did",mw.isAdminLoggedIn,(req,res)=>{
	Patient.findById(req.params.pid,(err,patient)=>{
		if(err)
			{
				console.log(err);
			}
		else
			{
				Doctor.findById(req.params.did,(error,doctor)=>{
					if(error)
						{
							console.log(error);
						}
					else
						{
							doctor.patients.push(patient);
							doctor.save();
							console.log("patient allocated to doctor");
							PaChat.create({author: "Management",text:"Dr "+doctor.fname + " "+doctor.lname+" has been alloted to you. Discuss your problem with the allocated doctor"},(error2,newChat)=>{
								patient.doctors.push(doctor);
								patient.paChat.push(newChat);
								patient.save();
								console.log("doctor allocated to patient");
								res.redirect("/patient/chat/"+req.params.id);
							});
						}
				});
			}
	});
});

module.exports = router;