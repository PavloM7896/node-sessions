var express = require('express');
var router = express.Router();
var Session = require('../models/Session.js');
var User = require('../models/User.js');
var jwt = require('jsonwebtoken');

router.use(function (req, res, next) {
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks expiration
		jwt.verify(token, "nodejs", function (err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	} else {

		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
});

/* GET /sessions */
router.get('/', function (req, res, next) {
	Session.find(function (err, session) {
		if (err) return next(err);

		res.status(200).json(session);
	})
	.populate('createdBy', 'email')
	.populate('attendies', 'email');
});

/* POST /sessions */
router.post('/', function (req, res, next) {
	Session.create(req.body, function (err, session) {
		if (err) {
			res.status(500).json({ Message: "Something happened" });
		}
		else {
			var userId = session.createdBy;
			var attendiesId = session.attendies;
			var sessionUser = session;

			User.findById(userId, function (err, user) {
				if (err) {
					res.status(500).json({ Message: "User not found" });
				}
				else {
					sessionUser.createdBy = {
						email: user.email,
						_id: user._id
					};
					res.status(201).json(sessionUser);
				};
			});
		};
	});
});

/* GET /sessions/id */
router.get('/:id', function (req, res, next) {
	Session.findById(req.params.id, function (err, session) {
		if (err) return next(err);

		res.json(session);
	})
	.populate('createdBy', 'email')
	.populate('attendies', 'email');
});

/* PUT /sessions/:id */
router.put('/:id', function (req, res, next) {
	Session.findByIdAndUpdate(req.params.id, req.body, function (err, session) {
		if (err) return next(err);
		
		res.json(session);
	});
});

/* DELETE /sessions/:id */
router.delete('/:id', function (req, res, next) {
	Session.findByIdAndRemove(req.params.id, req.body, function (err, session) {
		if (err) return next(err);

		res.json(session);
	});
});

module.exports = router;