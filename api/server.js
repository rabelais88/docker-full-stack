const express = require('express');
const cors = require('cors');

const app = express();

var whitelist = ['http://127.0.0.1.xip.io', 'https://127.0.0.1.xip.io', 'http://api.127.0.0.1.xip.io', 'https://api.127.0.0.1.xip.io', undefined]
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      console.log(origin)
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions));

app.get('/', (req, res, next) => {
    res.status(200).json({success: true})
})

const port = process.env.NODE_ENV || 4000;
app.listen(port, () => {
    console.log(`> server listening on port ${port}`);
})