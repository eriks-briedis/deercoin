const express = require('express');
const router = express.Router();
const {check} = require('express-validator/check');

const Deercoin = require('../middleware/deercoin');

const responseMiddleware = (req, res, next) => {
    return res.json(req.responseValue);
};

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/transactions/new', [
    check('sender', 'Sender must be a String').exists(),
    check('recipient', 'Sender must be a String').exists(),
    check('amount', 'Sender must be a Int value').exists(),
], Deercoin.newTransaction, responseMiddleware);

router.get('/mine', Deercoin.mine, responseMiddleware);
router.get('/chain', Deercoin.getChain, responseMiddleware);

module.exports = router;
