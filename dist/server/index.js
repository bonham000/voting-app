'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _expressHistoryApiFallback = require('express-history-api-fallback');

var _expressHistoryApiFallback2 = _interopRequireDefault(_expressHistoryApiFallback);

var _env = require('./config/env');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _mongodb = require('mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

var _authRoutes = require('./routes/auth-routes');

var _authRoutes2 = _interopRequireDefault(_authRoutes);

var _pollRoutes = require('./routes/poll-routes');

var _pollRoutes2 = _interopRequireDefault(_pollRoutes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
//import devConfig from './config/setup/dev'
//import prodConfig from './config/setup/prod'

var url = process.env.MONGO_HOST;
//const url = 'mongodb://mongo:mongo@ds057816.mlab.com:57816/fcc-voting-app'

var MongoClient = _mongodb2.default.MongoClient;

var app = (0, _express2.default)();

app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

// if (NODE_ENV === 'development') {
//   devConfig(app);
// } else {
//   prodConfig(app);
// }

//test connection to Mongo
MongoClient.connect(url, function (err, db) {
	_assert2.default.equal(null, err);
	console.log('Connection to MongoDB Established');
	db.close();
});

app.use(_express2.default.static('dist/client'));

// connect authentication routes
app.use(_authRoutes2.default);
app.use(_pollRoutes2.default);

app.use((0, _expressHistoryApiFallback2.default)(_path2.default.join(__dirname, '../../dist/client/index.html')));

var port = process.env.PORT || 5000;

app.listen(port || 5000, function (err) {
	if (err) throw err;
	console.log('The Express Server is Listening at ' + port + ' in ' + _env.NODE_ENV + ' mode');
});

exports.default = app;