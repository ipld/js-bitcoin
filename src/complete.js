import { bytes } from 'multiformats'
import { CID } from 'multiformats/cid'
import { BitcoinBlock, BitcoinTransaction as BitcoinBlockTransaction } from 'bitcoin-block'
import * as bitcoinBlockCodec from './bitcoin-block.js'
import * as bitcoinTxCodec from './bitcoin-tx.js'
import * as bitcoinWitnessCommitmentCodec from './bitcoin-witness-commitment.js'
import * as dblSha256 from './dbl-sha2-256.js'
import { SEGWIT_BLOCKTIME } from './constants.js'

const { toHex } = bytes

/** @typedef {import('bitcoin-block/interface').BlockPorcelain} BlockPorcelain */
/** @typedef {import('bitcoin-block/interface').TransactionPorcelain} TransactionPorcelain */
/** @typedef {import('./interface').IPLDLoader} IPLDLoader */
/** @typedef {import('./interface').BitcoinTransaction} BitcoinTransaction */
/** @typedef {import('./interface').BitcoinTransactionMerkleNode} BitcoinTransactionMerkleNode */
/** @typedef {import('./interface').BitcoinBlockCID} BitcoinBlockCID */
/** @typedef {import('./interface').BitcoinTxCID} BitcoinTxCID */
/** @typedef {import('./interface').BitcoinWitnessCommitmentCID} BitcoinWitnessCommitmentCID */

/**
 * @param {any} obj
 * @returns {{cid:BitcoinBlockCID, bytes:Uint8Array}}
 * @ignore
 */
function mkblock (obj) {
  const bytes = bitcoinBlockCodec.encode(obj)
  const mh = dblSha256.digest(bytes)
  return {
    cid: CID.create(1, bitcoinBlockCodec.code, mh),
    bytes
  }
}

/**
 * Encodes a full Bitcoin block, as presented in `BlockPorcelain` form (which is
 * available as JSON output from the `bitcoin-cli` tool—see the `bitcoin-block`
 * npm package for more information) into its constituent IPLD blocks. This
 * includes the header, the transaction merkle intermediate nodes, the
 * transactions and SegWit forms of the transaction merkle and nodes if present
 * along with the witness commitment block if required.
 *
 * @name Bitcoin.encodeAll()
 * @param {BlockPorcelain} block
 * @returns {IterableIterator<{cid: BitcoinBlockCID|BitcoinTxCID|BitcoinWitnessCommitmentCID, bytes: Uint8Array}>}
 */
export function * encodeAll (block) {
  if (typeof block !== 'object' || !Array.isArray(block.tx)) {
    throw new TypeError('Can only encode a complete bitcoin block (header and complete transactions)')
  }
  for (const tx of block.tx) {
    if (typeof tx !== 'object') {
      throw new TypeError('Can only encode a complete bitcoin block (header and complete transactions)')
    }
  }
  const cidSet = new Set()
  const counts = {
    blocks: 1, // header
    tx: 0,
    witTx: 0,
    txMerkle: 0,
    witTxMerkle: 0,
    duplicates: 0
  }

  // header
  yield mkblock(block)
  counts.blocks++

  // transactions in segwit merkle
  for (const { cid, bytes } of bitcoinTxCodec.encodeAllNoWitness(block)) {
    if (cidSet.has(cid.toString())) {
      counts.duplicates++
      continue
    }
    cidSet.add(cid.toString())
    yield { cid, bytes }
    counts.blocks++
    if (bytes.length !== 64) {
      counts.tx++
    } else {
      counts.txMerkle++
    }
  }

  const segWit = BitcoinBlockTransaction.isPorcelainSegWit(
    /**
      *@type {TransactionPorcelain}
      * @ignore
      */
    (block.tx[0]))
  if (!segWit) {
    // console.log(counts)
    return
  }

  let lastCid
  for (const { cid, bytes } of bitcoinTxCodec.encodeAll(block)) {
    lastCid = cid
    if (cidSet.has(cid.toString())) {
      counts.duplicates++
      continue
    }
    cidSet.add(cid.toString())
    yield { cid, bytes }
    counts.blocks++
    if (bytes.length !== 64) {
      counts.witTx++
    } else {
      counts.witTxMerkle++
    }
  }

  if (!lastCid) {
    if (block.tx.length === 1) {
      lastCid = null
    } else {
      throw new Error('Unexpected missing witnessMerkleRoot!')
    }
  }

  const witcom = bitcoinWitnessCommitmentCodec.encodeWitnessCommitment(block, lastCid)
  if (witcom) {
    yield witcom
  }
  // counts.blocks++
  // console.log(counts)
}

