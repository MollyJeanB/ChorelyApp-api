"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const mongoose = require("mongoose");
const { Member } = require("../models")
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

function seedMemberData() {
  const memberData = [];
  for (var i = 1; i <= 10; i++) {
    memberData.push({
      name: faker.name.firstName(),
      color: faker.commerce.color(),
      weekPoints: faker.random.number(),
      totalPoints: faker.random.number()
    });
  }
  return Member.insertMany(memberData);
}


describe("Member endpoints", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedMemberData();

  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe("POST endpoint", function () {

      it("should add a new member", function () {

        const newMember = {
          name: faker.name.firstName(),
          color: faker.commerce.color(),
          weekPoints: 0,
          totalPoints: 0
        };

        return chai.request(app)
          .post('/members')
          .send(newMember)
          .then(function (res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys(
              "name", "color", "totalPoints", "weekPoints");
            res.body.name.should.equal(newMember.name);
            res.body.color.should.equal(newMember.color);
            res.body.id.should.not.be.null;
            return Member.findById(res.body.id);
          })
          .then(function (member) {
            member.name.should.equal(newMember.name);
            member.color.should.equal(newMember.color);
            member.weekPoints.should.equal(newMember.weekPoints);
            member.totalPoints.should.equal(newMember.totalPoints);
          });
      });
    });

    describe('PUT endpoint', function () {

      it('should update fields you send over', function () {
        const updateData = {
          name: "Beezlebub",
          color: "red",
          weekPoints: 0,
          totalPoints:75
        };

        return Member
          .findOne()
          .then(member => {
            updateData.id = member.id;

            return chai.request(app)
              .put(`/members/${member.id}`)
              .send(updateData);
          })
          .then(res => {
            res.should.have.status(201);
            return Member.findById(updateData.id);
          })
          .then(member => {
            member.name.should.equal(updateData.name);
            member.color.should.equal(updateData.color);
            member.weekPoints.should.equal(updateData.weekPoints);
            member.totalPoints.should.equal(updateData.totalPoints);
          });
      });
    });

    describe('DELETE endpoint', function () {
      it('should delete a member by id', function () {

        let member;

        return Member
          .findOne()
          .then(_member => {
            member = _member;
            return chai.request(app).delete(`/members/${member.id}`);
          })
          .then(res => {
            res.should.have.status(204);
            return Member.findById(member.id);
          })
          .then(_member => {
            should.not.exist(_member);
          });
      });
    });

});
