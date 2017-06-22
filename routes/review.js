var express = require('express');
var router = express.Router();
var Review = require('../models/Review.js');

var multer = require('multer');
var upload = multer({ dest: "./uploads/videos" });
var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder();

router.post('/', upload.single('video'), function (req, res) {
    var location = [];
    var review = new Review({
        address: req.body.address,
        availability: req.body.availability,
        baths: req.body.baths,
        beds: req.body.beds,
        city: req.body.city,
        country: req.body.country,
        description: req.body.description,
        price: req.body.price,
        video: req.file,
        price_type: req.body.price_type, 
        property_type: req.body.property_type,
        square: req.body.square,
        state: req.body.state,
        location: location,
        zipcode: req.body.zipcode,
        user: req.body.userId
    });
    review.save(function (err) {
        res.status(201).json({ success: true });
    });
});

/* GET /review listing. */
router.get('/', function (req, res) {
    Review.find({}, function (err, reviews) {
        res.status(200).json(reviews);
    }).populate('user');
});

/* GET all reviews for user /id/reviews */
router.get('/:id/reviews', function (req, res) {

    var userReviews = [];

    Review.find(function (err, reviews) {
        for (var review of reviews) {
            if (review.user == req.params.id) {
                userReviews.push(review);
            }
        }
        res.status(200).json(userSessions);
    })
})

router.get('/search',function(req, res) {
    
     geocoder.geocode(req.body.address, function(err, res) {
       var location = [];
       location[0] = res.latitude;
       location[1] = res.longitude;
    });

    var area = { center: location, radius: 5, unique: true }

    var resJson =  Review.
        where('location').within().circle(area)
        where('property_type').equals(req.params.property_type).
        where('beds').gt(req.params.beds_from).lt(req.params.beds_to).
        where('availability').equals(req.params.availability).
        where('price_type').equals(req.params.price_type).
        where('price').gt(req.params.price_from).lt(req.params.price_to).
        where('square').gt(req.params.square_from).lt(req.params.square_to);
    res.status(200).json(resJson);
        
})

module.exports = router;  