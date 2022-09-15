const bodyParser = require("body-parser");
const { request } = require("express");
const express = require("express");
const app = express();
const https = require("https");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.htm");
});

app.post("/", (req, res) => {
  const firstName = req.body.first;
  const lastName = req.body.last;
  const email = req.body.email;

  const data = {
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

  app.post("/failure", (req, res) => {
    res.redirect("/");
  });

  const jsonData = JSON.stringify(data);
  const url = "https://us13.api.mailchimp.com/3.0/lists/dbf001cba3";
  const options = {
    method: "POST",
    auth: "neeraj:448c851d471027f823cd95c5f197c3af-us13",
  };
  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.htm");
    } else {
      res.send(__dirname + "/failure.htm");
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});
app.get("/success", (res, req) => {
  req.sendFile(__dirname + "/success.htm");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running at 3000`);
});
