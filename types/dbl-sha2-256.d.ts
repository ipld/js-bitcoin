export const name: "dbl-sha2-256";
export const code: 86;
/**
 * @param {Uint8Array} bytes a Uint8Array
 * @returns {Uint8Array} a 32-byte digest
 */
export const encode: typeof dblSha2256;
export function digest(input: Uint8Array): import('multiformats/hashes/interface').MultihashDigest<typeof code>;
export function digestFrom(encoded: Uint8Array): import('multiformats/hashes/interface').MultihashDigest<typeof code>;
import { dblSha2256 } from "bitcoin-block";
//# sourceMappingURL=dbl-sha2-256.d.ts.map