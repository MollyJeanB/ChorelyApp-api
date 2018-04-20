// "use strict";
//
// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const faker = require("faker");
// const mongoose = require("mongoose");
// const { Chore, Member, Completion, Week } = require("../models")
// const { TEST_DATABASE_URL } = require("../config");
// const { closeServer, runServer, app } = require("../server");
//
// chai.should();
// should = chai.should();
// chai.use(chaiHttp);
//
// function tearDownDb() {
//   return new Promise((resolve, reject) => {
//     console.warn("Deleting database");
//     mongoose.connection
//       .dropDatabase()
//       .then(result => resolve(result))
//       .catch(err => reject(err));
//   });
// }
//
// function seedCompletionData() {
//   const choreData = [];
//   for (var i = 1; i <= 10; i++) {
//     choreData.push({
//       choreName: faker.lorem.sentence(),
//       pointValue: faker.random.number(),
//       timesPerWeek: faker.random.number()
//     });
//   }
//   const chores = Chore.insertMany(choreData);
//   const memberData = [];
//     for (var i = 1; i <= 10; i++) {
//       memberData.push({
//         name: faker.name.firstName(),
//         color: faker.commerce.color(),
//         weekPoints: faker.random.number(),
//         totalPoints: faker.random.number()
//       });
//     }
//     const members = Member.insertMany(memberData);
//       Promise.all([members, chores])
//       .then( result => {
//         const chores = result[0]
//         const members = result[1]
//         const completionData = [{
//           choreId: chores[0]._id,
//           memberId: members[0]._id,
//           time: Date.now
//         },
//         {
//           choreId: chores[1]._id,
//           memberId: members[0]._id,
//           time: Date.now
//         }
//       ]
//       return Completion.insertMany(completionData)
//       // const weeks = []
//       // const dataObject = {
//       //   chores: chores,
//       //   members: members,
//       //   completions: completions,
//       //   weeks: weeks
//       // }
//       // return dataObject
//       // }
//
//     })
//     .catch(err => reject(err));
// }
//
//
// describe("Completion endpoints", function() {
//   before(function() {
//     return runServer(TEST_DATABASE_URL);
//   });
//
//   beforeEach(function() {
//     return seedCompletionData();
//   });
//
//   afterEach(function() {
//     return tearDownDb();
//   });
//
//   after(function() {
//     return closeServer();
//   });
//
//   describe("POST endpoint", function () {
//
//       it("should add a new completion", function () {
//
//         const newCompletion = {
//         };
//
//         return chai.request(app)
//           .post('/completions')
//           .send(newCompletion)
//           .then(function (res) {
//             res.should.have.status(201);
//             res.should.be.json;
//             res.body.should.be.a('object');
//             res.body.should.include.keys(
//               "choreId", "memberId", "weekId", "time");
//             res.body.choreId.should.equal(newCompletion.choreId);
//             res.body.memberId.should.equal(newCompletion.memberId);
//             res.body.id.should.not.be.null;
//             return Completion.findById(res.body.id);
//           })
//           .then(function (completion) {
//             completion.choreId.should.equal(newCompletion.choreId);
//             completion.memberId.should.equal(newCompletion.memberId);
//             completion.weekId.should.equal(newCompletion.weekId);
//             completion.time.should.equal(newCompletion.time);
//           });
//       });
//     });
//
//     describe('PUT endpoint', function () {
//
//       it('should update fields you send over', function () {
//         const updateData = {
//         };
//
//         return Completion
//           .findOne()
//           .then(completion => {
//             updateData.id = completion.id;
//
//             return chai.request(app)
//               .put(`/completions/${completion.id}`)
//               .send(updateData);
//           })
//           .then(res => {
//             res.should.have.status(201);
//             return Completion.findById(updateData.id);
//           })
//           .then(completion => {
//             completion.choreId.should.equal(updateData.choreId);
//             completion.memberId.should.equal(updateData.memberId);
//             completion.weekId.should.equal(updateData.weekId);
//             completion.time.should.equal(updateData.time);
//           });
//       });
//     });
//
//     describe('DELETE endpoint', function () {
//       it('should delete a completion by id', function () {
//
//         let completion;
//
//         return Completion
//           .findOne()
//           .then(_completion => {
//             completion = _completion;
//             return chai.request(app).delete(`/completions/${completion.id}`);
//           })
//           .then(res => {
//             res.should.have.status(204);
//             return Completion.findById(completion.id);
//           })
//           .then(_completion => {
//             should.not.exist(_completion);
//           });
//       });
//     });
//
// });
