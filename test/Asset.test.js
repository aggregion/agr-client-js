const chai = require('chai');
const should = chai.should();
const Asset = require('../src/Asset');


describe('Asset', () => {
   describe('#constructor', () => {
        it('should set default values', () => {
           const asset = new Asset();
           asset.quantity.should.equal(0);
           asset.symbol.should.equal('AGR');
        });

       it('should set correct values', () => {
           const asset = new Asset(10, 'SYS');
           asset.quantity.should.equal(10);
           asset.symbol.should.equal('SYS');
       });

       it('should parse values from string', () => {
           let asset = new Asset('1000.0000 SYS');
           asset.quantity.should.equal(1000);
           asset.symbol.should.equal('SYS');
           asset = new Asset('0.0001 SYS');
           asset.quantity.should.equal(0.0001);
           asset.symbol.should.equal('SYS');
       });

       it('should check input arguments', () => {
           should.throw(() => {new Asset(-1)});
           should.throw(() => {new Asset(1, 'InvalidSymbol')});
       });
   });

   describe('#toString', () => {
        it('should return formatted string', () => {
            new Asset().toString().should.equal('0.0000 AGR');
            new Asset(10).toString().should.equal('10.0000 AGR');
            new Asset(10, 'SYS').toString().should.equal('10.0000 SYS');
        });

       it('should normally format big values', () => {
           new Asset(100000000000000000000000, 'SYS').toString().should.equal('100000000000000000000000.0000 SYS');
       });
   });

    describe('#toJSON', () => {
        it('should return formatted string', () => {
            new Asset().toJSON().should.equal('0.0000 AGR');
            new Asset(10).toJSON().should.equal('10.0000 AGR');
            new Asset(10, 'SYS').toJSON().should.equal('10.0000 SYS');
            JSON.parse(JSON.stringify({value: new Asset(10, 'SYS')})).value.should.equal('10.0000 SYS');
        });
    });
});
