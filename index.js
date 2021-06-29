const express = require("express");
const server = new express();
const port = 3000;
const fs = require("fs");
const axios = require("axios");
const path = require("path");
server.use(
    express.urlencoded({
        extended: true,
    })
);
console.clear();
sitelist = JSON.parse(fs.readFileSync("./database.json"));
server.listen(port, () => {
    console.log("\nrunnning on http://localhost:3000\n");
    
});
server.get("/", (req, res) => {
 
    res.sendFile(path.join(__dirname, "/index.html"));
});

server.get("/akm123", (req, res) => {
    res.send(sitelist.site);
});

server.post("/submit", (req, res) => {
    console.log(req.body);
    if (sitelist.site.includes(req.body.appname)) {
        console.log("already present");
        res.send("already present");
        return;
    } else {
        fs.readFile("./database.json", (err, data) => {
            if (err) {
                console.log(err);
            } else {
                obj = JSON.parse(data);
                obj.site.push(req.body.appname);
                fs.writeFile(
                    "./database.json",
                    JSON.stringify(obj, null, "\t"),
                    "utf8",
                    () => {}
                );
            }
        });
        res.send("added");
        console.log("added");
    }
});

setInterval(() => {
    sitelist.site.forEach((element) => {
        axios
            .get("https://" + element + ".herokuapp.com")
            .then(() => {
                console.log("success - " + element);
            })
            .catch(() => {
                console.log("error - " + element);
            });
    });
}, 1500000);