import { BitcoinTransaction, fromHashHex, merkle } from 'bitcoin-block'
import { CID, bytes } from 'multiformats'
import * as dblSha2256 from './dbl-sha2-256.js'
import { CODEC_TX, CODEC_TX_CODE, CODEC_WITNESS_COMMITMENT_CODE } from './constants.js'

/**
 * @template T
 * @typedef {import('multiformats/codecs/interface').ByteView<T>} ByteView
*/

const NULL_HASH = new Uint8Array(32)

function _encode (obj, arg) {
  if (typeof obj !== 'object') {
    throw new TypeError('Can only encode() an object')
  }
  const bitcoinTransaction = BitcoinTransaction.fromPorcelain(obj)
  const bytes = bitcoinTransaction.encode(arg)
  return { bitcoinTransaction, bytes }
}

/**
 * @template T
 * @param {T} node
 * @returns {ByteView<T>}
 */
export function encode (obj) {
  return _encode(obj).bytes
}

export function encodeNoWitness (obj) {
  return _encode(obj, BitcoinTransaction.HASH_NO_WITNESS).bytes
}

// TODO: old timey multiformats
function * _encodeAll (deserialized, arg) {
  if (typeof deserialized !== 'object' || !Array.isArray(deserialized.tx)) {
    throw new TypeError('deserialized argument must be a Bitcoin block representation')
  }

  const hashes = []
  for (let ii = 0; ii < deserialized.tx.length; ii++) {
    if (ii === 0 && arg !== BitcoinTransaction.HASH_NO_WITNESS) {
      // for full-witness merkles, the coinbase is replaced with a 0x00.00 hash in the first
      // position, we don't give this a CID+Bytes designation but pretend it's not there on
      // decode
      hashes.push(NULL_HASH)
      continue
    }
    const { transaction, bytes } = _encode(deserialized.tx[ii], arg)
    const mh = dblSha2256.digest(bytes)
    const cid = CID.create(1, CODEC_TX_CODE, mh)
    yield { cid, bytes, transaction } // base tx
    hashes.push(mh.digest)
  }

  for (const { hash, data } of merkle(hashes)) {
    if (data) {
      const mh = dblSha2256.digestFrom(hash)
      const cid = CID.create(1, CODEC_TX_CODE, mh)
      const bytes = new Uint8Array(64)
      bytes.set(data[0], 0)
      bytes.set(data[1], 32)
      yield { cid, bytes } // tx merkle
    }
  }
}

export function encodeAll (obj) {
  return _encodeAll(obj)
}

export function encodeAllNoWitness (obj) {
  return _encodeAll(obj, BitcoinTransaction.HASH_NO_WITNESS)
}

/**
 * @template T
 * @param {ByteView<T>} data
 * @returns {T}
 */
export function decode (data) {
  if (!(data instanceof Uint8Array)) {
    throw new TypeError('Can only decode() a Uint8Array')
  }

  // we don't know whether we're dealing with a real transaciton or a binary merkle node,
  // even if length==64. So we should _try_ to decode the tx to see if it might be one.
  // But, in the witness merkle, the lowest, left-most, non-leaf node contains 32-bytes
  // of leading zeros and this makes the bytes decodeable into transaction form
  let tx
  if (data.length !== 64 || !isNullHash(data.subarray(0, 32))) {
    try {
      tx = BitcoinTransaction.decode(data, true)
      if (data.length === 64 && (tx.vin.length === 0 || tx.vout.length === 0)) {
        // this is almost certainly not a transaction but a binary merkle node with enough leading
        // zeros to fake it
        tx = null
      }
    } catch (err) {
      if (data.length !== 64) {
        throw err
      }
    }
  }

  if (!tx && data.length === 64) {
    // is some kind of merkle node
    let left = data.subarray(0, 32)
    const right = data.subarray(32)
    if (isNullHash(left)) { // in the witness merkle, the coinbase is replaced with 0x00..00
      left = null
    }
    const leftMh = left ? dblSha2256.digestFrom(left) : null
    const rightMh = dblSha2256.digestFrom(right)
    const leftCid = left ? CID.create(1, CODEC_TX_CODE, leftMh) : null
    const rightCid = CID.create(1, CODEC_TX_CODE, rightMh)
    return [leftCid, rightCid]
  }

  const deserialized = tx.toPorcelain()
  if (tx.isCoinbase()) {
    const witnessCommitment = tx.getWitnessCommitment()
    if (witnessCommitment) {
      // NOTE that this may not be correct, it's possible for a tx to appear to have a witness commitment
      // but it's not. A 38 byte vout scriptPubKey can have the correct leading 6 bytes but not be a
      // witness commitment and we can't discriminate at this point -- we can only do that by trying to
      // load the witness commitment from the generated CID
      const witnessCommitmentMh = dblSha2256.digestFrom(witnessCommitment)
      const witnessCommitmentCid = CID.create(1, CODEC_WITNESS_COMMITMENT_CODE, witnessCommitmentMh)
      deserialized.witnessCommitment = witnessCommitmentCid
    }
  }
  for (const vin of deserialized.vin) {
    if (typeof vin.txid === 'string' && /^[0-9a-f]{64}$/.test(vin.txid)) {
      const txidMh = dblSha2256.digestFrom(fromHashHex(vin.txid))
      vin.tx = CID.create(1, CODEC_TX_CODE, txidMh)
    }
  }

  return deserialized
}

export const name = CODEC_TX
export const code = CODEC_TX_CODE

/**
 * Convert a Bitcoin transaction identifier (hash) to a CID. The identifier should be in big-endian form as typically understood by Bitcoin applications.
 *
 * The process of converting to a CID involves reversing the hash (to little-endian form), encoding as a `dbl-sha2-256` multihash and encoding as a `bitcoin-tx` multicodec. This process is reversable, see {@link cidToHash}.
 *
 * @param {string} txHash a string form of a transaction hash
 * @returns {object} A CID (`multiformats.CID`) object representing this transaction identifier.
 */
export function txHashToCID (txHash) {
  if (typeof txHash !== 'string') {
    txHash = bytes.toHex(txHash)
  }
  const digest = dblSha2256.digestFrom(fromHashHex(txHash))
  return CID.create(1, CODEC_TX_CODE, digest)
}

function isNullHash (bytes) {
  if (bytes.length !== 32) {
    return false
  }
  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i] !== 0) {
      return false
    }
  }
  return true
}
