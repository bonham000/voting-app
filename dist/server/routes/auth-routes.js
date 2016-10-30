'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jwtConfig = require('../jwt-config');

var _jwtConfig2 = _interopRequireDefault(_jwtConfig);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _validateUser = require('../shared/validateUser');

var _validateUser2 = _interopRequireDefault(_validateUser);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var url = process.env.MONGO_HOST;

var MongoClient = _mongodb2.default.MongoClient;

var app = module.exports = _express2.default.Router();

function createToken(username) {
  return _jsonwebtoken2.default.sign({ user: username }, _jwtConfig2.default, { expiresIn: 60 * 30 });
}

// Insert a new user registration into the database
function addNewUser(userProfile) {
  console.log('Submitting new user to the database:', userProfile);
  // Add data to database
  MongoClient.connect(url, function (err, db) {
    _assert2.default.equal(null, err);

    db.collection('users').insertOne(userProfile);

    db.close();
  });
};

// Register new user
app.post('/register', function (req, res) {

  var user = req.body;
  console.log('New registration received on server:', user);

  var validation = (0, _validateUser2.default)(user);

  // Check if the user submitted all the fields correctly
  if (validation.isValid) {

    MongoClient.connect(url, function (err, db) {
      _assert2.default.equal(null, err);

      // Check to see if any user already exists with this username
      db.collection('users').findOne({ username: user.username }).then(function (response) {

        if (response === null) {

          // hash password for storage
          var passwordDigest = _bcrypt2.default.hashSync(user.password, 10);

          var profile = {
            username: user.username,
            email: user.email,
            password: passwordDigest,
            userData: {}
          };

          addNewUser(profile);

          res.status(201).send({
            username: user.username,
            id_token: createToken(user.username)
          });
        } else {
          res.status(400).send('This username already exists');
        }
      });

      db.close();
    });
  }
  // if user submission was invalid return errors to the client
  else {
      console.log('Invalid Registration:', validation.errors);
      res.status(400).send('Registration was in valid:', validation.errors);
    }
});

// Handle user login
app.post('/sessions/create', function (req, res) {
  var _req$body = req.body,
      username = _req$body.username,
      password = _req$body.password;


  MongoClient.connect(url, function (err, db) {
    _assert2.default.equal(null, err);

    var Users = db.collection('users');

    Users.findOne({ username: username }).then(function (data) {

      // user does not exist in database
      if (data === null) {
        console.log('User does not exist');
        res.status(401).send('User does not exist');
      }
      // if user exists check if password is valid
      else if (_bcrypt2.default.compareSync(password, data.password)) {
          res.status(201).send({
            id_token: createToken(data.username),
            user: data.username
          });
        }
        // user exists but password was invalid
        else {
            res.status(401).send('Invalid login attempt');
          }
    });
  });
});