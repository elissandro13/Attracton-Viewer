const express = require("express");
const app = express();
//const ejsLint = require('ejs-lint');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Attraction = require("./models/attraction");
const Comment   = require("./models/comment");
const Seed = require("./models/seed");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const flash = require("connect-flash");

const   commentsRoutes      =   require("./routes/commentsRoutes"),
        attractionsRoutes   =   require("./routes/attractionsRoutes"),
        indexRoutes         =   require("./routes/indexRoutes");   

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/"));


mongoose.connect("mongodb://localhost/attraViewer",{ useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

app.use(require("express-session")({
    secret: "Once again you are here",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));
passport.deserializeUser(User.deserializeUser());
passport.serializeUser(User.serializeUser());


app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/attractions/:id/comments",commentsRoutes);
app.use("/attractions", attractionsRoutes);
app.use("/",indexRoutes);

// Seed();



app.get("/", function(req, res){
    res.render("landing");
});

app.listen(3000, function(){
    console.log("on air");
});