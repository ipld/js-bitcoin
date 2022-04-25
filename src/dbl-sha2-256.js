import { dblSha2256 } from 'bitcoin-block'
import * as Digest from 'multiformats/hashes/digest'
import { HASH_ALG, HASH_ALG_CODE } from './constants.js'

/**
 * **`dbl-sha2-256` / `0x56` multihash**: the multihash name
 * @name DblSha2256.name
 */
export const name = HASH_ALG
/**
 * **`dbl-sha2-256` / `0x56` multihash**: the multihash code
 * @name DblSha2256.code
 */
export const code = HASH_ALG_CODE

/**
 * **`dbl-sha2-256` / `0x56` multihash**: Encode bytes using the multihash
 * algorithm, creating raw 32-byte digest _without_ multihash prefix.
 *
 * @name DblSha2256.encode()
 * @param {Uint8Array} bytes a Uint8Array
 * @returns {Uint8Array} a 32-byte digest
 */
export const encode = dblSha2256

/**
 * **`dbl-sha2-256` / `0x56` multihash**: Encode bytes using the multihash
 * algorithm, creating multihash `Digest` (i.e. with multihash prefix).
 *
 * @name DblSha2256.digest()
 * @param {Uint8Array} input
 * @returns {import('multiformats/hashes/interface').MultihashDigest<typeof code>}
 */
export const digest = (input) => {
  return digestFrom(encode(input))
}

/**
 * @param {Uint8Array} encoded
 * @returns {import('multiformats/hashes/interface').MultihashDigest<typeof code>}
 * @ignore
 */
export const digestFrom = (encoded) => {
  return Digest.create(code, encoded)
}
