const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require("mongoose")
const { DATABASE_URL, PORT} = require("./config");
const { Chore, Member } = require("./models")
mongoose.Promise = global.Promise;

const {CLIENT_ORIGIN} = require('./config');

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.get('/*', (req, res) => {
  const chores = Chore.find()
  const members = Member.find()
  Promise.all([chores, members])
  .then(result => {
    const resp = {
      chores: result[0],
      members: result[1]
    }
    res.json(resp)
  }).catch(err => {
    res.status(500).json({error: "nope not working"})
  })


});

let server;

// connect to database, then start the server
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on("error", err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };
