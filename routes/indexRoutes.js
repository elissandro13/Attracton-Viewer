const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

//Authentication
router.get("/register", function(req,res){
    res.render("register");
});

router.post("/register", function(req,res){
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

router.get("/login", function(req,res){
    res.render("login");
});

router.post("/login", passport.authenticate("local",{
    successRedirect: "/attractions",
    failureRedirect: "/login"
    }),  function(req,res){
});

router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/attractions");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;