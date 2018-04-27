const { CLIENT_ORIGIN } = require("./config")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const mongoose = require("mongoose")
const { DATABASE_URL, PORT } = require("./config")
const chartRouter = require("./chartRouter")
const choreRouter = require("./choreRouter")
const memberRouter = require("./memberRouter")
const completionRouter = require("./completionRouter")
const weekRouter = require("./weekRouter")

mongoose.Promise = global.Promise

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization")
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE")
  next()
})

app.use(bodyParser.json())

app.use("/", chartRouter)
app.use("/chores", choreRouter)
app.use("/members", memberRouter)
app.use("/completions", completionRouter)
app.use("/weeks", weekRouter)

let server

// connect to database, then start the server
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err)
      }
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`)
          resolve()
        })
        .on("error", err => {
          mongoose.disconnect()
          reject(err)
        })
    })
  })
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing server")
      server.close(err => {
        if (err) {
          return reject(err)
        }
        resolve()
      })
    })
  })
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err))
}

module.exports = { runServer, app, closeServer }
