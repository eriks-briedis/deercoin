require('dotenv').config();
const crypto = require('crypto');

class Blockchain {

    constructor () {
        this.chain = [];
        this.currentTransactions = [];

        this.newBlock = this.newBlock.bind(this);
        this.newTransaction = this.newTransaction.bind(this);
        this.lastBlock = this.lastBlock.bind(this);
        this.proofOfWork = this.proofOfWork.bind(this);

        this.newBlock(100, 1);
    }

    /**
     * Create the new block
     *
     * @param {int} proof
     * @param {string} previousHash
     */
    newBlock (proof, previousHash) {
        const block = {
            index: this.chain.length + 1,
            timestamp: new Date(),
            transactions: this.currentTransactions,
            proof: proof,
            previousHash: previousHash
        };

        this.currentTransactions = [];
        this.chain.push(block);

        return block;
    }

    /**
     * Store a new transaction
     * @param {string} sender
     * @param {string} recipient
     * @param {number} amount
     */
    newTransaction (sender, recipient, amount) {
        this.currentTransactions.push({
            sender: sender,
            recipient: recipient,
            amount: amount
        });

        const lastBlock = this.lastBlock();

        return (lastBlock) ?
            lastBlock['index'] + 1 :
            1;
    }

    /**
     * Hash the block
     * @param {{}} block
     */
    hash (block) {
        const blockString = JSON.stringify(block);

        return crypto.createHmac(process.env.HASH_TYPE, process.env.CRYPTO_SECRET)
            .update(blockString)
            .digest('hex');
    }

    /**
     * return the last block
     * @return {{}}
     */
    lastBlock () {
        return (this.chain.length) ?
            this.chain.slice(-1)[0]:
            false;
    }

    /**
     * given the previous POW and a p number checks if the solution to the problem is correct
     *
     * @param {string} lastProof
     * @param {number} proof
     * @return {boolean}
     */
    validProof (lastProof, proof) {
        const guessHash = crypto.createHmac(process.env.HASH_TYPE, process.env.CRYPTO_SECRET)
            .update(`${lastProof}${proof}`)
            .digest('hex');

        return guessHash.substr(0, 5) === process.env.RESOLUTION_HASH;

    }

    /**
     * cycle until a solution is found
     * @param {string} lastProof
     * @return {number}
     */
    proofOfWork (lastProof) {
        let proof = 0;
        while (true) {
            if (!this.validProof(lastProof, proof)) {
                proof++;
            } else {
                break;
            }
        }

        return proof;
    }
}

module.exports = Blockchain;