import { dblSha2256 } from 'bitcoin-block'
import * as Digest from 'multiformats/hashes/digest'
import { HASH_ALG, HASH_ALG_CODE } from './constants.js'

export const name = HASH_ALG
export const code = HASH_ALG_CODE

/**
 * @param {Uint8Array} bytes a Uint8Array
 * @returns {Uint8Array} a 32-byte digest
 */
export const encode = dblSha2256

/**
 * @param {Uint8Array} input
 * @returns {import('multiformats/hashes/interface').MultihashDigest<typeof code>}
 */
export const digest = (input) => {
  return digestFrom(encode(input))
}

/**
 * @param {Uint8Array} encoded
 * @returns {import('multiformats/hashes/interface').MultihashDigest<typeof code>}
 */
export const digestFrom = (encoded) => {
  return Digest.create(code, encoded)
}
