var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Beacon = require('../models/Beacon.js');


/* GET all beacons. */
router.get('/', function(req, res, next) {
	Beacon.find(function (err, beacons) {
		if (err) { 
			return next (err); // pass on Error
		} 

		res.json(beacons);
	}); 
});

/* ADD a new beacon */
router.post('/', function(req, res, next) {
	var beacon = new Beacon({
		name: req.body.name,
		loc: req.body.loc,
		full: req.body.full
	});

	console.log(beacon);

	// save and return beacon
	beacon.save(function(err, beacon) {
		if (err) { 
			return next(err); 
		}

		res.status(201).json(beacon);
	});
});

/* GET /beacons/id */
router.get('/:id', function(req, res, next){
	Beacon.findById(req.params.id, function (err, beacon) {
		if (err) { 
			return next(err);
		}

		// return 
		res.json(beacon);
	});
});

/* PUT /beacons/:id  update beacons */
router.put('/:id', function(req, res, next) {
	Beacon.findById(req.params.id, function (err, beacon) {
		if (err) { 
			return next(err);
		}

		//tank.size = 'large';

		beacon.name = req.body.name ? req.body.name : beacon.name;
		beacon.loc = req.body.loc ? req.body.loc : beacon.loc;
		
		console.log(req.body.full );
		if (req.body.full != null) {
			if (req.body.full == true) {
				beacon.full = true;
			} else {
				beacon.full = false;
			}
		} 

		beacon.save(function(err, beacon) {
			if (err) { 
				return next(err); 
			}

			// return updated object
			res.status(201).json(beacon);
		});
	});
});

/* DELETE /beacons/:id */
router.delete('/:id', function(req, res, next) {
	Beacon.findByIDAndRemove(req.params.id, function (err, post) {
		if (err) return next(err);
		res.json(post);
	});
});

module.exports = router;