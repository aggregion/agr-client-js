const AggBlockchain = require('../src/');
const Asset = AggBlockchain.Asset;
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const should = chai.should();

const verbose = process.env.VERBOSE;
const accountCreator = 'agrio';

const getConfig = () => {
    return {
        keyProvider: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3',
        chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
        httpEndpoint: 'https://devnet.blockchain.aggregion.com/',
        verbose
    };
};


const testOwnerKey = 'AGR7RHP6JbHkxAPDFaqrT4XFJ9X2Dj6KBWy8JLkwWgEhLTqhxppsw';
const testActiveKey = 'AGR5mL8J3MmrPejy4erVzpyxgegLVSjZdJayi22sjMir4J9Ec7ZZE';

const allowedAccountSymbols = AggBlockchain.allowedAccountSymbols;

const getNewAccountName = () => {
    const len = 6;
    let s = 'aggtst';
    for (let i = 0; i < len; i++) {
        s += allowedAccountSymbols[Math.trunc(Math.random() * allowedAccountSymbols.length)];
    }
    if (verbose) {
        console.log('Account name: ', s);
    }
    return s;
};


describe('AggBlockchain', () => {
    describe('#constructor', () => {
        it('should create a new instance with valid config', () => {
            const config = getConfig();
            should.not.throw(() => new AggBlockchain(config));
        });

        it('should throw with invalid config', () => {
            const config = getConfig();
            const badConfig1 = Object.assign({}, config);
            delete badConfig1.keyProvider;
            should.throw(() => new AggBlockchain(badConfig1));
        });
    });

    describe('#createAccount', function () {
        this.timeout(300000);


        it('should create account', async () => {
            const config = getConfig();
            const agg = new AggBlockchain(config);
            const accountName = getNewAccountName();
            await agg.createAccount(accountCreator, accountName, testOwnerKey, testActiveKey);
        });

        it('should throw if name has invalid characters', () => {
            const config = getConfig();
            const agg = new AggBlockchain(config);
            return agg.createAccount(accountCreator, '123456', testOwnerKey, testActiveKey).should.be.rejected;
        });

        it('should throw if length of name is invalid', () => {
            const config = getConfig();
            const agg = new AggBlockchain(config);
            return agg.createAccount(accountCreator, 'abcdefghijklmnop', testOwnerKey, testActiveKey).should.be.rejected;
        });

        it('should throw if name is empty', () => {
            const config = getConfig();
            const agg = new AggBlockchain(config);
            return agg.createAccount(accountCreator, '', testOwnerKey, testActiveKey).should.be.rejected;
        });

        it('should throw if key is empty', () => {
            const config = getConfig();
            const agg = new AggBlockchain(config);
            const accountName = getNewAccountName();
            return agg.createAccount(accountCreator, accountName, '').should.be.rejected;
        });

        it('should not throw if stake defined by user', async () => {
            const config = getConfig();
            const agg = new AggBlockchain(config);
            await agg.createAccount(accountCreator, getNewAccountName(), testOwnerKey, testActiveKey, {
                cpu: '10.0000 AGR',
                net: '10.0000 AGR',
                ram: 5000,
                transfer: true
            }).should.be.fulfilled;
            await agg.createAccount(accountCreator, getNewAccountName(), testOwnerKey, testActiveKey, {
                cpu: new Asset(1, 'AGR'),
                net: new Asset(1, 'AGR'),
                ram: 5000,
                transfer: true
            }).should.be.fulfilled;
        });

        it('should throw if stake is not defined', () => {
            const config = getConfig();
            const agg = new AggBlockchain(config);
            const accountName = getNewAccountName();
            return agg.createAccount(accountCreator, accountName, testOwnerKey, testActiveKey, null).should.be.rejected;
        });

        it('should throw if stake.cpu is not defined or invalid', async () => {
            const config = getConfig();
            const agg = new AggBlockchain(config);
            const accountName = getNewAccountName();
            await agg.createAccount(accountCreator, accountName, testOwnerKey, testActiveKey, {
                net: '1.0000 AGR',
                ram: 5000
            }).should.be.rejected;
            await agg.createAccount(accountCreator, accountName, testOwnerKey, testActiveKey, {
                net: '1.0000 AGR',
                cpu: 100,
                ram: 5000
            }).should.be.rejected;
        });

        it('should throw if stake.net is not defined or invalid', async () => {
            const config = getConfig();
            const agg = new AggBlockchain(config);
            const accountName = getNewAccountName();
            await agg.createAccount(accountCreator, accountName, testOwnerKey, testActiveKey, {
                cpu: '1.0000 AGR',
                ram: 5000
            }).should.be.rejected;
            await agg.createAccount(accountCreator, accountName, testOwnerKey, testActiveKey, {
                cpu: '1.0000 AGR',
                net: 100,
                ram: 5000
            }).should.be.rejected;
        });

        it('should throw if stake.ram is not defined or invalid', async () => {
            const config = getConfig();
            const agg = new AggBlockchain(config);
            const accountName = getNewAccountName();
            await agg.createAccount(accountCreator, accountName, testOwnerKey, testActiveKey, {
                net: '1.0000 AGR',
                cpu: '1.0000 AGR',
                ram: -100
            }).should.be.rejected;
            await agg.createAccount(accountCreator, accountName, testOwnerKey, testActiveKey, {
                net: '1.0000 AGR',
                cpu: '1.0000 AGR'
            }).should.be.rejected;
        });
    });

    describe('#createKeyPair', function () {
        this.timeout(10000);
        it('should create key pair', async () => {
            const keyPair = await AggBlockchain.createKeyPair();
            keyPair.should.have.property('privateKey');
            keyPair.should.have.property('publicKey');
        });
    });

    describe('#transfer', function () {
        this.timeout(60000);

        it('should transfer tokens', async () => {
            const senderKeyPair = await AggBlockchain.createKeyPair();
            const receiverKeyPair = await AggBlockchain.createKeyPair();
            const config = getConfig();
            const newConfig = Object.assign({}, config);
            newConfig.keyProvider = [config.keyProvider, senderKeyPair.privateKey, receiverKeyPair.privateKey];
            const senderAccount = getNewAccountName();
            const receiverAccount = getNewAccountName();
            const agg = new AggBlockchain(newConfig);
            await agg.createAccount(accountCreator, senderAccount, senderKeyPair.publicKey);
            await agg.createAccount(accountCreator, receiverAccount, receiverKeyPair.publicKey);
            await agg.transfer('agrio', senderAccount, new Asset(100, 'AGR'));
            let balance = await agg.getAccountBalance(senderAccount, 'agrio.token');
            should.exist(balance.AGR);
            balance.AGR.should.equal(100);
            await agg.transfer(senderAccount, receiverAccount, new Asset(70, 'AGR'));
            balance = await agg.getAccountBalance(senderAccount, 'agrio.token');
            should.exist(balance.AGR);
            balance.AGR.should.equal(30);
            balance = await agg.getAccountBalance(receiverAccount, 'agrio.token');
            should.exist(balance.AGR);
            balance.AGR.should.equal(70);
        });

        it('should check input arguments', async () => {
            const config = getConfig();
            const agg = new AggBlockchain(config);
            await agg.transfer().should.be.rejected;
            await agg.transfer('acc1', 'acc2', 0).should.be.rejected;
            await agg.transfer('acc1', 'acc2', '123').should.be.rejected;
        });
    });

    describe('#getAccountBalance', function () {
        this.timeout(60000);
        it('should return account balance', async () => {
            const config = getConfig();
            const agg = new AggBlockchain(config);
            const accountName = getNewAccountName();
            const keyPair = await AggBlockchain.createKeyPair();
            await agg.createAccount(accountCreator, accountName, keyPair.publicKey);
            await agg.transfer('agrio', accountName, new Asset(0.0001, 'AGR'));
            const balance = await agg.getAccountBalance(accountName, 'agrio.token');
            should.exist(balance.AGR);
            balance.AGR.should.equal(0.0001);
        });
    });
});
