/* eslint-env mocha */

import { assert } from 'chai'
import { bytes, CID } from 'multiformats'
import fs from 'fs'
import { Readable } from 'stream'
import { CarIndexer, CarReader, CarWriter } from '@ipld/car'
import * as fixtures from './fixtures.js'
import { setupBlocks, roundDifficulty, cleanBlock } from './util.js'
import * as bitcoin from '../src/bitcoin.js'

const { toHex } = bytes

describe('formats', () => {
  let blocks

  before(async () => {
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

  describe('convertBitcoinPorcelain', () => {
    for (const name of fixtures.names) {
      it(name, async () => {
        const { data, raw: expected } = await fixtures.loadFixture(name)

        const actual = bitcoin.serializeFullBitcoinBytes(data)
        assert.strictEqual(bytes.toHex(actual), bytes.toHex(expected), 'got same binary form')
      })
    }
  })

  describe('full block car file round-trip', function () {
    this.timeout(10000)

    for (const name of fixtures.names) {
      it(name, async () => {
        let { data: expected, meta, raw } = await fixtures.loadFixture(name)

        expected = roundDifficulty(cleanBlock(expected))
        const blockCid = CID.parse(meta.cid)
        let writer
        let rootCid
        for await (const { cid, bytes } of bitcoin.encodeAll(expected)) {
          if (!writer) {
            rootCid = cid
            const writable = CarWriter.create([cid])
            writer = writable.writer
            Readable.from(writable.out).pipe(fs.createWriteStream(`${name}.car`))
          }
          await writer.put({ cid, bytes })
        }
        await writer.close()
        assert.deepStrictEqual(rootCid.toString(), blockCid.toString())

        // read

        // build an index from the car
        const index = {}
        let blockCount = 0
        const inStream = fs.createReadStream(`${name}.car`)
        const indexer = await CarIndexer.fromIterable(inStream)
        assert.strictEqual((await indexer.getRoots()).length, 1)
        assert.deepStrictEqual((await indexer.getRoots())[0].toString(), blockCid.toString())
        for await (const blockIndex of indexer) {
          index[blockIndex.cid.toString()] = blockIndex
          blockCount++
        }

        // make a loder that can read blocks from the car
        const fd = await fs.promises.open(`${name}.car`)
        let reads = 0
        let failedReads = 0
        async function loader (cid) {
          const blockIndex = index[cid.toString()]
          if (!blockIndex) {
            failedReads++
            throw new Error(`Block not found: [${cid.toString()}]`)
          }
          reads++
          const block = await CarReader.readRaw(fd, blockIndex)
          return block.bytes
        }

        // perform the reassemble!
        let { deserialized: actual, bytes } = await bitcoin.assemble(loader, blockCid)
        actual = roundDifficulty(actual)

        // test transactions separately and then header so any failures don't result in
        // chai diff lockups or are just too big to be useful
        for (let i = 0; i < expected.tx.length; i++) {
          assert.deepEqual(actual[i], expected[i], `transaction #${i} successfully converted`)
        }

        const headerActual = Object.assign({}, actual, { tx: null })
        const headerExpected = Object.assign({}, expected, { tx: null })
        assert.deepEqual(headerActual, headerExpected)

        if (!meta.segwit || expected.tx.length === 1) { // tx===1 doesn't require second merkle traversal
          assert.strictEqual(reads, blockCount)
        } else {
          // something less because we don't need to read the non-segwit transactions and maybe parts of the tx merkle
          assert(reads < blockCount)
        }
        assert.strictEqual(failedReads, 0)

        assert.strictEqual(toHex(bytes), toHex(raw), 're-encoded full binary form matches')

        await fd.close()
      })
    }

    after(async () => {
      for (const name of fixtures.names) {
        try {
          await fs.promises.unlink(`${name}.car`)
        } catch (err) {
          if (err.code !== 'ENOENT') {
            throw err
          }
        }
      }
    })
  })
})
