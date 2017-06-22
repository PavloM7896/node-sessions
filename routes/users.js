/**
 * Created by pasha on 18.02.2017.
 */
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var User = require('../models/User.js');
var Session = require('../models/Session.js');
var multer = require('multer');
//var storage =   multer.memoryStorage();
var upload = multer({ dest  : "./uploads/avatars"});
/* GET /users listing. */
router.post('/',upload.single('avatar'), function (req, res) {
    // create a user
    if (!req.body.email || !req.body.password) {
        res.status(500).json({ error: "Email and password are required." });
    }
    else {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            var user = new User({
                email: req.body.email,
                role: req.body.role,
                phone: req.body.phone,
                description: req.body.description,
                website_url: req.body.website_url,
                avatar: req.file,
                name: req.body.name,
                password: hash
            });
            // save the user
            user.save(function (err) {
                if (err) {
                    if (err.name == "MongoError") {
                        res.status(500).json({ error: "User already exist." });
                    }
                }
                else {
                    console.log('User saved successfully');
                    res.status(201).json({ success: true });
                };
            });
        });
    };
});

router.get('/', function (req, res) {
    User.find(function (err, users) {
        res.status(200).json(users);
    });
})

/* GET all sessions for user /id/sessions */
router.get('/:id/sessions', function (req, res) {

    var userSessions = [];

    function checkAttendies(session, id) {
        for (var attendie of session.attendies) {
            if (attendie == id) {
                return true;
            }
        }
    }

    Session.find(function (err, sessions) {
        for (var session of sessions) {
            console.log(session);
            if (session.createdBy == req.params.id) {
                userSessions.push(session);
            }
            else if (checkAttendies(session, req.params.id) == true) {
                userSessions.push(session);
            }
        }
        res.status(200).json(userSessions);
    })
})

module.exports = router;  
