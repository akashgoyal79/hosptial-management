const mw = {};

mw.isPatientLoggedIn = function(req,res,next){
	if(req.user && req.user.isPatient){
		return next();
	}
	if(req.user && !req.user.isPatient){
		req.logout();
	}
	console.log("login as a patient first");
	res.redirect("/patient/login");
};

mw.isDoctorLoggedIn = function(req,res,next){
    if(req.user && req.user.isDoctor){
		return next();
	}
	if(req.user && !req.user.isDoctor){
		req.logout();
	}
	console.log("login as a doctor first");
	res.redirect("/doctor/login");
};

mw.isAdminLoggedIn = function(req,res,next){
    if(req.user && req.user.isAdmin){
		return next();
	}
	if(req.user && !req.user.isAdmin){
		req.logout();
	}
	console.log("login as an admin first");
	res.redirect("/admin/login");
};

module.exports = mw;