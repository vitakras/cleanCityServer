var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Beacon = require('../models/Beacon.js');
var geolib = require('geolib');
var _ = require('underscore');

/* GET all beacons. */
router.get('/', function(req, res, next) {
	Beacon.find(function (err, beacons) {
		if (err) { 
			return next (err); // pass on Error
		} 

		res.json(beacons);
	}); 
});

/* GET closest beacon. */
router.post('/closest', function(req, res, next) {
	var loc = req.body.loc;
	var dist = req.body.dist;

	console.log(req.body.loc);
	console.log(req.body.dist);

	if (loc == null || dist == null) {
		var err = new Error("loc or dist can't be null");
		return next(err);
	}

	Beacon.find(function (err, beacons) {
		if (err) { 
			return next (err); // pass on Error
		} 

		// Get distance of all beacons
		var newbeacons = _.map(beacons, function(beacon) {
			console.log(beacon);

			if (beacon.loc == null) {
				return null;
			}

			var output = beacon.toObject();

			output.dist = geolib.getDistance(
    			{latitude: beacon.loc[0], longitude: beacon.loc[1]},
    			{latitude: loc[0], longitude: loc[1]}
				);

			console.log(output)
			return output;
		});

		// removes empty beacons or that are greater than distance
		var output = _.filter(newbeacons, function(beacon){ 
			if (beacon == null) {
				return false;
			}

			if (beacon.dist <= dist) {
				return true;
			} else {
				return false;
			}
		});

		res.json(output);
	}); 
});

/* ADD a new beacon */
router.post('/', function(req, res, next) {
	var beacon = new Beacon({
		name: req.body.name,
		loc: req.body.loc,
		full: req.body.full,
		beacon_type: req.body.beacon_type
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

		beacon.name = req.body.name ? req.body.name : beacon.name;
		beacon.loc = req.body.loc ? req.body.loc : beacon.loc;
		beacon.beacon_type = req.body.beacon_type ? req.body.beacon_type  : beacon.beacon_type; 
		
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