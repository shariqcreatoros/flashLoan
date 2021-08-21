pragma solidity ^0.8.0;
import 'hardhat/console.sol';

contract Token {
  string public name = "My Token";
  string public symbol = "MHT";
  uint public totalSupply = 100000;
  address public owner;
  mapping(address => uint) balances;
  
  constructor() {
    balances[msg.sender] = totalSupply;
    owner = msg.sender;
  }

  function transfer(address to, uint amount) external {
    console.log('Sender balance is % tokens', balances[msg.sender]);
    console.log('trying to senfd %s tokens to %s', amount, to);
    require(balances[msg.sender] >= amount, 'Not enough tokens');
    balances[msg.sender] -= amount;
    balances[to] += amount;
  }

  function balanceOf(address account) external view returns(uint) {
    return balances[account];
  }
}