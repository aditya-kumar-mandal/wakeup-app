"use strict";
const express = require("express");
require('dotenv').config();
const server = new express();
const port = process.env.PORT || 5000;
const axios = require("axios");
const path = require("path");
const mongoose = require('mongoose');
const nodecron = require('node-cron');
const mongo_uri = process.env.MONGODB_URI;
mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.log('MongoDB connection error: ', err);
})
console.clear()
const Sites = mongoose.model('sites', {
    "url": String,
    "timeInMinutes": Number,
    "callagainin": Number
});


server.use(express.static(path.join(__dirname, '/public')));

server.use(
    express.urlencoded({
        extended: true,
    })
);

server.listen(port, () => {
    console.log("\nrunnning on http://localhost:" + port);

});

server.get("/", (req, res) => {
    res.sendFile("/index.html");
});

server.get("/akm123", (req, res) => {
    fs.readFile("./database.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data);
            res.send(obj)
        }
    })
});


server.post("/submit", (req, res) => {
    console.log(req.body);
    let timeInMinutes = (req.body.day * 24 * 60) + (req.body.hour * 60) + req.body.min;
    console.log(timeInMinutes);
    let url = req.body.url;


    if (req.body) {
        Sites.findOne({
            url: url,
            timeInMinutes: timeInMinutes
        }).exec((err, doc) => {
            if (err) {
                console.log(err);
                res.status(500).send("error");
            } else {
                if (doc) {
                    res.status(200).send("duplicate");
                } else {
                    const mongo = new Sites({
                        url: url,
                        timeInMinutes: timeInMinutes,
                        callagainin: 1
                    })
                    mongo.save().then((a) => {
                        console.log(a);
                        res.status(201).send("ok");
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).send("error");
                    });

                }
            }
        });
    }
});



nodecron.schedule('*/1 * * * *', () => {
    console.log("============================================================");
    Sites.find({}).exec(function (err, data) {
        if (err) {
            console.log(err);
        } else {
            data.forEach(currentItem => {
                console.log(currentItem);
                console.log('-----------------------------------');
                if (currentItem.callagainin >= currentItem.timeInMinutes) {
                    axios.get(currentItem.url).then(function (response) {
                        console.log("Succesfully called - ", currentItem.url);
                    }).catch(function () {
                        console.log("Not accessible - ", currentItem.url);
                    });
                    Sites.updateOne({
                        url: currentItem.url,
                        timeInMinutes: currentItem.timeInMinutes
                    }, {
                        $set: {
                            callagainin: 0
                        }
                    }).exec();


                } else {
                    console.log("Increase by 1 - ", currentItem.url);
                    Sites.updateOne({
                        url: currentItem.url,
                        timeInMinutes: currentItem.timeInMinutes
                    }, {
                        $set: {
                            callagainin: currentItem.callagainin + 1
                        }
                    }).exec();
                }


            });
        }
    });
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});