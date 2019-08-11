const express = require("express");
const router = express.Router();
const Attraction = require("../models/attraction");
// index  route
router.get("/", function(req,res) {
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
router.post("/",isLoggedIn,function(req, res){
    let name = req.body.name;
    //console.log(req.body.name);
    let img = req.body.img;
    let text = req.body.description;
    let author = {
        id: req.params._id,
        username: req.user.username
    }
    let newAttraction = {name : name,img : img, text : text,author : author};
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
 
router.get("/new", function(req, res){
    res.render("attractions/new.ejs");
});

//Show route

router.get("/:id", function(req,res){

    Attraction.findById(req.params.id).populate("comments").exec(function(err, foundAttraction){
        if(err){
            console.log(err);
        }
        else {
            res.render("attractions/show", {place: foundAttraction});
        }
    });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;