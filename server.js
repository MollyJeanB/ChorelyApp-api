const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require("mongoose")
const { DATABASE_URL, PORT} = require("./config");
const { Chore, Member, Completion, Week } = require("./models")
mongoose.Promise = global.Promise;
app.use(express.json());

const {CLIENT_ORIGIN} = require('./config');

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.get('/', (req, res) => {
  const chores = Chore.find()
  const members = Member.find()
  const completions = Completion.find()
  const weeks = Week.find()
  Promise.all([chores, members, completions, weeks])
  .then(result => {
    const resp = {
      chores: result[0].map(chore => chore.serialize()),
      members: result[1].map(member => member.serialize()),
      completions: result[2].map(completion => completion.serialize()),
      weeks: result[3].map(week => week.serialize())
    }
    res.json(resp)
  }).catch(err => {
    res.status(500).json({error: "nope not working"})
  })


});

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

app.post("/chores", (req, res) => {
  let requiredFields = ["choreName", "pointValue", "timesPerWeek"];
  for (var i = 0; i < requiredFields.length; i++) {
  let field = requiredFields[i];
  if (!field) {
    return res.status(400).json({ error: "missing field in request body" });
  }
}
Chore.create({
  choreName: req.body.choreName,
  pointValue: req.body.pointValue,
  timesPerWeek: req.body.timesPerWeek
})
.then(newChore => {
  res.status(201).json(newChore.serialize())
})
.catch(err => {
  console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
})

})

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
  weekId: req.body.weekId,
})
.then(newCompletion => {
  res.status(201).json(newCompletion.serialize())
})
.catch(err => {
  console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
})

})


//does not work yet. Keep getting "ids don't match" error, or when I comment out that code I get a 201 status but the updated chore is null.
app.put("/chores/:id", (req, res) => {
  let requiredFields = ["choreName", "pointValue", "timesPerWeek"];
  for (var i = 0; i < requiredFields.length; i++) {
  let field = requiredFields[i];
  if (!field) {
    return res.status(400).json({ error: "missing field in request body" });
  }
}
const updatedChore = {
  choreName: req.body.choreName,
  pointValue: req.body.pointValue,
  timesPerWeek: req.body.timesPerWeek
}

Chore.findByIdAndUpdate(req.body.id, updatedChore, {new: true})
.then(updatedChore => {
  res.status(201).json(updatedChore)
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
