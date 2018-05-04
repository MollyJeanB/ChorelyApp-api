"use strict";
global.DATABASE_URL = "mongodb://localhost/jwt-auth-demo-test";
const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");
const { User } = require("../users/models");

const expect = chai.expect;

chai.use(chaiHttp);

describe("/user", function() {
  const username = "exampleUser";
  const password = "examplePass";
  const houseName = "Example";
  const usernameB = "exampleUserB";
  const passwordB = "examplePassB";
  const houseNameB = "ExampleB"

  before(function() {
    return runServer(DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {});

  afterEach(function() {
    return User.remove({});
  });

  describe("/users", function() {
    describe("POST", function() {
      it("Should create a new user", function() {
        return chai
          .request(app)
          .post("/users")
          .send({
            username,
            password,
            houseName
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.keys(
              "username",
              "houseName",
              "id"
            );
            expect(res.body.username).to.equal(username);
            expect(res.body.houseName).to.equal(houseName);
            return User.findOne({
              username
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.houseName).to.equal(houseName);
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
      });
    });
  });
});
