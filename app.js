
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const dotenv = require("dotenv");

const app = express();

require('dotenv').config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
   const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    // console.log(firstName, lastName, email);

    const data = {
        members: [
            {
               email_address: email,
               status: "subscribed",
               merge_fields: {
                   FNAME: firstName,
                   LNAME: lastName
               } 
            }
        ]
    };
    const jsonData = JSON.stringify(data);

//    var mc_api_key = process.env.MAILCHIMP_API_KEY;
//     var list_id = process.env.MAILING_LIST_ID;

    const url = `https://us19.api.mailchimp.com/3.0/lists/${process.env.MAILING_LIST_ID}`;
   
    const options = {
        method: "POST",
        auth: `user:${process.env.MAILCHIMP_API_KEY}`
    }

  const request=  https.request(url, options, function(response) {
      if(response.statusCode === 200){
       res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
     response.on("data", function(data){
        console.log(JSON.parse(data));
     })
    })

    app.post("/failure", function(req, res){
       res.redirect("/") 
    })

    request.write(jsonData);
    request.end();
});

app.listen(process.env.PORT|| 3000, function() {
    console.log("Server is running on port 3000");
});

