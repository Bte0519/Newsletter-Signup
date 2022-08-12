const express = require("express");
const bodyParser = require("body-parser");
const client = require("mailchimp-marketing");
const htpps = require('https');
const { response } = require("express");
const { config } = require("dotenv");
require('dotenv').config();




const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {

  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;



  client.setConfig({
    apiKey: process.env.MAILCHIMP_KEY,
    server: process.env.SERVER_KEY,
  });

  console.log(client)

  const run = async () => {
    const response = await client.lists.setListMember(
      "b6028cefad",
      email,
      {
        email_address: email, status_if_new: "pending", merge_fields: {
          "FNAME": firstName,
          "LNAME": lastName
        }
      }

    );

    console.log(response);

  };

  run();

  if (response.statusCode === 200) {
    res.sendFile(__dirname + "/success.html")
  }
  else {
    res.sendFile(__dirname + "/failure.html")
  }
});

app.listen(3000, function () {
  console.log("Server is running on port 3000.")
}); 
