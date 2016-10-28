import express from 'express'
import assert from 'assert'
import dotenv from 'dotenv'
dotenv.config();

import mongodb from 'mongodb'
const MongoClient = mongodb.MongoClient;
const url = process.env.MONGO_HOST;

const app = module.exports = express.Router();

app.get('/retrieve-polls', (req, res) => {

	MongoClient.connect(url, (err, db) => {
		
		assert.equal(null, err)

		// query database and return collection of all polls
		db.collection('polls').find().toArray( (error, response) => {
			console.log(response)
			res.send(response)
		});

		db.close();
	});

});