const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../../models/user");
const Doctor = require("../../models/doctor");
const mw = require("../../middleware");

// User.register({username : "admin@healthcare.com",isAdmin:true},"admin",(err,admin)=>{
// 	if(err){
// 		console.log(err);
// 	}
// 	else{
// 		console.log(admin);
// 	}
// });

router.get("/admin/login",(req,res)=>{
	res.render("admin/login");
});

router.post("/admin/login",passport.authenticate("local",{
	failureRedirect : "/admin/login",
	successRedirect : "/admin"
}),(req,res)=>{});

router.get("/admin",mw.isAdminLoggedIn,(req,res)=>{
	res.render("admin/admin");
});

router.get("/doctor/register",mw.isAdminLoggedIn,(req,res)=>{
	res.render("doctor/register");
});

router.post("/doctor/register",mw.isAdminLoggedIn,(req,res)=>{
	const doctor = req.body.doctor;
	User.register({username:doctor.username,isDoctor : true},req.body.password,(err,user)=>{
		if(err){
			console.log(err);
			res.redirect("/doctor/register");
		}
		else{
			console.log("Doctor registered");
			Doctor.create(doctor,(error,newDoctor)=>{
				if(error){
					console.log(error);
					res.redirect("/doctor/register");
				}
				else{
					console.log("A new doctor is added to database");
				}
			});
			res.redirect("/admin");
		}
	});
});

router.get("/doctors",mw.isAdminLoggedIn,(req,res)=>{
	Doctor.find({},(err,doctors)=>{
		res.render("admin/allDoctors",{doctors : doctors});
	});
});

router.get("/doctors/:id/register/edit",mw.isAdminLoggedIn,(req,res)=>{
	Doctor.findById(req.params.id,(err,doctor)=>{
		if(err){
			console.log(err);
		}
		else{
			res.render("doctor/edit",{doctor : doctor});
		}
	});
});

router.put("/doctors/:id/register/edit",mw.isAdminLoggedIn,(req,res)=>{
	Doctor.findByIdAndUpdate(req.params.id,req.body.doctor,(err,doctor)=>{
		if(err){
			console.log(err);
		}
		else{
			console.log("Doctor successfully updated");
			res.redirect("/doctors");
		}
	})
});

router.delete("/doctors/:id",mw.isAdminLoggedIn,(req,res)=>{
	Doctor.findByIdAndRemove(req.params.id,(err,doctor)=>{
		if(err){
			console.log(err);
		}
		else{
			console.log("Doctor removed");
			User.findOneAndRemove({username : doctor.username},(error,user)=>{
				if(error){
					console.log(error);
				}
				else{
					console.log("User Deleted");
					res.redirect("/doctors");
				}
			});
		}
	});
});

module.exports = router;