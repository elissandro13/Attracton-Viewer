const express = require("express");
const app = express();
const ejsLint = require('ejs-lint');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


let attractions = [
    {name: "Cristo Redentor", img: "https://abrilexame.files.wordpress.com/2016/09/size_960_16_9_vista_aerea_do_corcovado_no_rio_de_janeiro.jpg?quality=70&strip=info&w=920"},
    {name: "Corcovado", img: "https://abrilexame.files.wordpress.com/2016/09/size_960_16_9_cristo-redentor-no-rio-de-janeiro4.jpg?quality=70&strip=info&w=920"},
    {name: "Usina Itaipu", img: "https://abrilexame.files.wordpress.com/2016/09/size_960_16_9_itaipu.jpg?quality=70&strip=info&w=920"},     
];



app.get("/", function(req, res){
    res.render("landing");
});

app.get("/attractions", function(req,res) {
    res.render("attractions", {attractions:attractions});
});

app.post("/attractions", function(req, res){
    let name = req.body.name;
    let img = req.body.img;
    let newAttraction = {name : name,img : img};
    attractions.push(newAttraction);
    res.redirect("/attractions");
});

app.get("/attractions/new", function(req, res){
    res.render("new.ejs");
});

app.listen(3000, function(){
    console.log("on air");
});