/**
 * @template T
 * @typedef {import('multiformats/codecs/interface').ByteView<T>} ByteView
*/
/**
 * @typedef {import('./interface').BitcoinHeader} BitcoinHeader
 */
/**
 * @param {BitcoinHeader} node
 * @returns {ByteView<BitcoinHeader>}
 */
export function encode(node: BitcoinHeader): ByteView<BitcoinHeader>;
/**
 * @param {ByteView<BitcoinHeader>} data
 * @returns {BitcoinHeader}
 */
export function decode(data: ByteView<BitcoinHeader>): BitcoinHeader;
/**
 * Convert a Bitcoin block identifier (hash) to a CID. The identifier should be in big-endian form, i.e. with leading zeros.
 *
 * The process of converting to a CID involves reversing the hash (to little-endian form), encoding as a `dbl-sha2-256` multihash and encoding as a `bitcoin-block` multicodec. This process is reversable, see {@link cidToHash}.
 *
 * @param {string} blockHash a string form of a block hash
 * @returns {CID} a CID object representing this block identifier.
 */
export function blockHashToCID(blockHash: string): CID;
export const name: "bitcoin-block";
export const code: 176;
export type ByteView<T> = import('multiformats/codecs/interface').ByteView<T>;
export type BitcoinHeader = import('./interface').BitcoinHeader;
import { CID } from "multiformats";
//# sourceMappingURL=bitcoin-block.d.ts.map