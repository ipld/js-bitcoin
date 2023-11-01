/**
 * @typedef {import('multiformats/link').Link} Link
 */
/** @typedef {import('bitcoin-block/interface').BlockPorcelain} BlockPorcelain */
/**
 * Instantiate a full object form from a full Bitcoin block graph binary representation. This binary form is typically extracted from a Bitcoin network node, such as with the Bitcoin Core `bitcoin-cli` `getblock <identifier> 0` command (which outputs hexadecimal form and therefore needs to be decoded prior to handing to this function). This full binary form can also be obtained from the utility {@link assemble} function which can construct the full graph form of a Bitcoin block from the full IPLD block graph.
 *
 * The object returned, if passed through `JSON.stringify()` should be identical to the JSON form provided by the Bitcoin Core `bitcoin-cli` `getblock <identifier> 2` command (minus some chain-context elements that are not possible to derive without the full blockchain).
 *
 * @name Bitcoin.deserializeFullBitcoinBytes()
 * @param {Uint8Array} bytes a binary form of a Bitcoin block graph
 * @returns {BlockPorcelain} an object representation of the full Bitcoin block graph
 * @function
 */
export function deserializeFullBitcoinBytes(bytes: Uint8Array): BlockPorcelain;
/**
 * Encode a full object form of a Bitcoin block graph into its binary
 * equivalent. This is the inverse of
 * {@link Bitcoin.deserializeFullBitcoinBytes()} and should produce the exact
 * binary representation of a Bitcoin block graph given the complete input.
 *
 * The object form must include both the header and full transaction (including
 * witness data) data for it to be properly serialized.
 *
 * As of writing, the witness merkle nonce is not currently present in the JSON
 * output from Bitcoin Core's `bitcoin-cli`. See
 * https://github.com/bitcoin/bitcoin/pull/18826 for more information. Without
 * this nonce, the exact binary form cannot be fully generated.
 *
 * @name Bitcoin.serializeFullBitcoinBytes()
 * @param {BlockPorcelain} obj a full JavaScript object form of a Bitcoin block graph
 * @returns {Uint8Array} a binary form of the Bitcoin block graph
 * @function
 */
export function serializeFullBitcoinBytes(obj: BlockPorcelain): Uint8Array;
/**
 * Convert a CID to a Bitcoin block or transaction identifier. This process is
 * the reverse of `blockHashToCID()` and `txHashToCID()` and involves extracting
 * and decoding the multihash from the CID, reversing the bytes and presenting
 * it as a big-endian hexadecimal string.
 *
 * Works for both block identifiers and transaction identifiers.
 *
 * @name Bitcoin.cidToHash()
 * @param {Link|string} cid a CID
 * @returns {string} a hexadecimal big-endian representation of the identifier.
 * @function
 */
export function cidToHash(cid: Link | string): string;
export const blockHashToCID: typeof block.blockHashToCID;
export const txHashToCID: typeof tx.txHashToCID;
export type Link = import('multiformats/link').Link;
export type BlockPorcelain = import('bitcoin-block/interface').BlockPorcelain;
import * as block from "./bitcoin-block.js";
import * as tx from "./bitcoin-tx.js";
//# sourceMappingURL=util.d.ts.map