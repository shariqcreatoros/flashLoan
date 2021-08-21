require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider')
const moment = require('moment-timezone')
const numeral = require('numeral')
const _ = require('lodash')
const axios = require('axios')
const ethers = require('ethers');

// const PORT = process.env.PORT || 5000
// const app = express();
// const server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${ PORT }`))

// WEB3 CONFIG
const FL_FACTORY_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_addressProvider",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "_from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "_assetAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "LogWithdraw",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "ADDRESSES_PROVIDER",
    "outputs": [
      {
        "internalType": "contract ILendingPoolAddressesProviderV2",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "LENDING_POOL",
    "outputs": [
      {
        "internalType": "contract ILendingPoolV2",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "assets",
        "type": "address[]"
      },
      {
        "internalType": "uint256[]",
        "name": "amounts",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "premiums",
        "type": "uint256[]"
      },
      {
        "internalType": "address",
        "name": "initiator",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "params",
        "type": "bytes"
      }
    ],
    "name": "executeOperation",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_asset",
        "type": "address"
      }
    ],
    "name": "flashloan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_assetAddress",
        "type": "address"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];
const FL_FACTORY_ADDRESS = '0x6664cF0845028F5e24675ef913d3d0404846E14a'

async function main() {

  // const deployer = await ethers.getSigner("0xab5801a7d398351b8be11c439e05c5b3259aec9b");

  console.log("entered main");
  // let provider = ethers.getDefaultProvider();
  const providers = new ethers.providers.JsonRpcProvider();

  const signer = providers.getSigner("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");
// const uniswapFactoryContract = new web3.eth.Contract(FL_FACTORY_ABI, FL_FACTORY_ADDRESS)
const uniswapFactoryContract = await new ethers.Contract(FL_FACTORY_ADDRESS, FL_FACTORY_ABI, providers);
// uniswapFactoryContract.connect(signer);
console.log("found contract. now calling functions");
const result = await uniswapFactoryContract.connect(signer).functions['flashloan(uint256,address)'](100000000000, "0xd0a1e359811322d97991e03f863a0c30c2cf029c");
const txnHash = result.hash;

// providers.on((log, event) => {
//   console.log(log);
//   console.log(event);
//   // Emitted whenever a DAI token transfer occurs
// });


console.log("done with call ");
console.log(result );
 let receipt = await result.wait();

 console.log("got receipt");
  console.log(receipt);
  console.log("transfer events ");
  console.log(receipt.events?.filter((x) => {return x.event == "Transfer"}));

  const filter = {
    address: "0x6664cF0845028F5e24675ef913d3d0404846E14a",
    fromBlock: 0,
    toBlock: 26858830,
    // topics: [uniswapFactoryContract.interface.events.executeOperation.topic]
  };
  const logs = await providers.getLogs(filter);
  console.log(logs);
  providers.once(txnHash, (transaction) => {
    console.log(transaction);
    // Emitted when the transaction has been mined
})

}


main() 
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });