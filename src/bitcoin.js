import { CID } from 'multiformats/cid'
import { BitcoinBlock, toHashHex } from 'bitcoin-block'
import * as dblSha2256 from './dbl-sha2-256.js'
import * as block from './bitcoin-block.js'
import * as tx from './bitcoin-tx.js'
import * as witnessCommitment from './bitcoin-witness-commitment.js'
import { encodeAll, assemble } from './complete.js'

/**
 * Instantiate a full object form from a full Bitcoin block graph binary representation. This binary form is typically extracted from a Bitcoin network node, such as with the Bitcoin Core `bitcoin-cli` `getblock <identifier> 0` command (which outputs hexadecimal form and therefore needs to be decoded prior to handing to this function). This full binary form can also be obtained from the utility {@link assemble} function which can construct the full graph form of a Bitcoin block from the full IPLD block graph.
 *
 * The object returned, if passed through `JSON.stringify()` should be identical to the JSON form provided by the Bitcoin Core `bitcoin-cli` `getblock <identifier> 2` command (minus some chain-context elements that are not possible to derive without the full blockchain).
 *
 * @param {Uint8Array|Buffer} bytes a binary form of a Bitcoin block graph
 * @returns {object} an object representation of the full Bitcoin block graph
 * @function
 */
export function deserializeFullBitcoinBytes (bytes) {
  return BitcoinBlock.decode(bytes).toPorcelain()
}

/**
 * Encode a full object form of a Bitcoin block graph into its binary equivalent. This is the inverse of {@link deserializeFullBitcoinBytes} and should produce the exact binary representation of a Bitcoin block graph given the complete input.
 *
 * The object form must include both the header and full transaction (including witness data) data for it to be properly serialized.
 *
 * As of writing, the witness merkle nonce is not currently present in the JSON output from Bitcoin Core's `bitcoin-cli`. See https://github.com/bitcoin/bitcoin/pull/18826 for more information. Without this nonce, the exact binary form cannot be fully generated.
 *
 * @param {object} obj a full JavaScript object form of a Bitcoin block graph
 * @returns {Buffer} a binary form of the Bitcoin block graph
 * @function
 */
export function serializeFullBitcoinBytes (obj) {
  return BitcoinBlock.fromPorcelain(obj).encode()
}

/**
 * Convert a CID to a Bitcoin block or transaction identifier. This process is the reverse of {@link blockHashToCID} and {@link txHashToCID} and involves extracting and decoding the multihash from the CID, reversing the bytes and presenting it as a big-endian hexadecimal string.
 *
 * Works for both block identifiers and transaction identifiers.
 *
 * @param {object} cid a CID
 * @returns {string} a hexadecimal big-endian representation of the identifier.
 * @function
 */
export function cidToHash (cid) {
  if (typeof cid === 'string') {
    cid = CID.parse(cid)
  }
  cid = CID.asCID(cid)
  const { digest } = cid.multihash
  return toHashHex(digest)
}

export {
  dblSha2256,
  block,
  tx,
  witnessCommitment,
  assemble,
  encodeAll
}
export const blockHashToCID = block.blockHashToCID
export const txHashToCID = tx.txHashToCID
