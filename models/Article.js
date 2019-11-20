var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
    // `headline` is required and of type String
    headline: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        required: true,
        unique: true
    },
    // `link` is required and of type String
    link: {
        type: String,
        required: true,
        unique: true
    },
    // `comment` is an object that stores a Note id
    // The ref property links the ObjectId to the Comment model
    // This allows us to populate the Article with an associated Comment
    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;