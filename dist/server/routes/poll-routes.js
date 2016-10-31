'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _jwtConfig = require('../jwt-config');

var _jwtConfig2 = _interopRequireDefault(_jwtConfig);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

_dotenv2.default.config();

var MongoClient = _mongodb2.default.MongoClient;
var ObjectId = _mongodb2.default.ObjectId;
var url = process.env.MONGO_HOST;

var app = module.exports = _express2.default.Router();

// Handle new poll submissions
app.post('/api/add-poll', function (req, res) {

	var token = req.body.token;

	_jsonwebtoken2.default.verify(token, _jwtConfig2.default, function (err, decoded) {
		if (!err) {
			MongoClient.connect(url, function (err, db) {
				_assert2.default.equal(null, err);

				db.collection('polls').insertOne(req.body.poll);

				res.end();
				db.close();
			});
		} else {
			res.status(401).send('You are not a valid user and are being logged out now!!!');
		}
	});
});

app.post('/api/add-option', function (req, res) {

	var data = req.body;

	var token = data.token;
	var ID = data.poll._id;
	var newOption = {
		option: data.option,
		votes: 0
	};

	_jsonwebtoken2.default.verify(token, _jwtConfig2.default, function (err, decode) {
		if (!err) {
			MongoClient.connect(url, function (err, db) {
				_assert2.default.equal(null, err);
				db.collection('polls').findOne({ _id: ObjectId(ID) }).then(function (result) {
					var newOptions = [].concat(_toConsumableArray(result.options), [newOption]);
					db.collection('polls').update({ _id: ObjectId(ID) }, { $set: {
							options: newOptions
						}
					}, function (err, doc) {
						if (err) throw err;
						console.log('Successfully added option');
						res.status(201).send('Success');
						db.close();
					});
				});
			});
		} else {
			res.status(401).send('You are not an authenticated user.');
		}
	});
});

// Retrieve and return all poll data to the client
app.get('/api/retrieve-polls', function (req, res) {
	MongoClient.connect(url, function (err, db) {
		_assert2.default.equal(null, err);
		// query database and return collection of all polls
		db.collection('polls').find().toArray(function (error, response) {
			res.send(response);
			db.close();
		});
	});
});

// Handle poll votes
app.post('/api/submit-vote', function (req, res) {
	var _req$body = req.body,
	    id = _req$body.id,
	    selectedOption = _req$body.selectedOption,
	    user = _req$body.user;

	var IP = req.connection.remoteAddress;

	// Set identity to username if user is authenticated, otherwise use IP address
	var identity = IP;

	if (user !== '') {
		identity = user;
	}

	MongoClient.connect(url, function (err, db) {

		_assert2.default.equal(null, err);

		db.collection('polls').findOne({ _id: ObjectId(id) }).then(function (data) {

			// update vote count of selected poll by one
			data.options[selectedOption].votes = data.options[selectedOption].votes + 1;

			var newOptions = data.options;
			var newRecord = data.votingRecord.slice();

			// check voting record so users can only vote once
			var testSubmission = newRecord.filter(function (record) {
				return record.identity !== '';
			});

			if (testSubmission.length > 0) {
				console.log('submission rejected');
				res.status(401).send("You've already voted on this poll!");
				db.close();
			} else {
				newRecord.push(_defineProperty({}, identity, selectedOption));

				db.collection('polls').update({ _id: ObjectId(id) }, { $set: {
						options: newOptions,
						votingRecord: newRecord
					}
				}, function (err, doc) {
					if (err) throw err;
					db.collection('polls').find().toArray(function (err, data) {
						res.send(data);
						console.log('successfully voted');
						db.close();
					});
				});
			}
		});
	});
});

// allow authenticated users to remove polls
app.post('/api/delete-poll', function (req, res) {
	var _req$body2 = req.body,
	    token = _req$body2.token,
	    pollID = _req$body2.pollID;
	// verify user authentication

	_jsonwebtoken2.default.verify(token, _jwtConfig2.default, function (err, decoded) {
		if (err) {
			res.status(401).send('Only authenticated users can delete polls they author.');
		} else {
			// if user is authenticated remove selected poll
			MongoClient.connect(url, function (err, db) {
				_assert2.default.equal(null, err);
				db.collection('polls', function (err, collection) {
					collection.deleteOne({ _id: ObjectId(pollID) }, function (err, results) {
						if (err) throw err;
						res.status(201).send('deleted!');
						db.close();
					});
				});
			});
		}
	});
});