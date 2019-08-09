const express = require("express");
const app = express();
const ejsLint = require('ejs-lint');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Attraction = require("./models/attraction");
const Comment   = require("./models/comment");
const Seed = require("./models/seed");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/"));

mongoose.connect("mongodb://localhost/attraViewer",{ useNewUrlParser: true });

Seed();

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

app.get("/attractions/:id/comments/new", function(req,res){
    Attraction.findById(req.params.id, function(err, attractions){
        if(err){
            console.log(err);
        }
        else {
            res.render("comments/new.ejs", {place: attractions});
        }
    });   
});

app.post("/attractions/:id/comments" ,function(req,res){
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

app.listen(3000, function(){
    console.log("on air");
});