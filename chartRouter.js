const express = require("express")
const router = express.Router()
const { Chore, Member, Completion } = require("./models")
const localStrategy = require("./auth/index").localStrategy;
const jwtStrategy = require("./auth/index").jwtStrategy;
const passport = require("passport");
const jwtAuth = passport.authenticate("jwt", { session: false });
const moment = require("moment")

//GET endpoint for all app data associated with authenticated user
router.get('/', jwtAuth, (req, res) => {

  let completionFind = {user: req.user.id}
  if (req.query.lastWeek) {
    const today = moment().endOf("day")
    const lastWeek = moment(today).subtract(7, "days")
    completionFind.time = {
        $gte: lastWeek.toDate(),
        $lt: today.toDate()
    }
  }

  const chores = Chore.find({ user: req.user.id })
  const members = Member.find({ user: req.user.id })
  const completions = Completion.find(completionFind)

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
