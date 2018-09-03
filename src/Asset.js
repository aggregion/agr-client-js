const check = require('check-types');
const BigInt = require('big-integer');

const stringify = (quantity, symbol) => {
    const intPart = Math.trunc(quantity);
    const fraction = quantity - intPart;
    return `${BigInt(intPart).toString()}.${fraction.toFixed(4).substr(2)} ${symbol}`;
};

const parseAsset = str => {
    const regex = /^(\d+\.\d{4}) ([A-Z]{3})$/;
    if (!regex.test(str)) {
        throw new Error('Invalid asset string format');
    }
    const match = str.match(regex);
    return {
        quantity: parseFloat(match[1]),
        symbol: match[2]
    };
};

/**
 * @class Asset
 */
class Asset {
    /**
     * Creates an asset
     * @param {number|string} [quantity=0] Quantity. May be number or text asset (ex. '100.0000 AGR')
     * @param {string} [symbol="AGR"] Symbol (3 characters)
     */
    constructor(quantity = 0, symbol = 'AGR') {
        if (typeof quantity === 'string') {
            check.assert.nonEmptyString(quantity, '"quantity" should be positive or zero');
            const asset = parseAsset(quantity);
            this.quantity = asset.quantity;
            this.symbol = asset.symbol;
        } else {
            check.assert.number(quantity, '"quantity" should be number type');
            check.assert.greaterOrEqual(quantity, 0, '"quantity" should be positive or zero');
            this.quantity = quantity;
            check.assert.nonEmptyString(symbol);
            if (!/[A-Z]{3}/.test(symbol)) {
                throw new Error('Invalid symbol format. Symbol should match regular expression "[A-Z]{3}"');
            }
            this.symbol = symbol;
        }
    }

    /**
     * Returns formatted string of asset
     * @return {string}
     */
    toString() {
        return stringify(this.quantity, this.symbol);
    }

    /**
     * Returns formatted string of asset
     * @return {string}
     */
    toJSON() {
        return stringify(this.quantity, this.symbol);
    }
}


module.exports = Asset;
