const express = require("express");
const router = express.Router({mergeParams: true});
const Attraction = require("../models/attraction");
const Comment = require("../models/comment");

// Comments Route
router.get("/new",isLoggedIn,function(req,res){
    Attraction.findById(req.params.id, function(err, attractions){
        if(err){
            console.log(err);
        }
        else {
            res.render("comments/new.ejs", {place: attractions});
        }
    });   
});

router.post("/",isLoggedIn,function(req,res){
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
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    attraction.comments.push(comment);
                    attraction.save();
                    res.redirect('/attractions/' + attraction._id);
                }
            });
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