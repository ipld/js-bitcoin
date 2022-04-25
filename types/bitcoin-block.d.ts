/**
 * @template T
 * @typedef {import('multiformats/codecs/interface').ByteView<T>} ByteView
*/
/**
 * @typedef {import('./interface').BitcoinHeader} BitcoinHeader
 */
/**
 * **`bitcoin-block` / `0xb0` codec**: Encodes an IPLD node representing a
 * Bitcoin header object into byte form.
 *
 * @param {BitcoinHeader} node
 * @returns {ByteView<BitcoinHeader>}
 * @name BitcoinBlock.encode()
 */
export function encode(node: BitcoinHeader): ByteView<BitcoinHeader>;
/**
 * **`bitcoin-block` / `0xb0` codec**: Decodes a bytes form of a Bitcoin header
 * into an IPLD node representation.
 *
 * @param {ByteView<BitcoinHeader>} data
 * @returns {BitcoinHeader}
 * @name BitcoinBlock.decode()
 */
export function decode(data: ByteView<BitcoinHeader>): BitcoinHeader;
/**
 * Convert a Bitcoin block identifier (hash) to a CID. The identifier should be in big-endian form, i.e. with leading zeros.
 *
 * The process of converting to a CID involves reversing the hash (to little-endian form), encoding as a `dbl-sha2-256` multihash and encoding as a `bitcoin-block` multicodec. This process is reversable, see {@link cidToHash}.
 *
 * @param {string} blockHash a string form of a block hash
 * @returns {CID} a CID object representing this block identifier.
 * @name BitcoinBlock.blockHashToCID()
 */
export function blockHashToCID(blockHash: string): CID;
/**
 * **`bitcoin-block` / `0xb0` codec**: the codec name
 * @name BitcoinBlock.name
 */
export const name: "bitcoin-block";
/**
 * **`bitcoin-block` / `0xb0` codec**: the codec code
 * @name BitcoinBlock.code
 */
export const code: 176;
export type ByteView<T> = import('multiformats/codecs/interface').ByteView<T>;
export type BitcoinHeader = import('./interface').BitcoinHeader;
import { CID } from "multiformats";
//# sourceMappingURL=bitcoin-block.d.ts.map