require('dotenv').config();
const assert = require('assert');
const Deercoin = require('../middleware/deercoin');

describe('Deercoin API', () => {
    describe('getChain', () => {
        it('Should return a chain with only the genesis block', () => {
            const req = {};
            Deercoin.getChain(req, {}, () => {
                const chain = req.responseValue.chain;
                assert.equal(chain.length, 1);
            });
        });
    });

    describe('mine', () => {
        it('Should mine a block and add it to the chain', () => {
            const req = {};
            Deercoin.mine(req, {}, () => {
                Deercoin.getChain(req, {}, () => {
                    const chain = req.responseValue.chain;
                    assert.equal(chain.length, 2);
                });
            });
        });
    });

    describe('transaction/new', () => {
        it('Should add transaction for the next mining', () => {
            const req = {
                body: {
                    sender: 'sender1',
                    receiver: 'receiver1',
                    amount: 1
                }
            };

            Deercoin.newTransaction(req, {}, () => {
                Deercoin.mine(req, {}, () => {
                    Deercoin.getChain(req, {}, () => {
                        const chain = req.responseValue.chain;
                        const transactions = chain.slice(-1)[0].transactions;

                        assert.equal(transactions[0].sender, 'sender1')
                    });
                });
            });
        });
    });
});