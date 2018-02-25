const Blockchain = require('./blockchain');
const { validationResult } = require('express-validator/check');

class Deercoin {

    constructor () {
        this.blockchain = new Blockchain();
        this.getChain = this.getChain.bind(this);
        this.mine = this.mine.bind(this);
        this.newTransaction = this.newTransaction.bind(this);
    }

    /**
     * @param req
     * @param res
     * @param {function} next
     * @return {function}
     */
    getChain (req, res, next) {
        req.responseValue = {
            message: 'Get chain',
            chain: this.blockchain.chain
        };

        return next();
    }

    /**
     *
     * @param req
     * @param res
     * @param {function} next
     * @return {function}
     */
    mine (req, res, next) {
        const lastBlock = this.blockchain.lastBlock();
        const lastProof = lastBlock.proof;
        const proof = this.blockchain.proofOfWork(lastProof);

        this.blockchain.newTransaction('0', process.env.NODE_NAME, 1);

        const previousHash = this.blockchain.hash(lastBlock);

        req.responseValue = Object.assign({
            message: 'New block minded'
        }, this.blockchain.newBlock(proof, previousHash));

        return next();
    }

    /**
     *
     * @param req
     * @param res
     * @param {function} next
     * @return {function}
     */
    newTransaction (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.mapped()});
        }

        const trans = req.body;
        const index = this.blockchain.newTransaction(trans['sender'], trans['recipient'], trans['amount']);
        req.responseValue = {
            message: 'Transaction will be added to Block ${index}'
        };

        return next();
    }
}

module.exports = new Deercoin();