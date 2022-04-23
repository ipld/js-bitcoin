import { CID, bytes } from 'multiformats'
import * as Digest from 'multiformats/hashes/digest'
import { fromHashHex } from 'bitcoin-block'
import * as fixtures from './fixtures.js'

export const CODEC_TX_CODE = 0xb1
const CODEC_WITNESS_COMMITMENT_CODE = 0xb2
// the begining of a dbl-sha2-256 multihash, prepend to hash or txid
const MULTIHASH_DBLSHA2256_LEAD = '5620'

export function txHashToCid (hash) {
  return CID.create(1, CODEC_TX_CODE, Digest.decode(bytes.fromHex(`${MULTIHASH_DBLSHA2256_LEAD}${hash}`)))
}

export function witnessCommitmentHashToCid (hash) {
  return CID.create(1, CODEC_WITNESS_COMMITMENT_CODE, Digest.decode(bytes.fromHex(`${MULTIHASH_DBLSHA2256_LEAD}${hash}`)))
}

export function cleanBlock (block) {
  block = Object.assign({}, block)
  // chain-context data that can't be derived
  'confirmations chainwork height mediantime nextblockhash'.split(' ').forEach((p) => delete block[p])
  return block
}

// round difficulty to 2 decimal places, it's a calculated value
export function roundDifficulty (obj) {
  const ret = Object.assign({}, obj)
  ret.difficulty = Math.round(obj.difficulty * 100) / 100
  return ret
}

function blockDataToHeader (block) {
  const header = cleanBlock(block)
  // data that can't be derived without transactions
  'tx nTx size strippedsize weight'.split(' ').forEach((p) => delete header[p])
  return header
}

let blocks = null
export async function setupBlocks () {
  if (blocks) {
    return blocks
  }
  blocks = {}

  for (const name of fixtures.names) {
    blocks[name] = await fixtures.loadFixture(name)
    blocks[name].expectedHeader = blockDataToHeader(blocks[name].data)
    blocks[name].expectedHeader.parent = blocks[name].meta.parentCid ? CID.parse(blocks[name].meta.parentCid) : null
    blocks[name].expectedHeader.tx = CID.parse(blocks[name].meta.txCid)
    if (blocks[name].data.tx[0].txid !== blocks[name].data.tx[0].hash) {
      // is segwit transaction, add default txinwitness, see
      // https://github.com/bitcoin/bitcoin/pull/18826 for why this is missing
      if (name === '525343') { // block with non null nonce
        blocks[name].data.tx[0].vin[0].txinwitness = ['5b5032506f6f6c5d5b5032506f6f6c5d5b5032506f6f6c5d5b5032506f6f6c5d']
      } else {
        blocks[name].data.tx[0].vin[0].txinwitness = [''.padStart(64, '0')]
      }
    }
    for (const tx of blocks[name].data.tx) {
      // manually ammend expected to include vin links (CIDs) to previous transactions
      for (const vin of tx.vin) {
        if (vin.txid) {
          // this value comes out of the json, so it's already a BE hash string, we need to reverse it
          vin.tx = txHashToCid(bytes.toHex(fromHashHex(vin.txid)))
        }
      }
    }
  }

  return blocks
}

// manually find the witness commitment inside the coinbase.
// it's in _one of_ the vout's, one that's 38 bytes long and starts with a special prefix
// which we need to strip out to find a 32-byte hash
export function findWitnessCommitment (block) {
  const coinbase = block.tx[0]
  for (const vout of coinbase.vout) {
    const spk = vout.scriptPubKey.hex
    if (spk.length === 38 * 2 && spk.startsWith('6a24aa21a9ed')) {
      return bytes.fromHex(spk.slice(12))
    }
  }
}

export const fixtureNames = fixtures.names
