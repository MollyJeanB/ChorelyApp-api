
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
    const chores = Chore.insertMany(choreData);
    const memberData = [];
      for (var i = 1; i <= 10; i++) {
        memberData.push({
          name: faker.name.firstName(),
          color: faker.commerce.color(),
          weekPoints: faker.random.number(),
          totalPoints: faker.random.number()
        });
      }
      const members = Member.insertMany(memberData);
    const completions = []
    const weeks = []
    const dataObject = {
      chores: chores,
      members: members,
      completions: completions,
      weeks: weeks
    }
    return dataObject
  }


  describe("Chart API resource", function() {
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

    describe("GET endpoint", function() {
      it("should return all data", function() {
    let res;
    return chai
      .request(app)
      .get("/")
      .then(_res => {
        res = _res;
           res.should.have.status(200);
      })
  });
});
});
