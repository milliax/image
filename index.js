require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const crypto = require("crypto");

const app = express();
const image_uploader = multer({
    limit: {
        fileSize: 10000000 // 10MB size limit
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) { // support three different type of image
            cb(new Error('Please upload an image'))
        }
        cb(null, true)
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "./image");
        },
        filename: (req, file, cb) => {
            let name = crypto.randomUUID().substring(0, 7);
            console.log(`name: ${name}`)
            while (fs.existsSync(`./image/${name}`)) {
                name = crypto.randomUUID().substring(0, 7);
                console.log(`name: ${name}`)
            }
            cb(null, name);
        }
    })
});
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const {isAuthorized} = require("./component/authenticator")

// check if it' s online
app.get("/", (req, res) => {
    console.log("Incoming home");
    res.status(200);
})

// upload image
app.post("/upload/image", isAuthorized, image_uploader.single('payload'), async (req, res) => {
    console.log("Incoming upload image");
    console.log(JSON.stringify(req.file));
    res.status(200)
    res.send(JSON.stringify({path: req.file.filename}));
})

// issue temporary token
app.get("/issue", isAuthorized, (req, res) => {
    
})


app.listen(port, () => {
    console.log("server started");
})
