const mongoose = require("mongoose");
const Attraction = require("./attraction");
const Comment   = require("./comment");

var seeds = [
    {
        name: "Cloud's Rest", 
        img: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Desert Mesa", 
        img: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "Canyon Floor", 
        img: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        text: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
];

async function seedDB(){
    try {
        await Attraction.deleteMany({});
        console.log('attractions removed');
        await Comment.deleteMany({});
        console.log('Comments removed');

        for(const seed of seeds) {
            let attraction = await Attraction.create(seed);
            console.log('attraction created');
            let comment = await Comment.create(
                {
                    text: 'This place is great, but I wish there was internet',
                    author: 'Homer'
                }
            )
            console.log('Comment created');
            attraction.comments.push(comment);
            attraction.save();
            console.log('Comment added to attraction');
        }
    } catch(err) {
        console.log(err);
    }
}

module.exports = seedDB;