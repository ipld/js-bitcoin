import { BitcoinBlock, fromHashHex } from 'bitcoin-block'
import { bytes } from 'multiformats'
import { CID } from 'multiformats/cid'
import * as dblSha2256 from './dbl-sha2-256.js'
import { CODEC_BLOCK, CODEC_BLOCK_CODE, CODEC_TX_CODE } from './constants.js'

/**
 * @template T
 * @typedef {import('multiformats/codecs/interface').ByteView<T>} ByteView
*/

/** @typedef {import('./interface').BitcoinHeader} BitcoinHeader */
/** @typedef {import('./interface').BitcoinBlockCID} BitcoinBlockCID */

/**
 * **`bitcoin-block` / `0xb0` codec**: Encodes an IPLD node representing a
 * Bitcoin header object into byte form.
 *
 * @param {BitcoinHeader} node
 * @returns {ByteView<BitcoinHeader>}
 * @name BitcoinBlock.encode()
 */
export function encode (node) {
  if (typeof node !== 'object') {
    throw new TypeError('Can only encode() an object')
  }
  const porc = Object.assign({}, node, { tx: null })
  return BitcoinBlock.fromPorcelain(porc).encode()
}

/**
 * **`bitcoin-block` / `0xb0` codec**: Decodes a bytes form of a Bitcoin header
 * into an IPLD node representation.
 *
 * @param {ByteView<BitcoinHeader>} data
 * @returns {BitcoinHeader}
 * @name BitcoinBlock.decode()
 */
export function decode (data) {
  if (!(data instanceof Uint8Array)) {
    throw new TypeError('Can only decode() a Uint8Array')
  }

  const deserialized = /** @type {any} */ (BitcoinBlock.decodeHeaderOnly(data, true).toPorcelain())

  // insert links derived from native hash hex strings
  if (deserialized.previousblockhash) {
    const parentDigest = dblSha2256.digestFrom(fromHashHex(deserialized.previousblockhash))
    deserialized.parent = CID.create(1, CODEC_BLOCK_CODE, parentDigest)
  } else {
    // genesis
    deserialized.parent = null
  }
  const txDigest = dblSha2256.digestFrom(fromHashHex(deserialized.merkleroot))
  deserialized.tx = CID.create(1, CODEC_TX_CODE, txDigest)

  return deserialized
}

/**
 * **`bitcoin-block` / `0xb0` codec**: the codec name
 * @name BitcoinBlock.name
 */
export const name = CODEC_BLOCK
/**
 * **`bitcoin-block` / `0xb0` codec**: the codec code
 * @name BitcoinBlock.code
 */
export const code = CODEC_BLOCK_CODE

/**
 * Convert a Bitcoin block identifier (hash) to a CID. The identifier should be in big-endian form, i.e. with leading zeros.
 *
 * The process of converting to a CID involves reversing the hash (to little-endian form), encoding as a `dbl-sha2-256` multihash and encoding as a `bitcoin-block` multicodec. This process is reversable, see {@link cidToHash}.
 *
 * @param {string} blockHash a string form of a block hash
 * @returns {BitcoinBlockCID} a CID object representing this block identifier.
 * @name BitcoinBlock.blockHashToCID()
 */
export function blockHashToCID (blockHash) {
  if (typeof blockHash !== 'string') {
    blockHash = bytes.toHex(blockHash)
  }
  const digest = dblSha2256.digestFrom(fromHashHex(blockHash))
  return CID.create(1, CODEC_BLOCK_CODE, digest)
}
