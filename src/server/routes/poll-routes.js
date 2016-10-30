import express from 'express'
import assert from 'assert'
import jwt from 'jsonwebtoken'
import secret from '../jwt-config'
import dotenv from 'dotenv'
dotenv.config();

import mongodb from 'mongodb'
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const url = process.env.MONGO_HOST;

const app = module.exports = express.Router();

// Handle new poll submissions
app.post('/api/add-poll', (req, res) => {

	let token = req.body.token;

	jwt.verify(token, secret, (err, decoded) => {
		if (!err) {
				MongoClient.connect(url, (err, db) => {
					assert.equal(null, err);

					db.collection('polls').insertOne(req.body.poll);

				 	res.end();
					db.close();
				});
		}
		else {
			res.status(401).send('You are not a valid user and are being logged out now!!!');
		}
	});
});

app.post('/api/add-option', (req, res) => {

	const data = req.body;

	const token = data.token;
	const ID = data.poll._id;
	const newOption = {
		option: data.option,
		votes: 0
	}

	jwt.verify(token, secret, (err, decode) => {
		if (!err) {
			MongoClient.connect(url, (err, db) => {
				assert.equal(null, err);
				db.collection('polls').findOne({_id: ObjectId(ID)}).then( (result) => {
					let newOptions = [...result.options, newOption];
					db.collection('polls').update(
					{ _id: ObjectId(ID) },
					{ $set:
						{
							options: newOptions
						}
					}, function(err, doc) {
						if (err) throw err;
						console.log('Successfully added option');
						res.status(201).send('Success');
						db.close();
					});
				});
			});
		}
		else { res.status(401).send('You are not an authenticated user.') }
	});
});

// Retrieve and return all poll data to the client
app.get('/api/retrieve-polls', (req, res) => {
	MongoClient.connect(url, (err, db) => {
		assert.equal(null, err)
		// query database and return collection of all polls
		db.collection('polls').find().toArray( (error, response) => {
			res.send(response);
			db.close();
		});
	});
});

// Handle poll votes
app.post('/api/submit-vote', (req, res) => {

	const { id, selectedOption, user } = req.body;
	const IP = req.connection.remoteAddress;

	// Set identity to username if user is authenticated, otherwise use IP address
	let identity = IP;

	if (user !== '') { identity = user; }

	MongoClient.connect(url, (err, db) => {

		assert.equal(null, err);

		db.collection('polls').findOne({_id: ObjectId(id)}).then( (data) => {

			// update vote count of selected poll by one
			data.options[selectedOption].votes = data.options[selectedOption].votes + 1;

			let newOptions = data.options;
			let newRecord = data.votingRecord.slice();

			// add check against username here:
			
			// check voting record so users can only vote once
			let testSubmission = newRecord.filter( (record) => { return record.identity !== ''; });
			
			if (testSubmission.length > 0) {
				console.log('submission rejected');
				res.status(401).send("You've already voted on this poll!");
				db.close();
			}
			else {
				newRecord.push({ [identity]: selectedOption });

				db.collection('polls').update(
					{ _id: ObjectId(id) },
					{ $set:
						{
							options: newOptions,
							votingRecord: newRecord
						} 
					}, function(err, doc) {
					if (err) throw err;
						db.collection('polls').find().toArray( (err, data) => { 
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
app.post('/api/delete-poll', (req, res) => {
	const { token, pollID } = req.body;
	// verify user authentication
	jwt.verify(token, secret, (err, decoded) => {
		if (err) {
			res.status(401).send('Only authenticated users can delete polls they author.');
		}
		else {
			// if user is authenticated remove selected poll
			MongoClient.connect(url, (err, db) => {
				assert.equal(null, err);
				db.collection('polls', (err, collection) => {
					collection.deleteOne({_id: ObjectId(pollID)}, function(err, results) {
						if (err) throw err;
						res.status(201).send('deleted!');
						db.close();
					});
				});
			});
		}
	});
});





