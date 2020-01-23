const {
  assert
} = require('chai');

const {
  getUserByEmail
} = require("../helper");

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function () {
  it('should return a user with valid email', function () {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    assert.equal(user, expectedOutput)
  });
});

describe('getUserByEmail', function () {
  it('should return a undefined if email does not exists', function () {
    const user = getUserByEmail("user5@example.com", testUsers)
    const expectedOutput = undefined;
    // Write your assert statement here
    assert.equal(user, expectedOutput)
  });
});