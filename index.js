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

server.listen(port, () => {
    console.log("\nrunnning on http://localhost:3000\n");
    
});

server.get("/", (req, res) => {
 
    res.sendFile(path.join(__dirname, "/index.html"));
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
    y=req.body.appname.trim();
    console.log(y);

    fs.readFile("./database.json", (err, data) => {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data);
            if (obj.site.includes(y)) {
                console.log("already present");
                res.sendFile(path.join(__dirname, "/error.html")); 
            } else{
                obj.site.push(y);
                fs.writeFile(
                    "./database.json",
                    JSON.stringify(obj, null, "\t"),
                    "utf8",
                    () => {}
                );
                res.sendFile(path.join(__dirname, "/ok.html"));
            }
        }
    })

})

setInterval(() => {


    try {
      
    sitelist = JSON.parse(fs.readFileSync("./database.json"));
    console.log("----------------------- " );
    sitelist.site.forEach((element) => {
        axios
            .get("https://" + element + ".herokuapp.com")
            .then(() => {
                console.log("success - " + element);
            })
            .catch(() => {
                console.log("error   - " + element);
            });
    });  
    } catch (error) {
        console.log(error);
    }

    
}, 5000);