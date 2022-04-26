/* eslint-env mocha */

import { assert } from 'chai'
import { bytes } from 'multiformats'
import * as fixtures from './fixtures.js'
import { setupBlocks, roundDifficulty, cleanBlock } from './util.js'
import * as bitcoin from '../src/bitcoin.js'

describe('formats', () => {
  let blocks

  before(async function () {
    this.timeout(60000)
    blocks = await setupBlocks()
  })

  describe('hash to CID utilities', () => {
    it('blockHashToCID', () => {
      for (const name of fixtures.names) {
        let actual = bitcoin.blockHashToCID(fixtures.meta[name].hash)
        assert.deepEqual(actual.toString(), fixtures.meta[name].cid)
        if (name !== 'genesis') {
          actual = bitcoin.blockHashToCID(blocks[name].data.previousblockhash)
          assert.deepEqual(actual.toString(), fixtures.meta[name].parentCid)
        }
      }
    })

    it('txHashToCID', () => {
      for (const name of fixtures.names) {
        const actual = bitcoin.txHashToCID(blocks[name].data.merkleroot)
        assert.deepEqual(actual.toString(), fixtures.meta[name].txCid)
      }
    })

    it('cidToHash', () => {
      for (const name of fixtures.names) {
        let actual = bitcoin.cidToHash(fixtures.meta[name].cid)
        assert.deepEqual(actual.toString(), fixtures.meta[name].hash)
        if (name !== 'genesis') {
          actual = bitcoin.cidToHash(fixtures.meta[name].parentCid)
          assert.deepEqual(actual.toString(), blocks[name].data.previousblockhash)
        }
      }

      for (const name of fixtures.names) {
        const actual = bitcoin.cidToHash(fixtures.meta[name].txCid)
        assert.deepEqual(actual.toString(), blocks[name].data.merkleroot)
      }
    })
  })

  describe('convertBitcoinBytes', () => {
    for (const name of fixtures.names) {
      it(name, async () => {
        let { data: expected, raw } = await fixtures.loadFixture(name)
        expected = roundDifficulty(cleanBlock(expected))

        let actual = bitcoin.deserializeFullBitcoinBytes(raw)
        actual = roundDifficulty(actual)

        // test transactions separately and then header so any failures don't result in
        // chai diff lockups or are just too big to be useful
        for (let i = 0; i < expected.tx.length; i++) {
          assert.deepEqual(actual[i], expected[i], `transaction #${i} successfully converted`)
        }

        const headerActual = Object.assign({}, actual, { tx: null })
        const headerExpected = Object.assign({}, expected, { tx: null })
        assert.deepEqual(headerActual, headerExpected, 'successfully converted from binary')
      })
    }
  })

  describe('convertBitcoinPorcelain', function () {
    this.timeout(10000)

    for (const name of fixtures.names) {
      it(name, async () => {
        const { data, raw: expected } = await fixtures.loadFixture(name)

        const actual = bitcoin.serializeFullBitcoinBytes(data)
        assert.strictEqual(bytes.toHex(actual), bytes.toHex(expected), 'got same binary form')
      })
    }
  })
})
