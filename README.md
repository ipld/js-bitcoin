# IPLD for Bitcoin

**JavaScript Bitcoin data multiformats codecs and utilities for IPLD**

## About

This codec is intended to be used with **[multiformats](https://github.com/multiformats/js-multiformats)**. It provides decode and encode functionality for the Bitcoin native format to and from IPLD.

The following IPLD codecs are available; they each support `encode()` and `decode()` functionality compatible with the multiformats `BlockCodec` type.

## Codecs

### `bitcoin-block`

`bitcoin-block` / `0xb0` is the Bitcoin block **header**, commonly identified by "Bitcoin block identifiers" (hashes with leading zeros).

```js
import * as bitcoinBlock from '@ipld/bitcoin/block'
```

### `bitcoin-tx`

`bitcoin-tx` / `0xb1` are Bitcoin transactions _and_ nodes in a binary merkle tree, the tip of which is referenced by the Bitcoin block header.

```js
import * as bitcoinTx from '@ipld/bitcoin/tx'
```

###  `bitcoin-witness-commitment`

`bitcoin-witness-commitment` / `0xb2` is the Bitcoin witness commitment that is used to reference transactions with intact witness data (a complication introduced by [SegWit](https://en.wikipedia.org/wiki/SegWit)).

```js
import * as bitcoinWitnessCommitment from '@ipld/bitcoin/witness-commitment'
```

## Hasher

The following multihash is available, compatible with the multiformats `MultihashHasher` type.

###  `dbl-sha2-256`

`dbl-sha2-256` / `0x56` is a double SHA2-256 hash: `SHA2-256(SHA2-256(bytes))`, used natively across all Bitcoin blocks, forming block identifiers, transaction identifiers and hashes and binary merkle tree nodes.

```js
import * as dblSha2256 from '@ipld/bitcoin/dbl-sha2-256'
```

## Utilities

In addition to the multiformats codecs and hasher, utilities are also provided to convert between Bitcoin hash identifiers and CIDs and to convert to and from full Bitcoin raw block data to a full collection of IPLD blocks. Additional conversion functionality for bitcoin raw data and the `bitcoin-cli` JSON format is provided by the **[bitcoin-block](https://github.com/rvagg/js-bitcoin-block)** library.

See the **API** section below for details on the additional utility functions.

## Example

This example reads Bitcoin IPLD blocks from a CAR file; assuming that CAR contains a complete (enough) graph representing a Bitcoin block (whose identifier is supplied as the second argument) and its transactions, it navigates to the first transaction (the Coinbase) and prints the `scriptSig` as UTF-8. This is often used to store arbitrary messages and other "graffiti".

Running this example on the Genesis block (CAR provided in this project: example-genesis.car) produces the following output:

```
$ node example.js ./example-genesis.car 000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f
��EThe Times 03/Jan/2009 Chancellor on brink of second bailout for banks
```

```js
import fs from 'fs'
import * as bitcoinBlock from '@ipld/bitcoin/block'
import * as bitcoinTx from '@ipld/bitcoin/tx'
import { CarReader } from '@ipld/car'

// Assumes a CAR with at least one full Bitcoin block represented as IPLD blocks
// and a "blockId" which is the commonly used Bitcoin block identifier (32-byte
// digest in hexadecimal, with leading zeros).
async function run (pathToCar, blockId) {
  const reader = await CarReader.fromIterable(fs.createReadStream(pathToCar))
  const headerCid = bitcoinBlock.blockHashToCID(blockId)
  const header = bitcoinBlock.decode((await reader.get(headerCid)).bytes)

  // navigate the transaction binary merkle tree to the first transaction, the coinbase,
  // which will be at the leftmost side of the tree.
  let txCid = header.tx
  let tx
  while (true) {
    tx = bitcoinTx.decode((await reader.get(txCid)).bytes)
    if (!Array.isArray(tx)) { // is not an inner merkle tree node
      break
    }
    txCid = tx[0] // leftmost side of the tx binary merkle
  }

  // convert the scriptSig to UTF-8 and cross our fingers that there's something
  // interesting in there
  console.log(Buffer.from(tx.vin[0].coinbase, 'hex').toString('utf8'))
}

run(process.argv[2], process.argv[3]).catch((err) => {
  console.error(err.stack)
  process.exit(1)
})
```

## Usage

In the API docs below, the names denote the export locations, such that they may be obtained by the following:

```js
// The whole bundle (note this object also includes additional properties that
// can be used to access all the others)
import * as Bitcoin from '@ipld/bitcoin'
// the `bitcoin-block` / `0xb0` codec
import * as BitcoinBlock from '@ipld/bitcoin/block'
// the `bitcoin-tx` / `0xb1` codec
import * as BitcoinTransaction from '@ipld/bitcoin/tx'
// the `bitcoin-witness-commitment` / `0xb2` codec
import * as BitcoinWitnessCommitment from '@ipld/bitcoin/witness-commitment'
// the `dbl-sha2-256` / `0x56` multihasher
import * as DblSha2256 from '@ipld/bitcoin/dbl-sha2-256'
```

## API

### Contents

 * [`Bitcoin.deserializeFullBitcoinBytes()(bytes)`](#Bitcoin__deserializeFullBitcoinBytes____)
 * [`Bitcoin.serializeFullBitcoinBytes()(obj)`](#Bitcoin__serializeFullBitcoinBytes____)
 * [`Bitcoin.cidToHash()(cid)`](#Bitcoin__cidToHash____)
 * [`Bitcoin.encodeAll()`](#Bitcoin__encodeAll____)
 * [`Bitcoin.assemble()`](#Bitcoin__assemble____)
 * [`BitcoinBlock.encode()`](#BitcoinBlock__encode____)
 * [`BitcoinBlock.decode()`](#BitcoinBlock__decode____)
 * [`BitcoinBlock.name`](#BitcoinBlock__name)
 * [`BitcoinBlock.code`](#BitcoinBlock__code)
 * [`BitcoinBlock.blockHashToCID()`](#BitcoinBlock__blockHashToCID____)
 * [`BitcoinTransaction.encode()`](#BitcoinTransaction__encode____)
 * [`BitcoinTransaction.encodeNoWitness()`](#BitcoinTransaction__encodeNoWitness____)
 * [`BitcoinTransaction.encodeAll()`](#BitcoinTransaction__encodeAll____)
 * [`BitcoinTransaction.encodeAllNoWitness()`](#BitcoinTransaction__encodeAllNoWitness____)
 * [`BitcoinTransaction.decode()`](#BitcoinTransaction__decode____)
 * [`BitcoinTransaction.name`](#BitcoinTransaction__name)
 * [`BitcoinTransaction.name`](#BitcoinTransaction__name)
 * [`BitcoinTransaction.txHashToCID()`](#BitcoinTransaction__txHashToCID____)
 * [`BitcoinWitnessCommitment.encode()`](#BitcoinWitnessCommitment__encode____)
 * [`BitcoinWitnessCommitment.decode()`](#BitcoinWitnessCommitment__decode____)
 * [`BitcoinWitnessCommitment.name`](#BitcoinWitnessCommitment__name)
 * [`BitcoinWitnessCommitment.code`](#BitcoinWitnessCommitment__code)
 * [`DblSha2256.name`](#DblSha2256__name)
 * [`DblSha2256.code`](#DblSha2256__code)
 * [`DblSha2256.encode()`](#DblSha2256__encode____)
 * [`DblSha2256.digest()`](#DblSha2256__digest____)

<a name="Bitcoin__deserializeFullBitcoinBytes____"></a>
### `Bitcoin.deserializeFullBitcoinBytes()(bytes)`

* `bytes` `(Uint8Array)`: a binary form of a Bitcoin block graph

* Returns:  `BlockPorcelain`: an object representation of the full Bitcoin block graph

Instantiate a full object form from a full Bitcoin block graph binary representation. This binary form is typically extracted from a Bitcoin network node, such as with the Bitcoin Core `bitcoin-cli` `getblock <identifier> 0` command (which outputs hexadecimal form and therefore needs to be decoded prior to handing to this function). This full binary form can also be obtained from the utility [`assemble`](#assemble) function which can construct the full graph form of a Bitcoin block from the full IPLD block graph.

The object returned, if passed through `JSON.stringify()` should be identical to the JSON form provided by the Bitcoin Core `bitcoin-cli` `getblock <identifier> 2` command (minus some chain-context elements that are not possible to derive without the full blockchain).

<a name="Bitcoin__serializeFullBitcoinBytes____"></a>
### `Bitcoin.serializeFullBitcoinBytes()(obj)`

* `obj` `(BlockPorcelain)`: a full JavaScript object form of a Bitcoin block graph

* Returns:  `Uint8Array`: a binary form of the Bitcoin block graph

Encode a full object form of a Bitcoin block graph into its binary
equivalent. This is the inverse of
[`Bitcoin.deserializeFullBitcoinBytes()`](#Bitcoin__deserializeFullBitcoinBytes____) and should produce the exact
binary representation of a Bitcoin block graph given the complete input.

The object form must include both the header and full transaction (including
witness data) data for it to be properly serialized.

As of writing, the witness merkle nonce is not currently present in the JSON
output from Bitcoin Core's `bitcoin-cli`. See
https://github.com/bitcoin/bitcoin/pull/18826 for more information. Without
this nonce, the exact binary form cannot be fully generated.

<a name="Bitcoin__cidToHash____"></a>
### `Bitcoin.cidToHash()(cid)`

* `cid` `(CID|string)`: a CID

* Returns:  `string`: a hexadecimal big-endian representation of the identifier.

Convert a CID to a Bitcoin block or transaction identifier. This process is
the reverse of `blockHashToCID()` and `txHashToCID()` and involves extracting
and decoding the multihash from the CID, reversing the bytes and presenting
it as a big-endian hexadecimal string.

Works for both block identifiers and transaction identifiers.

<a name="Bitcoin__encodeAll____"></a>
### `Bitcoin.encodeAll()`

* `block` `(BlockPorcelain)`

* Returns:  `IterableIterator<{cid: CID, bytes: Uint8Array}>`

Encodes a full Bitcoin block, as presented in `BlockPorcelain` form (which is
available as JSON output from the `bitcoin-cli` tool—see the `bitcoin-block`
npm package for more information) into its constituent IPLD blocks. This
includes the header, the transaction merkle intermediate nodes, the
transactions and SegWit forms of the transaction merkle and nodes if present
along with the witness commitment block if required.

<a name="Bitcoin__assemble____"></a>
### `Bitcoin.assemble()`

* `loader` `(IPLDLoader)`: an IPLD block loader function that takes a CID argument and returns a `Uint8Array` containing the binary block data for that CID
* `blockCid` `(CID)`: a CID of type `bitcoin-block` pointing to the Bitcoin block header for the block to be assembled

* Returns:  `Promise<{deserialized:BlockPorcelain, bytes:Uint8Array}>`: an object containing two properties, `deserialized` and `bytes` where `deserialized` contains a full JavaScript instantiation of the Bitcoin block graph and `bytes` contains a `Uint8Array` with the binary representation of the graph.

Given a CID for a `bitcoin-block` Bitcoin block header and an IPLD block
loader that can retrieve Bitcoin IPLD blocks by CID, re-assemble a full
Bitcoin block graph into both object and binary forms. This is the inverse
of the [`Bitcoin.encodeAll()`](#Bitcoin__encodeAll____) function in that it puts the
`BitcoinPorcelain` back together. A JSON form of this output should match
the output provided by `bitcoin-cli` (with some possible minor differences).

The loader should be able to return the binary form for `bitcoin-block`,
`bitcoin-tx` and `bitcoin-witness-commitment` CIDs.

<a name="BitcoinBlock__encode____"></a>
### `BitcoinBlock.encode()`

* `node` `(BitcoinHeader)`

* Returns:  `ByteView<BitcoinHeader>`

**`bitcoin-block` / `0xb0` codec**: Encodes an IPLD node representing a
Bitcoin header object into byte form.

<a name="BitcoinBlock__decode____"></a>
### `BitcoinBlock.decode()`

* `data` `(ByteView<BitcoinHeader>)`

* Returns:  `BitcoinHeader`

**`bitcoin-block` / `0xb0` codec**: Decodes a bytes form of a Bitcoin header
into an IPLD node representation.

<a name="BitcoinBlock__name"></a>
### `BitcoinBlock.name`

**`bitcoin-block` / `0xb0` codec**: the codec name

<a name="BitcoinBlock__code"></a>
### `BitcoinBlock.code`

**`bitcoin-block` / `0xb0` codec**: the codec code

<a name="BitcoinBlock__blockHashToCID____"></a>
### `BitcoinBlock.blockHashToCID()`

* `blockHash` `(string)`: a string form of a block hash

* Returns:  `CID`: a CID object representing this block identifier.

Convert a Bitcoin block identifier (hash) to a CID. The identifier should be in big-endian form, i.e. with leading zeros.

The process of converting to a CID involves reversing the hash (to little-endian form), encoding as a `dbl-sha2-256` multihash and encoding as a `bitcoin-block` multicodec. This process is reversable, see [`cidToHash`](#cidToHash).

<a name="BitcoinTransaction__encode____"></a>
### `BitcoinTransaction.encode()`

* `node` `(BitcoinTransaction|BitcoinTransactionMerkleNode)`

* Returns:  `ByteView<(BitcoinTransaction|BitcoinTransactionMerkleNode)>`

**`bitcoin-tx` / `0xb1` codec**: Encodes an IPLD node representing a
Bitcoin transaction object into byte form.

Note that a `bitcoin-tx` IPLD node can either be a full transaction with or
without SegWit data, or an intermediate transaction Merkle tree node; in
which case it is simply an array of two CIDs.

<a name="BitcoinTransaction__encodeNoWitness____"></a>
### `BitcoinTransaction.encodeNoWitness()`

* `node` `(BitcoinTransaction)`

* Returns:  `ByteView<BitcoinTransaction>`

Same as [`BitcoinTransaction.encode()`](#BitcoinTransaction__encode____) but will explictly exclude any
witness (SegWit) data from the output. This is necessary for encoding SegWit
blocks since transactions must be stored both with and without witness data
to correctly represent the full content addressed structure.

<a name="BitcoinTransaction__encodeAll____"></a>
### `BitcoinTransaction.encodeAll()`

* `obj` `(BlockPorcelain)`

* Returns: 

Encodes all transactions in a complete `BlockPorcelain` (see the
`bitcoin-block` npm package for details on this type) representation of an
entire Bitcoin transaction; including intermediate Merkle tree nodes.

Intermediate Merkle tree nodes won't have the `transaction` property on the
output as they aren't full transactions and their `bytes` will have a length
of 64.

<a name="BitcoinTransaction__encodeAllNoWitness____"></a>
### `BitcoinTransaction.encodeAllNoWitness()`

* `obj` `(BlockPorcelain)`

* Returns: 

Same as [`BitcoinTransaction.encodeAll()`](#BitcoinTransaction__encodeAll____) but only encodes non-SegWit
transaction data, that is, transactions without witness data and no secondary
SegWit transactions Merkle tree.

<a name="BitcoinTransaction__decode____"></a>
### `BitcoinTransaction.decode()`

* `data` `(ByteView<(BitcoinTransaction|BitcoinTransactionMerkleNode)>)`

* Returns:  `BitcoinTransaction|BitcoinTransactionMerkleNode`

**`bitcoin-block` / `0xb0` codec**: Decodes a bytes form of a Bitcoin
transaction into an IPLD node representation.

Note that a `bitcoin-tx` IPLD node can either be a full transaction with or
without SegWit data, or an intermediate transaction Merkle tree node; in
which case it is simply an array of two CIDs. As byte form, an intermediate
Merkle tree node is a fixed 64-bytes.

<a name="BitcoinTransaction__name"></a>
### `BitcoinTransaction.name`

**`bitcoin-tx` / `0xb1` codec**: the codec name

<a name="BitcoinTransaction__name"></a>
### `BitcoinTransaction.name`

**`bitcoin-tx` / `0xb1` codec**: the codec name

<a name="BitcoinTransaction__txHashToCID____"></a>
### `BitcoinTransaction.txHashToCID()`

* `txHash` `(string)`: a string form of a transaction hash

* Returns:  `CID`: A CID (`multiformats.CID`) object representing this transaction identifier.

Convert a Bitcoin transaction identifier (hash) to a CID. The identifier should be in big-endian form as typically understood by Bitcoin applications.

The process of converting to a CID involves reversing the hash (to little-endian form), encoding as a `dbl-sha2-256` multihash and encoding as a `bitcoin-tx` multicodec. This process is reversable, see [`cidToHash`](#cidToHash).

<a name="BitcoinWitnessCommitment__encode____"></a>
### `BitcoinWitnessCommitment.encode()`

* `node` `(BitcoinWitnessCommitment)`

* Returns:  `ByteView<BitcoinWitnessCommitment>`

**`bitcoin-witness-commitment` / `0xb2` codec**: Encodes an IPLD node
representing a Bitcoin witness commitment object into byte form.

The object is expected to be in the form
`{witnessMerkleRoot:CID, nonce:Uint8Array}` where the `witnessMerkleRoot`
may be null.

<a name="BitcoinWitnessCommitment__decode____"></a>
### `BitcoinWitnessCommitment.decode()`

* `data` `(ByteView<BitcoinWitnessCommitment>)`

* Returns:  `BitcoinWitnessCommitment`

**`bitcoin-witness-commitment` / `0xb2` codec**: Decodes a bytes form of a
Bitcoin witness commitment into an IPLD node representation.
.

The returned object will be in the form
`{witnessMerkleRoot:CID, nonce:Uint8Array}` where the `witnessMerkleRoot`
may be null.

<a name="BitcoinWitnessCommitment__name"></a>
### `BitcoinWitnessCommitment.name`

**`bitcoin-witness-commitment` / `0xb2` codec**: the codec name

<a name="BitcoinWitnessCommitment__code"></a>
### `BitcoinWitnessCommitment.code`

**`bitcoin-witness-commitment` / `0xb2` codec**: the codec code

<a name="DblSha2256__name"></a>
### `DblSha2256.name`

**`dbl-sha2-256` / `0x56` multihash**: the multihash name

<a name="DblSha2256__code"></a>
### `DblSha2256.code`

**`dbl-sha2-256` / `0x56` multihash**: the multihash code

<a name="DblSha2256__encode____"></a>
### `DblSha2256.encode()`

* `bytes` `(Uint8Array)`: a Uint8Array

* Returns:  `Uint8Array`: a 32-byte digest

**`dbl-sha2-256` / `0x56` multihash**: Encode bytes using the multihash
algorithm, creating raw 32-byte digest _without_ multihash prefix.

<a name="DblSha2256__digest____"></a>
### `DblSha2256.digest()`

* `input` `(Uint8Array)`

* Returns: 

**`dbl-sha2-256` / `0x56` multihash**: Encode bytes using the multihash
algorithm, creating multihash `Digest` (i.e. with multihash prefix).

## License

Licensed under either of

 * Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / http://www.apache.org/licenses/LICENSE-2.0)
 * MIT ([LICENSE-MIT](LICENSE-MIT) / http://opensource.org/licenses/MIT)

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
