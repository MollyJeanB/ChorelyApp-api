const express = require('express');
const router = express.Router();
const { Member } = require("./models")
const localStrategy = require("./auth/index").localStrategy;
const jwtStrategy = require("./auth/index").jwtStrategy;
const passport = require("passport");
const jwtAuth = passport.authenticate("jwt", { session: false });

router.get("/:id", (req, res) => {
  Member.findById(req.params.id)
  .then(result => {
    res.json(result.serialize())
  })
  .catch(err => {
     console.error(err);
     res.status(500).json({ error: "ughhhhhhhh no no" });
   });
})

router.delete("/:id", (req, res) => {
  Member.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: "success, my friend!" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
});

router.post("/", jwtAuth, (req, res) => {
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
  totalPoints: 0,
  user: req.user.id
})
.then(newMember => {
  res.status(201).json(newMember.serialize())
})
.catch(err => {
  console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
});
});

router.put("/:id", (req, res) => {
let requiredFields = ["name", "color", "weekPoints", "totalPoints"];
  for (var i = 0; i < requiredFields.length; i++) {
  let field = requiredFields[i];
  if (!field) {
    return res.status(400).json({ error: "missing field in request body" });
  }
}
const updatedMember = {
  name: req.body.name,
  color: req.body.color,
  weekPoints: req.body.weekPoints,
  totalPoints: req.body.totalPoints
}

Member.findByIdAndUpdate(req.body.id, updatedMember, {new: true})
.then(updatedMember => {
  res.status(201).json(updatedMember.serialize())
})
.catch(err => {
      console.error(err);
      res.status(500).json({ error: "ughhhhhhhh no no" });
    });
});



module.exports = router
