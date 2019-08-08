const express = require("express");
const app = express();
const ejsLint = require('ejs-lint');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const attraction = require("./models/attraction");
const Comment   = require("./models/comment");
const Seed = require("./models/seed");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/attraViewer",{ useNewUrlParser: true });

Seed();
// let attractionSchema = new mongoose.Schema({
//     name: String,
//     img: String,
//     text: String
// });

// let attraction = mongoose.model("attraction", attractionSchema);


// let attTest = [
//     {name: "Usina Itaipu", img: "https://abrilexame.files.wordpress.com/2016/09/size_960_16_9_itaipu.jpg?quality=70&strip=info&w=920"},     
// ];


// attraction.create(attTest);
app.get("/", function(req, res){
    res.render("landing");
});

app.get("/attractions", function(req,res) {
    attraction.find({}, function(err, allAttractions){
        if(err){
            console.log(err);
        }
        else {
            res.render("index", {attractions:allAttractions});
        }
    });
});

app.post("/attractions", function(req, res){
    let name = req.body.name;
    //console.log(req.body.name);
    let img = req.body.img;
    let text = req.body.description;
    let newAttraction = {name : name,img : img, text : text};
    console.log(newAttraction);
    attraction.create(newAttraction, function(err, newCreated)
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

app.get("/attractions/new", function(req, res){
    res.render("new.ejs");
});

//Show route

app.get("/attractions/:id", function(req,res){

    attraction.findById(req.params.id).populate("comments").exec(function(err, foundAttraction){
        if(err){
            console.log(err);
        }
        else {
            res.render("show", {place: foundAttraction});
        }
    });
});

app.listen(3000, function(){
    console.log("on air");
});