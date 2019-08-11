const mongoose = require("mongoose");

let attractionSchema = new mongoose.Schema({
    name: String,
    img: String,
    text: String,
    comments: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("attraction", attractionSchema);