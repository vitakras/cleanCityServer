var mongoose = require('mongoose');

var BeaconSchema = new mongoose.Schema({
    name: String,
    loc: {
    	type: [Number],  // [<longitude>, <latitude>]
    	index: '2d'      // create the geospatial index
    	},
    full: Boolean
});

module.exports = mongoose.model('Beacon', BeaconSchema);