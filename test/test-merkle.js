/* eslint-env mocha */

import { assert } from 'chai'
import { CID, bytes } from 'multiformats'
import * as bitcoinTxCodec from '../src/bitcoin-tx.js'
import * as bitcoinWitnessCommitmentCodec from '../src/bitcoin-witness-commitment.js'
import {
  setupBlocks,
  txHashToCid,
  findWitnessCommitment,
  fixtureNames
} from './util.js'

const { toHex } = bytes

describe('merkle', () => {
  let blocks

  before(async function () {
    this.timeout(60000)
    blocks = await setupBlocks()
  })

  function verifyMerkle (name, witness) {
    // how many nodes of this merkle do we expect to see?
    let expectedNodes = blocks[name].data.tx.length
    let last = expectedNodes
    while (last > 1) {
      last = Math.ceil(last / 2)
      expectedNodes += last
    }

    let index = 0
    let lastCid
    let lastLayer
    let thisLayer = []
    let thisLayerLength = blocks[name].data.tx.length
    let layer = 0
    if (witness) {
      index = 1 // we skip the coinbase for full merkle
      thisLayer.push(null)
    }

    let witnessCommitment = null
    for (const { cid, bytes } of bitcoinTxCodec[witness ? 'encodeAll' : 'encodeAllNoWitness'](blocks[name].data)) {
      assert(bytes instanceof Uint8Array)

      const decoded = bitcoinTxCodec.decode(bytes)
      const baseLayer = index < blocks[name].data.tx.length

      if (baseLayer) {
        // one of the base transactions
        const [hashExpected, txidExpected, start, end] = blocks[name].meta.tx[index]
        let expectedCid
        if (index === 0) {
          // if this is a segwit merkle on a segwit block, the coinbase should have a witnessCommitment
          // this will not exist for non-segwit blocks and we won't have index===0 for full-witness
          // merkles (the coinbase is ignored)
          witnessCommitment = decoded.witnessCommitment
        }
        if (witness || !txidExpected) {
          // not segwit, encoded block should be identical
          assert.strictEqual(bytes.length, end - start, `got expected block length (${index})`)
          expectedCid = txHashToCid(hashExpected)
          let actual = decoded
          if (index === 0 && name === '450002') {
            // special case block, faux witness commitment we have to contend with
            assert(decoded.witnessCommitment && decoded.witnessCommitment.bytes && decoded.witnessCommitment.code) // is CID
            actual = Object.assign({}, decoded)
            delete actual.witnessCommitment
          }
          assert.deepEqual(actual, blocks[name].data.tx[index], 'transaction decoded back into expected form')
        } else {
          assert(bytes.length < end - start - 2, `got approximate expected block length (${bytes.length}, ${end - start}`)
          expectedCid = txHashToCid(txidExpected)
        }
        assert.deepEqual(cid, expectedCid, 'got expected transaction CID')
      } else {
        // one of the inner or root merkle nodes
        assert.strictEqual(bytes.length, 64, 'correct binary form')
        assert(Array.isArray(decoded), 'correct decoded form')
        assert.strictEqual(decoded.length, 2, 'correct decoded form')

        const left = bytes.subarray(0, 32)
        const right = bytes.subarray(32)

        // now we do an awkward dance to verify the two nodes in the block were CIDs in the correct position
        // of the previous layer, accounting for duplicates on odd layers
        // debug: process.stdout.write(bytes.slice(0, 3).toString('hex') + ',' + bytes.slice(32, 32 + 3).toString('hex') + ',')
        let lastLeft = lastLayer[thisLayer.length * 2]
        if (witness && layer === 1 && thisLayer.length === 0) {
          // account for the missing coinbase in non-segwit merkle
          assert.strictEqual(decoded[0], null, 'decoded form coinbase hash left element is correct')
          lastLeft = new Uint8Array(32)
        } else {
          assert.deepEqual(decoded[0], txHashToCid(toHex(left)), 'decoded form left CID is correct')
        }
        assert.deepEqual(decoded[1], txHashToCid(toHex(right)), 'decoded form right CID is correct')
        assert.deepEqual(left, lastLeft, `left element in layer ${layer} node is CID in layer ${layer - 1}`)
        // debug: process.stdout.write(`${thisLayer.length} <> ${thisLayer.length * 2} : ${lastLayer.length} : ${thisLayerLength} `)
        // debug: process.stdout.write(`${left.slice(0, 6).toString('hex')} <> ${lastLayer[thisLayer.length * 2].slice(0, 6).toString('hex')} `)
        if (thisLayer.length === thisLayerLength - 1 && lastLayer.length % 2 !== 0) {
          assert.deepEqual(left, right, `last node in layer ${layer} has duplicate left & right`)
          // debug: process.stdout.write(`(dupe) ${right.slice(0, 6).toString('hex')} <> ${left.slice(0, 6).toString('hex')}`)
        } else {
          assert.deepEqual(right, lastLayer[thisLayer.length * 2 + 1], `right element in layer ${layer} node is CID in layer ${layer - 1}`)
          // debug: process.stdout.write(`${right.slice(0, 6).toString('hex')} <> ${lastLayer[thisLayer.length * 2 + 1].slice(0, 6).toString('hex')}`)
        }
        // debug: process.stdout.write('\n')
      }

      thisLayer.push(cid.multihash.digest)

      index++
      lastCid = cid
      if (thisLayer.length === thisLayerLength) {
        thisLayerLength = Math.ceil(thisLayerLength / 2)
        lastLayer = thisLayer
        thisLayer = []
        layer++
      }
    }

    if (!witness) {
      assert.deepEqual(lastCid, blocks[name].expectedHeader.tx, 'got expected merkle root')
    }
    assert.strictEqual(index, expectedNodes, 'got correct number of merkle nodes')

    return { root: lastCid, witnessCommitment }
  }

  for (const name of fixtureNames) {
    describe(`block "${name}"`, function () {
      this.timeout(10000)

      let expectedWitnessCommitment
      before(() => {
        expectedWitnessCommitment = findWitnessCommitment(blocks[name].data)
        if (!expectedWitnessCommitment) {
          // this isn't done inside a it() but it's a sanity check on our fixture data, not the test data
          assert(!blocks[name].meta.segwit, 'non-segwit block shouldn\'t have witness commitment, all others should')
        }
      })

      it('encode transactions into no-witness merkle', () => {
        const { witnessCommitment } = verifyMerkle(name, false)
        if (!blocks[name].meta.segwit && name !== '450002') { // 450002 is the special-case faux segwit
          assert.isUndefined(witnessCommitment, 'no witness commitment for non-witness merkle')
        } else {
          assert(CID.asCID(witnessCommitment), 'witness commitment exists and is a CID')
          assert.strictEqual(witnessCommitment.code, 0xb2, 'witness commitment CID is correct')
          const wcmh = witnessCommitment.multihash
          assert.strictEqual(wcmh.code, 0x56, 'witness commitment CID has correct hash alg')
          assert.deepEqual(wcmh.digest, expectedWitnessCommitment, 'witness commitment CID has correct hash')
        }
      })

      it('encode transactions into segwit merkle & witness commitment', () => {
        let { root, witnessCommitment } = verifyMerkle(name, true)

        // witness commitment
        assert.strictEqual(witnessCommitment, null, 'shouldn\'t find a witness commitment in the full-witness merkle')

        if (!blocks[name].meta.segwit) {
          // nothing else to test here
          return
        }

        if (!root) {
          if (blocks[name].data.tx.length === 1) {
            // this is OK, make it null so encodeWitnessCommitment() handles it properly
            root = null
          } else {
            assert.fail('Unexpected missing merkle root')
          }
        }

        const { cid, bytes } = bitcoinWitnessCommitmentCodec.encodeWitnessCommitment(blocks[name].data, root)
        const hash = cid.multihash.digest
        assert.strictEqual(toHex(hash), toHex(expectedWitnessCommitment), 'got expected witness commitment')
        assert.strictEqual(bytes.length, 64, 'correct block length')
        // most blocks have a null nonce (all zeros), Bitcoin Core does NULL nonces but it's not a strict
        // requirement so some blocks have novel bytes
        let expectedNonce = ''.padStart(64, '0')
        if (name === '525343') { // block with non null nonce
          expectedNonce = '5b5032506f6f6c5d5b5032506f6f6c5d5b5032506f6f6c5d5b5032506f6f6c5d'
        }
        assert.deepEqual(toHex(bytes.subarray(32)), expectedNonce)

        const decoded = bitcoinWitnessCommitmentCodec.decode(bytes)
        assert.strictEqual(typeof decoded, 'object', 'correct decoded witness commitment form')
        assert(decoded.nonce instanceof Uint8Array, 'correct decoded witness commitment form')
        if (blocks[name].data.tx.length === 1) {
          // special case, only a coinbase, no useful merkle root
          assert.strictEqual(decoded.witnessMerkleRoot, null)
        } else {
          assert(CID.asCID(decoded.witnessMerkleRoot), 'correct decoded witness commitment form')
        }
      })
    })
  }
})
