// SETUP Server and backend

const express = require("express");
const app = express();
const s3 = require("./utils/s3");
app.use(express.static("./public"));
const db = require("./utils/db");

//Multer
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

const bodyParser = require("body-parser");
app.use(bodyParser.json());

//The call to single indicates that we are only expecting one file. The string passed to single is the name of the field in the request.
app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    //So what we want to store
    // If nothing went wrong the file is already in the uploads directory
    const description = req.body.description;
    const title = req.body.title;
    const username = req.body.username;
    const url = "https://s3.amazonaws.com/spicedling/" + req.file.filename;

    if (req.file) {
        db.insertImage(description, username, title, url).then(resultInsert => {
            const img = {
                id: resultInsert.rows[0].id,
                url: url,
                description: description,
                title: title,
                username: username,
                success: true
            };
            res.json(img);
        });
    } else {
        res.json({
            success: false
        }).catch(err => {
            console.log(err);
        });
    }
});

//in index.js you CAN use arrow functions
// "/images" here and in axios must be equal
app.get("/images", (req, res) => {
    db.getImage()
        .then(result => {
            // res.json to send DATA back to the front as a response
            res.json(result.rows);
        })
        .catch(err => {
            console.log(err);
        });
});

// GET moreImages
app.get("/get-more-images/:id", (req, res) => {
    db.getMoreImages(req.params.id)
        .then(result => {
            // res,json to send DATA back to the front as a response
            res.json(result.rows);
        })
        .catch(err => {
            console.log(err);
        });
});
//GET modal
app.get("/modal/:id", (req, res) => {
    db.getModal(req.params.id)
        .then(resultModal => {
            const modal = {
                id: resultModal.rows[0].id,
                url: resultModal.rows[0].url,
                username: resultModal.rows[0].username,
                title: resultModal.rows[0].title,
                description: resultModal.rows[0].description,
                created_at: resultModal.rows[0].created_at
            };
            db.getComment(req.params.id).then(resultComments => {
                const comments = resultComments.rows;
                res.json([modal, comments]);
            });
        })
        .catch(err => {
            console.log(err);
        });
});
//GETTING COMMENTS INTO DB TABLE
app.post("/comments", function(req, res) {
    const comment = req.body.comment;
    const username = req.body.username;
    const img_id = req.body.id;

    db.insertComment(comment, username, img_id)
        .then(resultComments => {
            const newComment = {
                id: resultComments.rows[0].id,
                comment: comment,
                username: username,
                created_at: resultComments.rows[0].created_at
            };
            res.json(newComment);
        })
        .catch(err => {
            console.log(err);
        });
});
// we will be using AXIOS , a JS library for making ajax requests, to make GET and POST requests to our server without casuing the page to reload
app.listen(8080, () => console.log("Listening"));
