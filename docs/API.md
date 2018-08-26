## Classes

<dl>
<dt><a href="#AggBlockchain">AggBlockchain</a></dt>
<dd></dd>
<dt><a href="#Asset">Asset</a></dt>
<dd></dd>
<dt><a href="#Asset">Asset</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#KeyPair">KeyPair</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="AggBlockchain"></a>

## AggBlockchain
**Kind**: global class  

* [AggBlockchain](#AggBlockchain)
    * [new AggBlockchain(config)](#new_AggBlockchain_new)
    * _instance_
        * [.createAccount(creator, name, ownerKey, [activeKey], [stake])](#AggBlockchain+createAccount) ⇒ <code>Promise.&lt;\*&gt;</code>
        * [.transfer(from, to, quantity, [memo], [symbol])](#AggBlockchain+transfer) ⇒ <code>Promise.&lt;object&gt;</code>
        * [.getAccountBalance(name, [contract], [currency])](#AggBlockchain+getAccountBalance) ⇒ <code>Promise.&lt;\*&gt;</code>
    * _static_
        * [.createKeyPair()](#AggBlockchain.createKeyPair) ⇒ [<code>KeyPair</code>](#KeyPair)

<a name="new_AggBlockchain_new"></a>

### new AggBlockchain(config)
Creates a new instance


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>object</code> |  |  |
| config.keyProvider | <code>string</code> \| <code>Array.&lt;string&gt;</code> |  | Access keys |
| [config.httpEndpoint] | <code>string</code> | <code>&quot;\&quot;localhost\&quot;&quot;</code> | Endpoint of node |
| [config.chainId] | <code>string</code> |  | Id of chain |

<a name="AggBlockchain+createAccount"></a>

### aggBlockchain.createAccount(creator, name, ownerKey, [activeKey], [stake]) ⇒ <code>Promise.&lt;\*&gt;</code>
Creates a new account

**Kind**: instance method of [<code>AggBlockchain</code>](#AggBlockchain)  

| Param | Type | Description |
| --- | --- | --- |
| creator | <code>string</code> | Creator (payer) account name |
| name | <code>string</code> | Name of account |
| ownerKey | <code>string</code> | OwnerKey of account |
| [activeKey] | <code>string</code> | ActiveKey of account |
| [stake] | <code>object</code> | Stake parameters |
| [stake.net] | <code>string</code> \| [<code>Asset</code>](#Asset) | Stake for network |
| [stake.cpu] | <code>string</code> \| [<code>Asset</code>](#Asset) | Stake for CPU |
| [stake.ram] | <code>Number</code> | Ram bytes |
| [stake.transfer] | <code>boolean</code> | Transfer or stake coins |

<a name="AggBlockchain+transfer"></a>

### aggBlockchain.transfer(from, to, quantity, [memo], [symbol]) ⇒ <code>Promise.&lt;object&gt;</code>
Transfers tokens from one account to another

**Kind**: instance method of [<code>AggBlockchain</code>](#AggBlockchain)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| from | <code>string</code> |  | Account transfer from |
| to | <code>string</code> |  | Account transfer to |
| quantity | [<code>Asset</code>](#Asset) \| <code>number</code> |  | Quantity to transfer (should be positive) |
| [memo] | <code>string</code> | <code>&quot;\&quot;memo\&quot;&quot;</code> | Memo record |
| [symbol] | <code>string</code> | <code>&quot;\&quot;AGR\&quot;&quot;</code> | Symbol |

<a name="AggBlockchain+getAccountBalance"></a>

### aggBlockchain.getAccountBalance(name, [contract], [currency]) ⇒ <code>Promise.&lt;\*&gt;</code>
Returns balance of account

**Kind**: instance method of [<code>AggBlockchain</code>](#AggBlockchain)  

| Param | Type | Default |
| --- | --- | --- |
| name | <code>string</code> |  | 
| [contract] | <code>string</code> | <code>&quot;\&quot;agrio.token\&quot;&quot;</code> | 
| [currency] | <code>string</code> | <code>&quot;\&quot;AGR\&quot;&quot;</code> | 

<a name="AggBlockchain.createKeyPair"></a>

### AggBlockchain.createKeyPair() ⇒ [<code>KeyPair</code>](#KeyPair)
Creates a new key pair

**Kind**: static method of [<code>AggBlockchain</code>](#AggBlockchain)  
<a name="Asset"></a>

## Asset
**Kind**: global class  

* [Asset](#Asset)
    * [new Asset([quantity], [symbol])](#new_Asset_new)
    * [.toString()](#Asset+toString) ⇒ <code>string</code>
    * [.toJSON()](#Asset+toJSON) ⇒ <code>string</code>

<a name="new_Asset_new"></a>

### new Asset([quantity], [symbol])
Creates an asset


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [quantity] | <code>number</code> \| <code>string</code> | <code>0</code> | Quantity. May be number or text asset (ex. '100.0000 AGR') |
| [symbol] | <code>string</code> | <code>&quot;\&quot;AGR\&quot;&quot;</code> | Symbol (3 characters) |

<a name="Asset+toString"></a>

### asset.toString() ⇒ <code>string</code>
Returns formatted string of asset

**Kind**: instance method of [<code>Asset</code>](#Asset)  
<a name="Asset+toJSON"></a>

### asset.toJSON() ⇒ <code>string</code>
Returns formatted string of asset

**Kind**: instance method of [<code>Asset</code>](#Asset)  
<a name="Asset"></a>

## Asset
**Kind**: global class  

* [Asset](#Asset)
    * [new Asset([quantity], [symbol])](#new_Asset_new)
    * [.toString()](#Asset+toString) ⇒ <code>string</code>
    * [.toJSON()](#Asset+toJSON) ⇒ <code>string</code>

<a name="new_Asset_new"></a>

### new Asset([quantity], [symbol])
Creates an asset


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [quantity] | <code>number</code> \| <code>string</code> | <code>0</code> | Quantity. May be number or text asset (ex. '100.0000 AGR') |
| [symbol] | <code>string</code> | <code>&quot;\&quot;AGR\&quot;&quot;</code> | Symbol (3 characters) |

<a name="Asset+toString"></a>

### asset.toString() ⇒ <code>string</code>
Returns formatted string of asset

**Kind**: instance method of [<code>Asset</code>](#Asset)  
<a name="Asset+toJSON"></a>

### asset.toJSON() ⇒ <code>string</code>
Returns formatted string of asset

**Kind**: instance method of [<code>Asset</code>](#Asset)  
<a name="KeyPair"></a>

## KeyPair : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | Private key |
| publicKey | <code>string</code> | Public key |

