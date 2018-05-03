const express = require("express")
const router = express.Router()
const { Completion } = require("./models")
const localStrategy = require("./auth/index").localStrategy;
const jwtStrategy = require("./auth/index").jwtStrategy;
const passport = require("passport");
const jwtAuth = passport.authenticate("jwt", { session: false });

router.get("/:id", (req, res) => {
  Completion.findById(req.params.id)
    .then(result => {
      res.json(result.serialize())
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: "ughhhhhhhh no no" })
    })
})

router.delete("/:id", (req, res) => {
  Completion.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: "success, my friend!" })
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: "ughhhhhhhh no no" })
    })
})


router.post("/", jwtAuth, (req, res) => {
  let requiredFields = ["choreId", "memberId"]
  for (var i = 0; i < requiredFields.length; i++) {
    let field = requiredFields[i]
    if (!field) {
      return res.status(400).json({ error: "missing field in request body" })
    }
  }

  Completion.create({
    choreId: req.body.choreId,
    memberId: req.body.memberId,
    weekId: req.body.weekId,
    user: req.user.id
  })
    .then(newCompletion => {
      res.json(newCompletion.serialize())
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ error: "ughhhhhhhh no no" })
    })
})

router.put("/:id", (req, res) => {
  debugger
  let requiredFields = ["memberId"]
  for (var i = 0; i < requiredFields.length; i++) {
    let field = requiredFields[i]
    if (!req.body[field]) {
      return res.status(400).json({ error: "missing field in request body" })
    }
  }
  const updatedCompletion = {
    memberId: req.body.memberId
  }

  Completion.findByIdAndUpdate(req.params.id, updatedCompletion, { new: true })
    .then(updatedCompletion => {
      debugger
      res.status(201).json(updatedCompletion.serialize())
    })
    .catch(err => {
      debugger
      console.error(err)
      res.status(500).json({ error: "ughhhhhhhh no no" })
    })
})

module.exports = router
