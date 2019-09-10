const express = require("express");
const cors = require("cors");

const app = express();
const mongoose = require("mongoose");

var whitelist = [
  "http://127.0.0.1.xip.io",
  "https://127.0.0.1.xip.io",
  "http://api.127.0.0.1.xip.io",
  "https://api.127.0.0.1.xip.io",
  undefined
];
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
  res.status(200).json({ success: true });
});

const port = process.env.NODE_ENV || 4000;
const mongoUri = `mongodb://${process.env.MONGO_URI || '127.0.0.1:27017'}`
const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const dbName= 'database';
const connectOptions = { 
  useNewUrlParser: true,
  dbName,
};
if (mongoUsername) {
  connectOptions.user = mongoUsername;
  connectOptions.pass = mongoPassword;
}

const _procMain = async () => {
  try {
    console.log(`> db connection to ${mongoUri} by ${mongoUsername}`);
    await mongoose.connect(mongoUri, connectOptions);
    console.log('> db connected!!');
    app.listen(port, () => {
      console.log(`> server listening on port ${port}`);
    });
  } catch (err) {
    console.log('> failed connection...retrying...')
    console.error(err);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  _procMain();
}
module.exports = app;