import { BitcoinTransaction } from 'bitcoin-block'
import { CID } from 'multiformats'
import * as dblSha2256 from './dbl-sha2-256.js'
import { CODEC_TX, CODEC_TX_CODE, CODEC_WITNESS_COMMITMENT, CODEC_WITNESS_COMMITMENT_CODE } from './constants.js'

/**
 * @template T
 * @typedef {import('multiformats/codecs/interface').ByteView<T>} ByteView
*/
/** @typedef {import('bitcoin-block/classes/Block').BlockPorcelain} BlockPorcelain */
/** @typedef {import('./interface').BitcoinWitnessCommitment} BitcoinWitnessCommitment */

/** @ignore */
const NULL_HASH = new Uint8Array(32)

/*
 * type BitcoinWitnessCommitment struct {
 *   witnessMerkleRoot &BitcoinTransaction
 *   nonce Bytes
 * }
 *
 */

/**
 * @param {import('bitcoin-block/classes/Block').BlockPorcelain} deserialized
 * @param {CID|null} witnessMerkleRoot
 * @returns {{cid:CID, bytes:Uint8Array}|null}
 * @ignore
 */
export function encodeWitnessCommitment (deserialized, witnessMerkleRoot) {
  if (typeof deserialized !== 'object' || !Array.isArray(deserialized.tx)) {
    throw new TypeError('deserialized argument must be a Bitcoin block representation')
  }

  if (witnessMerkleRoot !== null && !(witnessMerkleRoot instanceof Uint8Array) && !CID.asCID(witnessMerkleRoot)) {
    throw new TypeError('witnessMerkleRoot must be a Uint8Array or CID')
  }

  let merkleRootHash
  if (witnessMerkleRoot === null) {
    // block has single tx, the coinbase, and it gets a NULL in the merkle, see bitcoin-tx for
    // why this is missing and explicitly `null`
    merkleRootHash = NULL_HASH
  } else if (witnessMerkleRoot instanceof Uint8Array) {
    merkleRootHash = witnessMerkleRoot
  } else {
    // CID
    const mrhcid = CID.asCID(witnessMerkleRoot)
    if (mrhcid == null) {
      throw new TypeError('Expected witnessMerkleRoot to be a CID')
    }
    merkleRootHash = mrhcid.multihash.digest
  }

  if (typeof deserialized.tx[0] !== 'object') {
    throw new TypeError('Can only encode from a complete bitcoin block (complete transactions)')
  }

  const coinbase = BitcoinTransaction.fromPorcelain(deserialized.tx[0])

  if (!coinbase.isCoinbase()) {
    throw new Error('Could not decode coinbase from deserialized data')
  }
  if (!coinbase.segWit) {
    return null
  }

  // the hash we should get at the end, for sanity, but we have to go through the
  // additional effort just to get the binary form of it
  const expectedWitnessCommitment = coinbase.getWitnessCommitment()
  if (expectedWitnessCommitment == null) {
    throw new TypeError('Expected a witness commitment in the segwit coinbase, did not find one')
  }

  const nonce = coinbase.getWitnessCommitmentNonce()
  if (nonce == null) {
    throw new TypeError('Expected a witness commitment nonce in the segwit coinbase, did not find one')
  }
  const bytes = new Uint8Array(64)
  bytes.set(merkleRootHash, 0)
  bytes.set(nonce, 32)

  const hash = dblSha2256.encode(bytes)

  if (!isSameBytes(hash, expectedWitnessCommitment)) {
    throw new Error('Generated witnessCommitment does not match the expected witnessCommitment in the coinbase')
  }

  const mh = dblSha2256.digestFrom(hash)
  const cid = CID.create(1, CODEC_WITNESS_COMMITMENT_CODE, mh)

  return { cid, bytes }
}

/**
 * **`bitcoin-witness-commitment` / `0xb2` codec**: Encodes an IPLD node
 * representing a Bitcoin witness commitment object into byte form.
 *
 * The object is expected to be in the form
 * `{witnessMerkleRoot:CID, nonce:Uint8Array}` where the `witnessMerkleRoot`
 * may be null.
 *
 *
 * @name BitcoinWitnessCommitment.encode()
 * @param {BitcoinWitnessCommitment} node
 * @returns {ByteView<BitcoinWitnessCommitment>}
 */
export function encode (node) {
  if (typeof node !== 'object') {
    throw new TypeError('bitcoin-witness-commitment must be an object')
  }
  if (!(node.nonce instanceof Uint8Array)) {
    throw new TypeError('bitcoin-witness-commitment must have a `nonce` Uint8Array')
  }
  const witnessMerkleRoot = CID.asCID(node.witnessMerkleRoot)
  if (!witnessMerkleRoot) {
    throw new TypeError('bitcoin-witness-commitment must have a `witnessMerkleRoot` CID')
  }
  if (node.witnessMerkleRoot !== null && node.witnessMerkleRoot.code !== CODEC_TX_CODE) {
    throw new TypeError(`bitcoin-witness-commitment \`witnessMerkleRoot\` must be of type \`${CODEC_TX}\``)
  }
  // nonce + multihash decode
  const encoded = new Uint8Array(64)
  if (node.witnessMerkleRoot !== null) {
    encoded.set(witnessMerkleRoot.multihash.digest, 0)
  }
  encoded.set(node.nonce, 32)
  return encoded
}

/**
 * **`bitcoin-witness-commitment` / `0xb2` codec**: Decodes a bytes form of a
 * Bitcoin witness commitment into an IPLD node representation.
 *.
 *
 * The returned object will be in the form
 * `{witnessMerkleRoot:CID, nonce:Uint8Array}` where the `witnessMerkleRoot`
 * may be null.
 *
 * @name BitcoinWitnessCommitment.decode()
 * @param {ByteView<BitcoinWitnessCommitment>} data
 * @returns {BitcoinWitnessCommitment}
 */
export function decode (data) {
  if (!(data instanceof Uint8Array && data.constructor.name === 'Uint8Array')) {
    throw new TypeError('Can only decode() a Uint8Array')
  }
  if (data.length !== 64) {
    throw new TypeError('bitcoin-witness-commitment must be a 64-byte Uint8Array')
  }
  const witnessHash = data.subarray(0, 32)
  const nonce = data.subarray(32)

  let witnessMerkleRoot = null
  if (!isNullHash(witnessHash)) {
    const witnessDigest = dblSha2256.digestFrom(witnessHash)
    witnessMerkleRoot = CID.create(1, CODEC_TX_CODE, witnessDigest)
  }
  return { witnessMerkleRoot, nonce }
}

/**
 * **`bitcoin-witness-commitment` / `0xb2` codec**: the codec name
 * @name BitcoinWitnessCommitment.name
 */
export const name = CODEC_WITNESS_COMMITMENT
/**
 * **`bitcoin-witness-commitment` / `0xb2` codec**: the codec code
 * @name BitcoinWitnessCommitment.code
 */
export const code = CODEC_WITNESS_COMMITMENT_CODE

/**
 * @param {Uint8Array} bytes
 * @returns {boolean}
 * @ignore
 */
function isNullHash (bytes) {
  return isSameBytes(bytes, NULL_HASH)
}

/**
 * @param {Uint8Array} bytes1
 * @param {Uint8Array} bytes2
 * @returns {boolean}
 * @ignore
 */
function isSameBytes (bytes1, bytes2) {
  if (bytes1.length !== bytes2.length) {
    return false
  }
  for (let i = 0; i < bytes1.length; i++) {
    if (bytes1[i] !== bytes2[i]) {
      return false
    }
  }
  return true
}
