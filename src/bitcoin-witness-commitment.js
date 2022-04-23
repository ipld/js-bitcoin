import { BitcoinTransaction } from 'bitcoin-block'
import { CID } from 'multiformats'
import * as dblSha2256 from './dbl-sha2-256.js'
import { CODEC_TX, CODEC_TX_CODE, CODEC_WITNESS_COMMITMENT, CODEC_WITNESS_COMMITMENT_CODE } from './constants.js'

/**
 * @template T
 * @typedef {import('multiformats/codecs/interface').ByteView<T>} ByteView
*/

const NULL_HASH = new Uint8Array(32)

/*
 * type BitcoinWitnessCommitment struct {
 *   witnessMerkleRoot &BitcoinTransaction
 *   nonce Bytes
 * }
 *
 */

export function encodeWitnessCommitment (deserialized, witnessMerkleRoot) {
  if (typeof deserialized !== 'object' || !Array.isArray(deserialized.tx)) {
    throw new TypeError('deserialized argument must be a Bitcoin block representation')
  }

  if (witnessMerkleRoot !== null && !(witnessMerkleRoot instanceof Uint8Array) && !CID.asCID(witnessMerkleRoot)) {
    throw new TypeError('witnessMerkleRoot must be a Buffer or CID')
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
    merkleRootHash = CID.asCID(witnessMerkleRoot).multihash.digest
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

  const nonce = coinbase.getWitnessCommitmentNonce()
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
 * @template T
 * @param {T} node
 * @returns {ByteView<T>}
 */
export function encode (obj) {
  if (typeof obj !== 'object') {
    throw new TypeError('bitcoin-witness-commitment must be an object')
  }
  if (!(obj.nonce instanceof Uint8Array)) {
    throw new TypeError('bitcoin-witness-commitment must have a `nonce` Buffer')
  }
  const witnessMerkleRoot = CID.asCID(obj.witnessMerkleRoot)
  if (!witnessMerkleRoot) {
    throw new TypeError('bitcoin-witness-commitment must have a `witnessMerkleRoot` CID')
  }
  if (obj.witnessMerkleRoot.code !== CODEC_TX_CODE) {
    throw new TypeError(`bitcoin-witness-commitment \`witnessMerkleRoot\` must be of type \`${CODEC_TX}\``)
  }
  // nonce + multihash decode
  const witnessHash = witnessMerkleRoot.multihash.digest
  const encoded = new Uint8Array(64)
  encoded.set(witnessHash, 0)
  encoded.set(obj.nonce, 32)
  return encoded
}

/**
 * @template T
 * @param {ByteView<T>} data
 * @returns {T}
 */
export function decode (data) {
  if (!(data instanceof Uint8Array && data.constructor.name === 'Uint8Array')) {
    throw new TypeError('Can only decode() a Buffer or Uint8Array')
  }
  if (data.length !== 64) {
    throw new TypeError('bitcoin-witness-commitment must be a 64-byte Buffer')
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

export const name = CODEC_WITNESS_COMMITMENT
export const code = CODEC_WITNESS_COMMITMENT_CODE

function isNullHash (bytes) {
  return isSameBytes(bytes, NULL_HASH)
}

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
