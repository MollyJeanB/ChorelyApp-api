"use strict";

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const choreSchema = mongoose.Schema({
  choreName: {type: String, required: true},
  pointValue: {type: Number, required: true},
  timesPerWeek: {type: Number, required: true}
})

const memberSchema = mongoose.Schema({
  name: {type: String, required: true},
  color: {type: String, required: true},
  weekPoints: {type: Number, required: true},
  totalPoints: {type: Number, required: true}
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
   weekPoints: this.hours,
   totalPoints: this.totalPoints

 }
}

const Chore = mongoose.model("Chore", choreSchema);
const Member = mongoose.model("Member", memberSchema);



module.exports = {Chore, Member}
