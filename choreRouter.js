const express = require('express');
const router = express.Router();
const { Chore } = require("./models")

router.get("/:id", (req, res) => {
  Chore.findById(req.params.id)
  .then(result => {
    res.json(result.serialize())
  })
  .catch(err => {
     console.error(err);
     res.status(500).json({ error: "ughhhhhhhh no no" });
   });
})

router.delete("/:id", (req, res) => {
  Chore.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: "success, my friend!" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
});

router.post("/", (req, res) => {
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

router.put("/:id", (req, res) => {
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
  res.status(201).json(updatedChore.serialize())
})
.catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
})

module.exports = router
