pragma solidity ^0.8.0;

contract FractionalOwnership {
    address private _owner;
    string private _name;
    string private _description;
    uint256 private _totalShares;
    uint256 private _sharePrice;
    uint256 private _remainingShares;
    mapping (address => uint256) private _shares;

    struct Info {
        address owner;
        string name;
        string description;
        uint256 totalShares;
        uint256 sharePrice;
        uint256 remainingShares;
    }

    constructor(string memory name, string memory description, uint256 totalShares, uint256 sharePrice) {
        _owner = msg.sender;
        _name = name;
        _description = description;
        _totalShares = totalShares;
        _sharePrice = sharePrice;
        _remainingShares = _totalShares;
    }
    function getInfo() public view returns (Info memory) {
        return
            Info({
                owner: _owner,
                name: _name,
                description: _description,
                totalShares: _totalShares,
                sharePrice: _sharePrice,
                remainingShares: _remainingShares
            });
    }

    function getOwner() public view returns (address) {
        return _owner;
    }
    function getName() public view returns (string memory) {
        return _name;
    }
    function getDescription() public view returns (string memory) {
        return _description;
    }
    function getTotalShares() public view returns (uint256) {
        return _totalShares;
    }
    function getSharePrice() public view returns (uint256) {
        return _sharePrice;
    }
    function getRemainingShares() public view returns (uint256) {
        return _remainingShares;
    }
    function getOwningShares(address address_) public view returns (uint256) {
        return _shares[address_];
    }

    function buyShares(uint256 _numShares) public payable {
        require(msg.value == _numShares * _sharePrice, "Incorrect amount sent");
        require(_numShares <= _remainingShares, "Not enough shares available");
        
        _shares[msg.sender] += _numShares;
        _remainingShares -= _numShares;
    }

    function sellShares(uint256 _numShares) public {
        require(_numShares <= _shares[msg.sender], "Not enough shares to sell");

        _shares[msg.sender] -= _numShares;
        _remainingShares += _numShares;
        payable(msg.sender).transfer(_numShares * _sharePrice);
    }
}