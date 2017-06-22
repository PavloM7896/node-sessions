/**
 * Created by pasha on 18.02.2017.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/User.js');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const saltRounds = 10;

// route to authenticate a user (POST http://localhost:4000/api/authenticate)
router.post('/', function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                var user = new User({
                    email: req.body.email,
                    password: hash
                });

                user.save(function (err) {
                    if (err) throw err;

                    var token = jwt.sign(user, "nodejs", {
                        expiresInMinutes: 1440 // expires in 24 hours
                    });

                    var resJSON = { 
                        success: true, 
                        data:{
                            token:token
                        },
                        message: 'User saved successfully'
                     };

                    res.json(resJSON);
                });
            });
        } else if (user) {
            // check if password matches
            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (result !== true) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' });
                }
                else {
                    var token = jwt.sign(user, "nodejs", {
                        //expiresInMinutes: 1440 // expires in 24 hours
                    });

                    var resJSON = { 
                        success: true, 
                        data:{
                            token:token
                        },
                        message: 'User saved successfully'
                     };

                    res.json(resJSON);
                };
            });
        };
    });
});

module.exports = router;
