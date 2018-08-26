#AGR Client for Node.js

Node.js client for license management features of Aggregion blockchain platform (AGR).

## Installation

```bash
npm i @aggregion/agr-client
```

## API

See API docs [here](./docs/API.md)

## Usage example

```javascript
const AgrClient = require('@aggregion/agr-client');

const config = {
    keyProvider: ['key'], // Private keys. May be array or string.
    chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f', // Id of chain
    httpEndpoint: 'https://devnet.blockchain.aggregion.com/', // Endpoint url
    verbose: true // Enable or disable verbose mode
};

const client = new AgrClient(config);

// Generate key pair

const keyPair = await AgrClient.createKeyPair(); // returns {publicKey: '...', privateKey: '...'}

// Create an account

await agg.createAccount('accountname', keyPair.publicKey, keyPair.publicKey);

// Transfer AGR

await agg.transfer('sender', 'receiver', new Asset(100, 'AGR'));

// Get account balance

const balance = await agg.getAccountBalance('accountname');

```

## Test

Default run:
```bash
npm test
```

Run with verbose mode:
```bash
VERBOSE=1 npm test
```

## License

ISC

## Contacts
For any questions: info@aggregion.com
