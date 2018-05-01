const express = require("express")
const router = express.Router()
const { Chore, Member, Completion, Week } = require("./models")

router.get("/", (req, res) => {
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
      res.status(200).json(resp)
    })
    .catch(err => {
      res.status(500).json({ error: "nope not working" })
    })
})

module.exports = router
