const Eos = require('@aggregion/agrjs');
const check = require('check-types');
const binaryen = require('binaryen');
const ecc = require('eosjs-ecc');
const Asset = require('./Asset');

const allowedAccountSymbols = '.12345abcdefghijklmnopqrstuvwxyz';

class AggBlockchain {
    /**
     * Creates a new instance
     * @param {object} config
     * @param {string|Array<string>} config.keyProvider Access keys
     * @param {string} [config.httpEndpoint="localhost"] Endpoint of node
     * @param {string} [config.chainId] Id of chain
     */
    constructor(config) {
        check.assert.assigned(config, 'config is required');
        check.assert.assigned(config.keyProvider, 'config.keyProvider is required');
        if (typeof config.keyProvider === 'string') {
            check.assert.nonEmptyString(config.keyProvider, 'config.keyProvider should be non-empty string');
        } else {
             check.assert.array(config.keyProvider, 'config.keyProvider should be array or string');
        }
        this._eos = new Eos(Object.assign(config, {binaryen}));
    }


    /**
     * Creates a new account
     * @param {string} name Name of account
     * @param {string} ownerKey OwnerKey of account
     * @param {string} [activeKey] ActiveKey of account
     * @return {Promise}
     */
    async createAccount(name, ownerKey, activeKey) {
        check.assert.nonEmptyString(name, '"name" should be non-empty string');
        check.assert.nonEmptyString(name, '"ownerKey" should be non-empty string');
        if (name.length > 12) {
            throw new Error('"name" can be up to 12 characters long');
        }
        for (let i = 0; i < name.length; i++) {
            if (!allowedAccountSymbols.includes(name[i])) {
                throw new Error(`Name contains invalid character ${name[i]}`);
            }
        }
        if (!activeKey) {
            activeKey = ownerKey;
        } else {
            check.assert.nonEmptyString(activeKey, '"activeKey" should be non-empty string');
        }
        const transactionResult = await this._eos.transaction(tr => {
            tr.newaccount({
                creator: 'eosio',
                name: name,
                owner: ownerKey,
                active: activeKey
            });
            // Надо покупать память для аккуанта от имени eosio
            tr.buyrambytes({
                payer: 'eosio',
                receiver: name,
                bytes: 5000
            });

            tr.delegatebw({
                from: 'eosio',
                receiver: name,
                stake_net_quantity: '10.0000 AGR',
                stake_cpu_quantity: '10.0000 AGR',
                transfer: 1
            });
        });
    }


    /**
     * @typedef {Object} KeyPair
     * @property {string} privateKey Private key
     * @property {string} publicKey Public key
     */
    /**
     * Creates a new key pair
     * @return {KeyPair}
     */
    static async createKeyPair() {
        const privateKey = await ecc.randomKey();
        return {
            privateKey,
            publicKey: ecc.privateToPublic(privateKey)
        };
    }


    /**
     * Transfers tokens from one account to another
     * @param {string} from Account transfer from
     * @param {string} to Account transfer to
     * @param {Asset|number} quantity Quantity to transfer (should be positive)
     * @param {string} [memo="memo"] Memo record
     * @param {string} [symbol="AGR"] Symbol
     * @return {Promise<object>}
     */
    async transfer(from, to, quantity, memo = 'memo', symbol = 'AGR') {
        check.assert.nonEmptyString(from, '"from" should be non-empty string');
        check.assert.nonEmptyString(to, '"to" should be non-empty string');
        check.assert.assigned(quantity, '"quantity" is required');
        let asset;
        if (typeof quantity === Number) {
            check.assert.positive(quantity, '"quantity" should be positive');
            asset = new Asset(quantity, symbol);
        } else if (quantity instanceof Asset) {
            asset = quantity;
        } else {
            throw new Error('"quantity" should be number or Asset');
        }
        return await this._eos.transfer(from, to, asset.toString(), memo);
    }

    /**
     * Returns balance of account
     * @param {string} name
     * @param {string} [contract="eosio.token"]
     * @param {string} [currency="AGR"]
     * @return {Promise<*>}
     */
    async getAccountBalance(name, contract = 'eosio.token', currency = 'AGR') {
        const result = await this._eos.getCurrencyBalance(contract, name, currency);
        const balance = {};
        result.forEach(b => {
           const asset = new Asset(b);
           balance[asset.symbol] = asset.quantity;
        });
        return balance;
    }
}

AggBlockchain.allowedAccountSymbols = allowedAccountSymbols;

module.exports = AggBlockchain;
