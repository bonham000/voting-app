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
			res.status(401).send('You are not a valid user!!!');
		}
	});

});

app.get('/api/retrieve-polls', (req, res) => {

	MongoClient.connect(url, (err, db) => {
		
		assert.equal(null, err)

		// query database and return collection of all polls
		db.collection('polls').find().toArray( (error, response) => { res.send(response) });

		db.close();
	});

});

app.post('/api/submit-vote', (req, res) => {

	const { id, selectedOption } = req.body;
	const IP = req.connection.remoteAddress;

	MongoClient.connect(url, (err, db) => {

		assert.equal(null, err);

		db.collection('polls').findOne({_id: ObjectId(id)}).then( (data) => {

			data.options[selectedOption].votes = data.options[selectedOption].votes + 1;
			let newOptions = data.options;

			db.collection('polls').update( { _id: ObjectId(id) }, { $set: {options: newOptions} }, function(err, doc) {
				if (err) throw err;
					db.collection('polls').find().toArray( (err, data) => { 
						res.send(data);
						console.log('successful update');
						db.close();
					});
			});

		});

	});

});








