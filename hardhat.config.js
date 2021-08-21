/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('@nomiclabs/hardhat-waffle');
 const INFURA_URL = 'https://kovan.infura.io/v3/9a7d267f349d4d6b8ca150b3838fec3a';
 const PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
 const LOCAL_URL = "http://127.0.0.1:8545/";
 
 module.exports = {
   solidity: "0.8.0",
   networks: {
     ropsten_local: {
     url: LOCAL_URL,
     accounts: [PRIVATE_KEY]		
 },
   ropsten: {
     url: INFURA_URL,
     accounts: [PRIVATE_KEY]	
   }
   }
 };
 