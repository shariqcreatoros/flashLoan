// const { ethers } = require("hardhat");
// const { experimentalAddHardhatNetworkMessageTraceHook } = require("hardhat/config");

async function main() {
  const deployer = await ethers.getSigner("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");

//  const [deployer] = await ethers.getSigners();
  console.log(`deploying contracts with the account ${deployer.address}`);

  const balance = await deployer.getBalance();
  console.log(`Account balance: ${balance.toString()}`);
  // const Token = await ethers.getContractFactory("Token");
  // console.log(`Account  yoyoy`);

  // const token = await Token.deploy();
  // console.log(`Token Address: ${token.address}`);

  console.log("now deploying flash");
  const FlashLoan = await ethers.getContractFactory("FlashLoan");
  console.log("yo yoyoyo ");
  const flashLoan = await FlashLoan.deploy("0x88757f2f99175387ab4c6a4b3067c77a695b0349");
  console.log(`flashLoan Address: ${flashLoan.address}`);
  // console.log(flashLoan.flashloan(10, '0xd0a1e359811322d97991e03f863a0c30c2cf029c'));
}

main() 
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });