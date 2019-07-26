const express = require("express");
const app = express();
const ejsLint = require('ejs-lint');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));;
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/attraViewer",{ useNewUrlParser: true });

let attractionSchema = new mongoose.Schema({
    name: String,
    img: String
});

let attraction = mongoose.model("attraction", attractionSchema);


// let attractions = [
//     {name: "Usina Itaipu", img: "https://abrilexame.files.wordpress.com/2016/09/size_960_16_9_itaipu.jpg?quality=70&strip=info&w=920"},     
// ];



app.get("/", function(req, res){
    res.render("landing");
});

app.get("/attractions", function(req,res) {
    attraction.find({}, function(err, allAttractions){
        if(err){
            console.log(err);
        }
        else {
            res.render("attractions", {attractions:allAttractions});
        }
    });
});

app.post("/attractions", function(req, res){
    let name = req.body.name;
    console.log(req.body.name);
    let img = req.body.img;
    let newAttraction = {name : name,img : img};
    console.log(newAttraction);
    attraction.create(newAttraction, function(err, newCreated)
    {
        if(err) {
            console.log(err);
        }
        else {
            console.log(newCreated);
            res.redirect("/attractions");
        }
    });
});

app.get("/attractions/new", function(req, res){
    res.render("new.ejs");
});

app.listen(3000, function(){
    console.log("on air");
});