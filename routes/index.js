var express = require('express');
var router = express.Router();
var braintree = require("braintree");

var gateway = braintree.connect({
    environment:  braintree.Environment.Sandbox,
    merchantId:   'kk9kgdz22f4hcdd5',
    publicKey:    'mkt74f8zbdprkn6k',
    privateKey:   'f094b7cba797f3d0da836c894d46aba5'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json("{\"HELLO WORLD\"}");
});

/**
 * Route that returns a token to be used on the client side to tokenize payment details
 */
router.get('/client_token', function(req, res, next) {
	gateway.clientToken.generate({}, function (err, response) {
    	if (err) { 
    		throw err;
    	}

    	res.send(response.clientToken);
  		console.log('token generated: ' + response.clientToken);
  	});
});

/**
 * Route to process a sale transaction
 */
router.post('/nonce/transaction', function(req, res, next) {
	var transaction = request.body;
	var amountCharged = transaction.amount;
    
    gateway.transaction.sale({
    	amount: amountCharged,
    	paymentMethodNonce: transaction.payment_method_nonce},
    	function (err, result) {
    	
    	if (err)  {
    		throw err;
    	}

    	console.log(util.inspect(result));
    	res.json(result);
  	});
});

module.exports = router;
