import { TransactionInCoinbasePorcelain, TransactionInPorcelain } from 'bitcoin-block/classes/TransactionIn';
import { BlockHeaderPorcelain, TransactionPorcelain } from 'bitcoin-block/interface'
import { CID } from 'multiformats';

export interface BitcoinHeader extends BlockHeaderPorcelain {
  parent: CID|null
  tx: CID
}

export interface BitcoinTransactionMerkleNode {
  0: CID|null
  1: CID
}


export interface BitcoinTransactionInCoinbase extends TransactionInCoinbasePorcelain {
  tx: CID
  txinwitness: [string]
}

export interface BitcoinTransactionIn extends TransactionInPorcelain {
  tx: CID
}

export interface BitcoinTransaction extends TransactionPorcelain {
  witnessCommitment?: CID
  vin: (BitcoinTransactionInCoinbase | BitcoinTransactionIn)[]
}

export interface BitcoinWitnessCommitment {
  witnessMerkleRoot: CID|null
  nonce: Uint8Array
}
