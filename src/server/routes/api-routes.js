import express from 'express'
import assert from 'assert'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import secret from '../jwt-config'
import dotenv from 'dotenv'
dotenv.config();

import mongodb from 'mongodb'
const MongoClient = mongodb.MongoClient;
const url = process.env.MONGO_HOST;

const app = module.exports = express.Router();

app.post('/api/add-poll', (req, res) => {

	let token = req.body.token;

	jwt.verify(token, secret, (err, decoded) => {
		if (!err) {
				MongoClient.connect(url, (err, db) => {
					assert.equal(null, err);

					db.collection('polls').insertOne(req.body.poll);
					console.log('Inserted new poll data into database:', req.body.poll);

				 	res.end();
					db.close();
				});
		}
		else {
			res.status(401).send('You are not a valid user!!!');
		}
	});

});
