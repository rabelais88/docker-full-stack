const fs = require('fs');
const express = require("express");
const cors = require("cors");

const app = express();
const mongoose = require("mongoose");

var whitelist = [...process.env.WHITELIST.split(","), undefined];
var corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(origin);
      callback(new Error("Not allowed by CORS"));
    }
  }
};

app.use(cors(corsOptions));

app.get("/", (req, res, next) => {
  console.log("request accepted, whitelists - ", whitelist);
  res.status(200).json({ success: true });
});

const port = process.env.NODE_ENV || 4000;
const mongoUri = `mongodb://${process.env.MONGO_URI || "127.0.0.1:27017"}`;
let mongoUsername = process.env.MONGO_USERNAME;
let mongoPassword = process.env.MONGO_PASSWORD;
try {
  mongoUsername = fs.readFileSync(process.env.MONGO_USERNAME_FILE, 'utf8');
  mongoPassword = fs.readFileSync(process.env.MONGO_PASSWORD_FILE, 'utf8');
  mongoUsername.replace(/[\n\r]/g, '');
  mongoPassword.replace(/[\n\r]/g, '');
  console.log('> successfully read user secrets');
} catch (err) {
  console.error('!> secret file is missing');
}

const dbName = "database";
const connectOptions = {
  useNewUrlParser: true,
  dbName
};
if (mongoUsername) {
  connectOptions.user = mongoUsername;
  connectOptions.pass = mongoPassword;
}

const _procMain = async () => {
  try {
    console.log(`> db connection to ${mongoUri}`);
    console.log(`>> trying ${mongoUsername} : ${mongoPassword}`)
    await mongoose.connect(mongoUri, connectOptions);
    console.log("> db connected!!");
    app.listen(port, () => {
      console.log(`> server listening on port ${port}`);
    });
  } catch (err) {
    console.log("!> failed connection...retrying...");
    console.error(err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  _procMain();
}
module.exports = app;
