pragma solidity ^0.8.0;

contract FractionalOwnership {
    address public owner;
    uint public totalShares;
    uint public sharePrice;
    uint public remainingShares;
    mapping (address => uint) public shares;

    constructor(uint _totalShares, uint _sharePrice) {
        owner = msg.sender;
        totalShares = _totalShares;
        sharePrice = _sharePrice;
        remainingShares = totalShares;
    }

    function buyShares(uint _numShares) public payable {
        require(msg.value == _numShares * sharePrice, "Incorrect amount sent");
        require(_numShares <= remainingShares, "Not enough shares available");
        
        shares[msg.sender] += _numShares;
        remainingShares -= _numShares;
    }

    function sellShares(uint _numShares) public {
        require(_numShares <= shares[msg.sender], "Not enough shares to sell");

        shares[msg.sender] -= _numShares;
        remainingShares += _numShares;
        payable(msg.sender).transfer(_numShares * sharePrice);
    }
}