/**
 * Given a CID for a `bitcoin-block` Bitcoin block header and an IPLD block
 * loader that can retrieve Bitcoin IPLD blocks by CID, re-assemble a full
 * Bitcoin block graph into both object and binary forms. This is the inverse
 * of the {@link Bitcoin.encodeAll()} function in that it puts the
 * `BitcoinPorcelain` back together. A JSON form of this output should match
 * the output provided by `bitcoin-cli` (with some possible minor differences).
 *
 * The loader should be able to return the binary form for `bitcoin-block`,
 * `bitcoin-tx` and `bitcoin-witness-commitment` CIDs.
 *
 * @param {IPLDLoader} loader an IPLD block loader function that takes a CID argument and returns a `Uint8Array` containing the binary block data for that CID
 * @param {BitcoinBlockCID} blockCid a CID of type `bitcoin-block` pointing to the Bitcoin block header for the block to be assembled
 * @returns {Promise<{deserialized:BlockPorcelain, bytes:Uint8Array}>} an object containing two properties, `deserialized` and `bytes` where `deserialized` contains a full JavaScript instantiation of the Bitcoin block graph and `bytes` contains a `Uint8Array` with the binary representation of the graph.
 * @name Bitcoin.assemble()
 */
export async function assemble (loader, blockCid) {
  /**
   * @type {Record<string, BitcoinTransaction|BitcoinTransactionMerkleNode>}
   * @ignore
   */
  const merkleCache = {}
  /**
   * @param {BitcoinTxCID} txCid
   * @returns {Promise<BitcoinTransaction|BitcoinTransactionMerkleNode>}
   * @ignore
   */
  async function loadTx (txCid) {
    const txCidStr = txCid.toString()
    if (merkleCache[txCidStr]) {
      return merkleCache[txCidStr]
    }
    const node = bitcoinTxCodec.decode(await loader(txCid))
    merkleCache[txCidStr] = node
    return node
  }

  const block = /** @type {any} */ (bitcoinBlockCodec.decode(await loader(blockCid)))
  let merkleRootCid = block.tx

  const coinbase = await (async () => {
    // find the coinbase
    let txCid = merkleRootCid
    let node
    while (true) {
      node = await loadTx(txCid)
      if (Array.isArray(node)) { // merkle node
        txCid = node[0]
      } else { // transaction
        return /** @type {BitcoinTransaction} */ (node)
      }
    }
  })()

  /**
   * @param {BitcoinTxCID} txCid
   * @returns {AsyncIterableIterator<BitcoinTransaction|BitcoinTransactionMerkleNode>}
   * @ignore
   */
  async function * transactions (txCid) {
    const node = await loadTx(txCid)
    if (Array.isArray(node)) {
      if (node[0] !== null) { // coinbase will be missing for witness merkle
        yield * transactions(node[0])
      }
      if (node[0] === null || !node[0].equals(node[1])) { // wonky btc merkle rules
        yield * transactions(node[1])
      }
    } else {
      yield node
    }
  }

  const txs = []

  // time in the header, since we have it, is the best way of identifying segwit blocks.
  // there are older blocks that can look like they have a witnessCommitment but, in fact, don't, and
  // even if you tried to load the witness merkle from that witnessCommitment you may even find one,
  // although this is only (likely?) the case with blocks that only have a coinbase and therefore a
  // null witness merkle, which some post-segwit blocks have so will generate the same witness merkle
  // root
  if (block.time >= SEGWIT_BLOCKTIME && coinbase.witnessCommitment) {
    const witnessCommitment = bitcoinWitnessCommitmentCodec.decode(await loader(coinbase.witnessCommitment))

    // insert the nonce into the coinbase
    coinbase.vin[0].txinwitness = [toHex(witnessCommitment.nonce)]
    // nullify the hash so txid!==hash and BitcoinBlockTransaction.fromPorcelain() will interpret it as a segwit
    coinbase.hash = ''.padStart(64, '0')

    if (witnessCommitment.witnessMerkleRoot !== null) {
      // push the coinbase in as tx 0 since the witness merkle doesn't contain the coinbase
      txs.push(coinbase)
      merkleRootCid = witnessCommitment.witnessMerkleRoot
    } // else this is a special case of a segwit block with _only  a coinbase
  }

  for await (const tx of transactions(merkleRootCid)) {
    txs.push(tx)
  }

  block.tx = txs
  block.nTx = txs.length

  const bb = BitcoinBlock.fromPorcelain(/** @type {BlockPorcelain} */ (block))
  return {
    deserialized: /** @type {BlockPorcelain} */ (bb.toPorcelain()),
    bytes: bb.encode()
  }
}
