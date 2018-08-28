const Agr = require('@aggregion/agrjs');
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
        this._agr = new Agr(Object.assign(config, {binaryen}));
    }


    /**
     * Creates a new account
     * @param {string} creator Creator (payer) account name
     * @param {string} name Name of account
     * @param {string} ownerKey OwnerKey of account
     * @param {string} [activeKey] ActiveKey of account
     * @param {object} [stake] Stake parameters
     * @param {string|Asset} [stake.net] Stake for network
     * @param {string|Asset} [stake.cpu] Stake for CPU
     * @param {Number} [stake.ram] Ram bytes
     * @param {boolean} [stake.transfer] Transfer or stake coins
     * @return {Promise<*>}
     */
    async createAccount(creator, name, ownerKey, activeKey, stake = {net: new Asset(1, 'AGR'), cpu: new Asset(1, 'AGR'), ram: 5000, transfer: false}) {
        check.assert.nonEmptyString(name, '"name" should be non-empty string');
        check.assert.nonEmptyString(name, '"ownerKey" should be non-empty string');
        check.assert.assigned(stake, '"stake" is required');
        check.assert.assigned(stake.net, '"stake.net" is required');
        check.assert.assigned(stake.cpu, '"stake.cpu" is required');
        check.assert.assigned(stake.ram, '"stake.ram" is required');
        check.assert.positive(stake.ram, '"stake.ram" should be > 0');
        check.assert.assigned(stake.transfer, '"stake.transfer" stake is required');
        if (typeof stake.net === 'string') {
            stake.net = new Asset(stake.net);
        }
        if (typeof stake.cpu === 'string') {
            stake.cpu = new Asset(stake.cpu);
        }
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
        return await this._agr.transaction(tr => {
            tr.newaccount({
                creator: creator,
                name: name,
                owner: ownerKey,
                active: activeKey
            });
            tr.buyrambytes({
                payer: creator,
                receiver: name,
                bytes: stake.ram
            });

            tr.delegatebw({
                from: creator,
                receiver: name,
                stake_net_quantity: stake.net.toString(),
                stake_cpu_quantity: stake.cpu.toString(),
                transfer: stake.transfer ? 1 : 0
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
        return await this._agr.transfer(from, to, asset.toString(), memo);
    }

    /**
     * Returns balance of account
     * @param {string} name
     * @param {string} [contract="agrio.token"]
     * @param {string} [currency="AGR"]
     * @return {Promise<*>}
     */
    async getAccountBalance(name, contract = 'agrio.token', currency = 'AGR') {
        const result = await this._agr.getCurrencyBalance(contract, name, currency);
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
