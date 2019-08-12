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

// add a new comment
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
 //edit
router.get("/:comment_id/edit",checkCommentOwnership,function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }
        else {
            res.render("comments/edit", {place_id : req.params.id,comment : foundComment});
        }
    });
});

router.put("/:comment_id",checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect('/attractions/' + req.params.id);
        }
    })
});
//delete

router.delete("/:comment_id",checkCommentOwnership,function(req,res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("/attractions");
        }
        else {
            res.redirect("/attractions/" + req.params.id);
        }
    });
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    }
    else {
        res.redirect("back");
    }
}

module.exports = router;