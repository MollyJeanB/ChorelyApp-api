//this router is not yet in use. Will be part of the future weekly reset feature.

const express = require('express');
const router = express.Router();
const { Week } = require("./models")

router.get("/:id", (req, res) => {
  Week.findById(req.params.id)
  .then(result => {
    res.json(result.serialize())
  })
  .catch(err => {
     console.error(err);
     res.status(500).json({ error: "ughhhhhhhh no no" });
   });
})

router.delete("/:id", (req, res) => {
  Week.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: "success, my friend!" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
});

router.post("/", (req, res) => {
  let requiredField = ["weekOfYear"];
  if (!requiredField) {
    return res.status(400).json({ error: "missing field in request body" });
  }
Week.create({
  weekOfYear: req.body.weekOfYear

})
.then(newWeek => {
  res.status(201).json(newWeek.serialize())
})
.catch(err => {
  console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
})

})

router.put("/:id", (req, res) => {
  let requiredField = ["weekOfYear"];
  if (!requiredField) {
    return res.status(400).json({ error: "missing field in request body" });
  }
const updatedWeek = {
  weekOfYear: req.body.weekOfYear
}

Week.findByIdAndUpdate(req.body.id, updatedWeek, {new: true})
.then(updatedWeek => {
  res.status(201).json(updatedWeek.serialize())
})
.catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
})

module.exports = router
