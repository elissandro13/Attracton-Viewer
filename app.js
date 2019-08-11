const express = require("express");
const app = express();
const ejsLint = require('ejs-lint');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Attraction = require("./models/attraction");
const Comment   = require("./models/comment");
const Seed = require("./models/seed");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/"));

mongoose.connect("mongodb://localhost/attraViewer",{ useNewUrlParser: true });

Seed();

//Passport 
app.use(require("express-session")({
    secret: "Once again you are here",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.deserializeUser(User.deserializeUser());
passport.serializeUser(User.serializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res){
    res.render("landing");
});

// index  route
app.get("/attractions", function(req,res) {
    Attraction.find({}, function(err, allAttractions){
        if(err){
            console.log(err);
        }
        else {
            res.render("attractions/index", {attractions:allAttractions});
        }
    });
});
// create route 
app.post("/attractions", function(req, res){
    let name = req.body.name;
    //console.log(req.body.name);
    let img = req.body.img;
    let text = req.body.description;
    let newAttraction = {name : name,img : img, text : text};
    console.log(newAttraction);
    Attraction.create(newAttraction, function(err, newCreated)
    {
        if(err) {
            console.log(err);
        }
        else {
            //console.log(newCreated);
            res.redirect("/attractions");
        }
    });
});

// new route
 
app.get("/attractions/new", function(req, res){
    res.render("attractions/new.ejs");
});

//Show route

app.get("/attractions/:id", function(req,res){

    Attraction.findById(req.params.id).populate("comments").exec(function(err, foundAttraction){
        if(err){
            console.log(err);
        }
        else {
            res.render("attractions/show", {place: foundAttraction});
        }
    });
});

// Comments Route

app.get("/attractions/:id/comments/new",isLoggedIn,function(req,res){
    Attraction.findById(req.params.id, function(err, attractions){
        if(err){
            console.log(err);
        }
        else {
            res.render("comments/new.ejs", {place: attractions});
        }
    });   
});

app.post("/attractions/:id/comments",isLoggedIn,function(req,res){
    Attraction.findById(req.params.id, function(err, attraction){
        if(err){
            console.log(err);
            res.redirect("/attractions");
        }
        else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }
                else {
                    attraction.comments.push(comment);
                    attraction.save();
                    res.redirect('/attractions/' + attraction._id);
                }
            });
        }
    });
});
//Authentication
app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    let newUser = new User({username : req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/attractions");
        });
    });
});

app.get("/login", function(req,res){
    res.render("login");
});

app.post("/login", passport.authenticate("local",{
    successRedirect: "/attractions",
    failureRedirect: "/login"
    }),  function(req,res){
});

app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/attractions");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.listen(3000, function(){
    console.log("on air");
});