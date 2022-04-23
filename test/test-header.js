/* eslint-env mocha */

import { assert } from 'chai'
import { bytes } from 'multiformats'
import * as bitcoinBlockCodec from '../src/bitcoin-block.js'
import { setupBlocks, fixtureNames, roundDifficulty } from './util.js'

describe('header', () => {
  let blocks

  before(async () => {
    blocks = await setupBlocks()
  })

  for (const name of fixtureNames) {
    describe(`block "${name}"`, () => {
      it('decode block, header only', () => {
        const decoded = bitcoinBlockCodec.decode(blocks[name].raw.slice(0, 80))
        assert.deepEqual(roundDifficulty(decoded), roundDifficulty(blocks[name].expectedHeader), 'decoded header correctly')
      })

      it('don\'t allow decode full raw', () => {
        try {
          bitcoinBlockCodec.decode(blocks[name].raw)
        } catch (err) {
          assert(/did not consume all available bytes as expected/.test(err.message))
          return
        }
        assert.fail('should throw')
      })

      it('encode', () => {
        const encoded = bitcoinBlockCodec.encode(blocks[name].expectedHeader)
        assert.strictEqual(bytes.toHex(encoded), bytes.toHex(blocks[name].raw.slice(0, 80)), 'raw bytes match')
      })
    })
  }
})
