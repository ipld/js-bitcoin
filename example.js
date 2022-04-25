import fs from 'fs'
import * as bitcoinBlock from '@ipld/bitcoin/block'
import * as bitcoinTx from '@ipld/bitcoin/tx'
import { CarReader } from '@ipld/car'

// Assumes a CAR with at least one full Bitcoin block represented as IPLD blocks
// and a "blockId" which is the commonly used Bitcoin block identifier (32-byte
// digest in hexadecimal, with leading zeros).
async function run (pathToCar, blockId) {
  const reader = await CarReader.fromIterable(fs.createReadStream(pathToCar))
  const headerCid = bitcoinBlock.blockHashToCID(blockId)
  const header = bitcoinBlock.decode((await reader.get(headerCid)).bytes)

  // navigate the transaction binary merkle tree to the first transaction, the coinbase,
  // which will be at the leftmost side of the tree.
  let txCid = header.tx
  let tx
  while (true) {
    tx = bitcoinTx.decode((await reader.get(txCid)).bytes)
    if (!Array.isArray(tx)) { // is not an inner merkle tree node
      break
    }
    txCid = tx[0] // leftmost side of the tx binary merkle
  }

  // convert the scriptSig to UTF-8 and cross our fingers that there's something
  // interesting in there
  console.log(Buffer.from(tx.vin[0].coinbase, 'hex').toString('utf8'))
}

run(process.argv[2], process.argv[3]).catch((err) => {
  console.error(err.stack)
  process.exit(1)
})
