const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require("mongoose")
const { DATABASE_URL, PORT} = require("./config");
const { Chore, Member, Completion, Week } = require("./models")
const chartRouter = require("./chartRouter")
const choreRouter = require("./choreRouter")

mongoose.Promise = global.Promise;

app.use(express.json());
app.use("/", chartRouter)
app.use("/chores", choreRouter)


const {CLIENT_ORIGIN} = require('./config');

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.get("/:id", (req, res) => {
  const chore = Chore.findById(req.params.id)
  const member = Member.findById(req.params.id)
  const completion = Completion.findById(req.params.id)
  const week = Week.findById(req.params.id)
  Promise.all([chore, member, completion, week])
  .then(result => {
    res.json(result.serialize())
  })
  .catch(err => {
     console.error(err);
     res.status(500).json({ error: "ughhhhhhhh no no" });
   });
})

app.delete("/:id", (req, res) => {
  const chore = Chore.findByIdAndRemove(req.params.id)
  const member = Member.findByIdAndRemove(req.params.id)
  const completion = Completion.findByIdAndRemove(req.params.id)
  const week = Week.findByIdAndRemove(req.params.id)
  Promise.all([chore, member, completion, week])
    .then(() => {
      res.status(204).json({ message: "success, my friend!" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
});



app.post("/members", (req, res) => {
  let requiredFields = ["name", "color"];
  for (var i = 0; i < requiredFields.length; i++) {
  let field = requiredFields[i];
  if (!field) {
    return res.status(400).json({ error: "missing field in request body" });
  }
}
Member.create({
  name: req.body.name,
  color: req.body.color,
  weekPoints: 0,
  totalPoints: 0
})
.then(newMember => {
  res.status(201).json(newMember.serialize())
})
.catch(err => {
  console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
})

})

app.post("/completions", (req, res) => {
  let requiredFields = ["choreId", "memberId"];
  for (var i = 0; i < requiredFields.length; i++) {
  let field = requiredFields[i];
  if (!field) {
    return res.status(400).json({ error: "missing field in request body" });
  }
}
Completion.create({
  choreId: req.body.choreId,
  memberId: req.body.memberId,
  weekId: req.body.weekId
})
.then(newCompletion => {
  res.status(201).json(newCompletion.serialize())
})
.catch(err => {
  console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
})

})


app.put("/members/:id", (req, res) => {
let requiredFields = ["name", "color"];
  for (var i = 0; i < requiredFields.length; i++) {
  let field = requiredFields[i];
  if (!field) {
    return res.status(400).json({ error: "missing field in request body" });
  }
}
const updatedMember = {
  name: req.body.name,
  color: req.body.color
}

Member.findByIdAndUpdate(req.body.id, updatedMember, {new: true})
.then(updatedMember => {
  res.status(201).json(updatedMember.serialize())
})
.catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
})

app.put("/completions/:id", (req, res) => {
  let requiredFields = ["choreId", "memberId"];
  for (var i = 0; i < requiredFields.length; i++) {
  let field = requiredFields[i];
  if (!field) {
    return res.status(400).json({ error: "missing field in request body" });
  }
}
const updatedCompletion = {
  choreId: req.body.choreId,
  memberId: req.body.memberId,
  weekId: req.body.weekId
}

Completion.findByIdAndUpdate(req.body.id, updatedCompletion, {new: true})
.then(updatedCompletion => {
  res.status(201).json(updatedCompletion.serialize())
})
.catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
})

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
