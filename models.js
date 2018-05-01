"use strict"

const mongoose = require("mongoose")
mongoose.Promise = global.Promise

const choreSchema = mongoose.Schema({
  choreName: { type: String, required: true },
  pointValue: { type: Number, required: true },
  timesPerWeek: { type: Number, required: true }
})

const memberSchema = mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  weekPoints: { type: Number, required: true },
  totalPoints: { type: Number, required: true }
})

const completionSchema = mongoose.Schema({
  choreId: { type: mongoose.Schema.Types.ObjectId, ref: "Chore" },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
  weekId: { type: mongoose.Schema.Types.ObjectId, ref: "Week" },
  time: { type: Date, default: Date.now }
})

const weekSchema = mongoose.Schema({
  weekOfYear: { type: Number }
})

choreSchema.methods.serialize = function() {
  return {
    id: this._id,
    choreName: this.choreName,
    pointValue: this.pointValue,
    timesPerWeek: this.timesPerWeek
  }
}

memberSchema.methods.serialize = function() {
  return {
    id: this._id,
    name: this.name,
    color: this.color,
    weekPoints: this.weekPoints,
    totalPoints: this.totalPoints
  }
}

completionSchema.methods.serialize = function() {
  return {
    id: this._id,
    choreId: this.choreId,
    memberId: this.memberId,
    weekId: this.weekId,
    time: this.time
  }
}

weekSchema.methods.serialize = function() {
  return {
    id: this._id,
    weekOfYear: this.weekOfYear
  }
}

const Chore = mongoose.model("Chore", choreSchema)
const Member = mongoose.model("Member", memberSchema)
const Completion = mongoose.model("Completion", completionSchema)
const Week = mongoose.model("Week", weekSchema)

module.exports = { Chore, Member, Completion, Week }
