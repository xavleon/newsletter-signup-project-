const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const res = require("express/lib/response");
//const port = 3000;
const https = require("https");
const { writeFileSync } = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(process.env.PORT || 3000, function (req, res) {
  console.log("Server is up and running on heroku ");
});

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  var jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/5a7c3cf399";

  const options = {
    method: "POST",
    auth: "Javier:a286dd43feb2f5f0f91aa4423227d944-us14",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  //console.log(firstName, lastName, email);

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.post("/success", function (req, res) {
  res.redirect("/");
});

//a286dd43feb2f5f0f91aa4423227d944-us14
//5a7c3cf399
