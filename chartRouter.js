const express = require("express")
const router = express.Router()
const { Chore, Member, Completion } = require("./models")
const localStrategy = require("./auth/index").localStrategy;
const jwtStrategy = require("./auth/index").jwtStrategy;
const passport = require("passport");
const jwtAuth = passport.authenticate("jwt", { session: false });

//GET endpoint for all app data 
router.get('/', jwtAuth, (req, res) => {
  const chores = Chore.find({ user: req.user.id })
  const members = Member.find({ user: req.user.id })
  const completions = Completion.find({ user: req.user.id })

  Promise.all([chores, members, completions])
    .then(result => {
      const resp = {
        chores: result[0].map(chore => chore.serialize()),
        members: result[1].map(member => member.serialize()),
        completions: result[2].map(completion => completion.serialize())
      }
      res.status(200).json(resp)
    })
    .catch(err => {
      res.status(500).json({ error: "nope not working" })
    })
})

module.exports = router
