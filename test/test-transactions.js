/* eslint-env mocha */

import { assert } from 'chai'
import { bytes, CID } from 'multiformats'
import * as dblSha256 from '../src/dbl-sha2-256.js'
import * as bitcoinTxCodec from '../src/bitcoin-tx.js'
import {
  setupBlocks,
  witnessCommitmentHashToCid,
  txHashToCid,
  findWitnessCommitment,
  fixtureNames,
  CODEC_TX_CODE
} from './util.js'

describe('transactions', () => {
  let blocks

  before(async () => {
    blocks = await setupBlocks()
  })

  for (const name of fixtureNames) {
    describe(`block "${name}"`, function () {
      this.timeout(5000)

      // known metadata of the transaction, its hash, txid and byte location in the block
      function forEachTx (txcb) {
        for (let index = 0; index < blocks[name].meta.tx.length; index++) {
          const [hashExpected, txidExpected, start, end] = blocks[name].meta.tx[index]
          const txExpected = blocks[name].data.tx[index]
          const txRaw = blocks[name].raw.subarray(start, end)
          txcb({ index, hashExpected, txidExpected, start, end, txExpected, txRaw })
        }
      }

      it('decode', () => {
        return forEachTx(({ index, txRaw, txExpected }) => {
          const decoded = bitcoinTxCodec.decode(txRaw)
          if (index === 0 && (blocks[name].meta.segwit || name === '450002')) {
            // this is a coinbase for segwit block, or the block (450002) has a faux witness commitment
            // but is not actuall segwit (we can't distinguish)
            // the coinbase for segwit blocks is decorated with a CID version of the witness commitment
            const expectedWitnessCommitment = findWitnessCommitment(blocks[name].data)
            txExpected.witnessCommitment = witnessCommitmentHashToCid(bytes.toHex(expectedWitnessCommitment))
          }
          assert.deepEqual(decoded, txExpected, 'got properly formed transaction')
        })
      })

      it('encode', () => {
        return forEachTx(({ index, txRaw, txExpected, hashExpected, txidExpected }) => {
          // encode
          const encoded = bitcoinTxCodec.encode(txExpected)
          assert.strictEqual(bytes.toHex(encoded), bytes.toHex(txRaw), 'encoded raw bytes match')

          // generate CID from bytes, compare to known hash
          const digest = dblSha256.digest(encoded)
          const cid = CID.create(1, CODEC_TX_CODE, digest)
          const expectedCid = txHashToCid(hashExpected)
          assert.strictEqual(cid.toString(), expectedCid.toString(), 'got expected CID from bytes')

          if (txidExpected) {
            // is a segwit transaction, check we can encode it without witness data properly
            // by comparing to known txid (hash with no witness)
            const encodedNoWitness = bitcoinTxCodec.encodeNoWitness(txExpected) // go directly because this isn't a registered stand-alone coded
            const digestNoWitness = dblSha256.digest(encodedNoWitness)
            const cidNoWitness = CID.create(1, CODEC_TX_CODE, digestNoWitness)
            const expectedCidNoWitness = txHashToCid(txidExpected)
            assert.strictEqual(cidNoWitness.toString(), expectedCidNoWitness.toString(), 'got expected CID from no-witness bytes')
          } else {
            // is not a segwit transaction, check that segwit encoding is identical to standard encoding
            const encodedNoWitness = bitcoinTxCodec.encodeNoWitness(txExpected) // go directly because this isn't a registered stand-alone coded
            assert.strictEqual(bytes.toHex(encodedNoWitness), bytes.toHex(encoded), 'encodes the same with or without witness data')
          }
        })
      })
    })
  }
})
