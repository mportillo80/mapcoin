const SHA256 = require('crypto-js/sha256');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor (timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
  }

  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log(`Block mined: ${this.hash}`);
  }
}



class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block('01/01/2021', 'Genesis block', '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    let block  = new Block(Date.now(), this.pendingTransactions);

    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!');

    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward)
    ];
  }

  // addBlock(newBlock) {
  //   newBlock.previousHash = this.getLatestBlock().hash;
  //   // newBlock.hash = newBlock.calculateHash();
  //   newBlock.mineBlock(this.difficulty);

  //   this.chain.push(newBlock);
  // }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for(const block of this.chain) {
      for(const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  isChainValid() {
    for(let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // hash checks
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

let mapcoin = new Blockchain();

// console.log('Mining block 1...');

// mapcoin.addBlock(new Block(1, '03/05/21', { amount: 4 }));

// console.log('Mining block 2...');

// mapcoin.addBlock(new Block(2, '03/06/21', { amount: 5 }));

// console.log(`Is blockchain valid? ${mapcoin.isChainValid()}`);
// console.log(JSON.stringify(mapcoin, null, 4));

mapcoin.createTransaction(new Transaction('address1', 'address2', 100));
mapcoin.createTransaction(new Transaction('address2', 'address2', 50));

console.log('\nStarting the miner...');
mapcoin.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', mapcoin.getBalanceOfAddress('xaviers-address'));

console.log('\nStarting the miner...');
mapcoin.minePendingTransactions('xaviers-address');

console.log('\nBalance of xavier is', mapcoin.getBalanceOfAddress('xaviers-address'));
