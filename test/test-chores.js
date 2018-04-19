"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const mongoose = require("mongoose");
const { Chore, Member, Completion, Week } = require("../models")
const { TEST_DATABASE_URL } = require("../config");
const { closeServer, runServer, app } = require("../server");

chai.should();
should = chai.should();
chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn("Deleting database");
    mongoose.connection
      .dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function seedChoreData() {
  const choreData = [];
  for (var i = 1; i <= 10; i++) {
    choreData.push({
      choreName: faker.lorem.sentence(),
      pointValue: faker.random.number(),
      timesPerWeek: faker.random.number()
    });
  }
  return Chore.insertMany(choreData);
}


describe("Chore endpoints", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedChoreData();

  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe("POST endpoint", function () {

      it("should add a new chore", function () {

        const newChore = {
          choreName: faker.lorem.sentence(),
          pointValue: faker.random.number(),
          timesPerWeek: faker.random.number()
        };

        return chai.request(app)
          .post('/chores')
          .send(newChore)
          .then(function (res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys(
              "choreName", "pointValue", "timesPerWeek");
            res.body.choreName.should.equal(newChore.choreName);
            res.body.id.should.not.be.null;
            return Chore.findById(res.body.id);
          })
          .then(function (chore) {
            chore.choreName.should.equal(newChore.choreName);
            chore.pointValue.should.equal(newChore.pointValue);
            chore.timesPerWeek.should.equal(newChore.timesPerWeek);
          });
      });
    });

    describe('PUT endpoint', function () {

      it('should update fields you send over', function () {
        const updateData = {
          choreName: "Polish gates of hell",
          pointValue: 3,
          timesPerWeek: 1

        };

        return Chore
          .findOne()
          .then(chore => {
            updateData.id = chore.id;

            return chai.request(app)
              .put(`/chores/${chore.id}`)
              .send(updateData);
          })
          .then(res => {
            res.should.have.status(201);
            return Chore.findById(updateData.id);
          })
          .then(chore => {
            chore.choreName.should.equal(updateData.choreName);
            chore.pointValue.should.equal(updateData.pointValue);
            chore.timesPerWeek.should.equal(updateData.timesPerWeek);
          });
      });
    });

    describe('DELETE endpoint', function () {
      it('should delete a chore by id', function () {

        let chore;

        return Chore
          .findOne()
          .then(_chore => {
            chore = _chore;
            return chai.request(app).delete(`/chores/${chore.id}`);
          })
          .then(res => {
            res.should.have.status(204);
            return Chore.findById(chore.id);
          })
          .then(_chore => {
            should.not.exist(_chore);
          });
      });
    });

});
