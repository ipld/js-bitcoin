/**
 * **`dbl-sha2-256` / `0x56` multihash**: the multihash name
 * @name DblSha2256.name
 */
export const name: "dbl-sha2-256";
/**
 * **`dbl-sha2-256` / `0x56` multihash**: the multihash code
 * @name DblSha2256.code
 */
export const code: 86;
/**
 * **`dbl-sha2-256` / `0x56` multihash**: Encode bytes using the multihash
 * algorithm, creating raw 32-byte digest _without_ multihash prefix.
 *
 * @name DblSha2256.encode()
 * @param {Uint8Array} bytes a Uint8Array
 * @returns {Uint8Array} a 32-byte digest
 */
export const encode: typeof dblSha2256;
export function digest(input: Uint8Array): import('multiformats/hashes/interface').MultihashDigest<typeof code>;
export function digestFrom(encoded: Uint8Array): import('multiformats/hashes/interface').MultihashDigest<typeof code>;
import { dblSha2256 } from "bitcoin-block";
//# sourceMappingURL=dbl-sha2-256.d.ts.map