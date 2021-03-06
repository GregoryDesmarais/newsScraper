var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

app.engine("handlebars", exphbs({
    defaultLayout: "main",
    helpers: {
        rowOpen: function(int) {
            if (int % 2 === 0)
                return `<div class="row my-4">
                <div class="col-6">`;
            else
                return `<div class="col-6">`;
        },
        rowClose: function(int) {
            if (int % 2 === 0)
                return `</div>`;
            else
                return `</div></div>`;
        }
    }
}));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// Routes

app.get("/", (req, res) => {
    db.Article.find({}).sort({ _id: -1 })
        .populate("comment").then(articles => {
            res.render("index", { articles: articles })
        })
})

// A GET route for scraping engadget.
app.get("/scrape", (req, res) => {
    // First, we grab the body of the html with axios
    axios.get("http://engadget.com/").then(response => {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
        // Now, we grab every article tag, in the 'latest news' section, and do the following:
        $('section:contains("Latest")').find("article").each(function() {
            // Save an empty result object
            var result = {};

            // Grab the headline, summary, and link information.
            result.headline = $(this)
                .find("h2")
                .text().trim();
            result.summary = $(this)
                .find("p")
                .text().trim();
            result.link = "http://engadget.com" + ($(this)
                .find("h2").find("a")
                .attr("href") || $(this).children("a").attr("href"));
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(dbArticle => {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(err => {
                    // If an error occurred, log it
                    console.log(err);
                });
        });
        // Send a message to the client
        res.send("Complete");
    });
});

// Route for grabbing a specific Article by id, populate it with comments
app.get("/articles/:id", (req, res) => {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the Comments associated with it
        .populate("comment")
        .then((dbArticle) => {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch((err) => {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Comment
app.post("/articles/:id", (req, res) => {
    // Create a new Comment and pass the req.body to the entry
    db.Comment.create(req.body)
        .then(dbComment => {
            // If a Comment was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Comment
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comment: dbComment._id } }, { new: true });
        })
        .then(dbArticle => {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(err => {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

//Route for removing a Comment from an Article
app.get("/remove/:id", (req, res) => {
    db.Comment.deleteOne({ _id: req.params.id }).then(() => {
        // Pull functionality: https://docs.mongodb.com/manual/reference/operator/update/pull/
        return db.Article.findOneAndUpdate({ comment: req.params.id }, { $pull: { comment: req.params.id } })
            .then(data => {
                res.json(data)
            })
            .catch(err => {
                res.json.err
            })
    })
})

// Start the server
app.listen(PORT, () => {
    console.log("App running at http://localhost:" + PORT);
});