const express             = require("express");
const app                 = express();
const bodyParser          = require("body-parser");
const mongoose            = require("mongoose");
const passport            = require("passport");
const LocalStrategy       = require("passport-local");
const methodOverride      = require("method-override");
const patientAuthRoutes   = require("./routes/patient/patientAuthRoutes");
const requestDoctorRoutes = require("./routes/patient/requestDoctorRoutes");
const adminAuthRoutes     = require("./routes/admin/adminAuthRoutes");
const allocationRoutes    = require("./routes/admin/allocationRoutes");
const adminPatientRoutes  = require("./routes/admin/patientChatRoutes");
const doctorPatientRoutes = require("./routes/doctor/patientChatRoutes");
const doctorAuthRoutes    = require("./routes/doctor/doctorAuthRoutes");
const User                = require("./models/user");

mongoose.connect("mongodb://localhost/dbms");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
	secret : "abcd",
	resave : false,
	saveUninitialized : false 
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});

app.get("/",(req,res)=>{
	res.render("home");
});

app.use(patientAuthRoutes);
app.use(adminAuthRoutes);
app.use(doctorAuthRoutes);
app.use(requestDoctorRoutes);
app.use(allocationRoutes);
app.use(adminPatientRoutes);
app.use(doctorPatientRoutes);


app.listen(3000,() => console.log("server started") );