// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract UltimateBaseCore is ERC20, Ownable, ReentrancyGuard {

    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
    }

    mapping(address => StakeInfo) public stakes;
    mapping(address => bool) public isSBT;

    // در این ساختار، از constructor معمولی استفاده می‌کنیم
    constructor(string memory name, string memory symbol) ERC20(name, symbol) Ownable(msg.sender) {}

    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        _transfer(msg.sender, address(this), amount);
        stakes[msg.sender].amount += amount;
        stakes[msg.sender].startTime = block.timestamp;
    }

    function mintSBT() external {
        require(!isSBT[msg.sender], "Already has SBT");
        isSBT[msg.sender] = true;
    }
}