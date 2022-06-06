import { TransactionInCoinbasePorcelain, TransactionInPorcelain } from 'bitcoin-block/classes/TransactionIn';
import { BlockHeaderPorcelain, TransactionPorcelain } from 'bitcoin-block/interface'
import { CID } from 'multiformats/interface';

export type HASH_ALG_CODE = 0x56
export type CODEC_BLOCK_CODE = 0xb0
export type CODEC_TX_CODE = 0xb1
export type CODEC_WITNESS_COMMITMENT_CODE = 0xb2

export type IPLDLoader = (cid:CID)=>Promise<Uint8Array>

export interface BitcoinBlockCID extends CID<CODEC_BLOCK_CODE, HASH_ALG_CODE, 1>{}
export interface BitcoinTxCID extends CID<CODEC_TX_CODE, HASH_ALG_CODE, 1>{}
export interface BitcoinWitnessCommitmentCID extends CID<CODEC_WITNESS_COMMITMENT_CODE, HASH_ALG_CODE, 1>{}

export interface BitcoinHeader extends BlockHeaderPorcelain {
  parent: BitcoinBlockCID|null
  tx: BitcoinTxCID
}

export interface BitcoinTransactionMerkleNode {
  0: BitcoinTxCID|null
  1: BitcoinTxCID
}

export interface BitcoinTransactionInCoinbase extends TransactionInCoinbasePorcelain {
  tx: BitcoinTxCID
  txinwitness: [string]
}

export interface BitcoinTransactionIn extends TransactionInPorcelain {
  tx: BitcoinTxCID
}

export interface BitcoinTransaction extends TransactionPorcelain {
  witnessCommitment?: BitcoinWitnessCommitmentCID
  vin: (BitcoinTransactionInCoinbase | BitcoinTransactionIn)[]
}

export interface BitcoinWitnessCommitment {
  witnessMerkleRoot: BitcoinTxCID|null
  nonce: Uint8Array
}
