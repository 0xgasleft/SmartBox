// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;



contract SmartLocker {

    uint public constant MIN_BLOCKS = 11;
    
    uint private immutable _unlockBlock;
    address private immutable _recipient;

    event Locked (uint _unlockBlock);
    event DepositRegistered (uint _depositAmount);
    event Unlocked (uint _unlockedAmount);


    constructor (uint unlockBlock, address recipient) 
    {
        require(unlockBlock > block.number + MIN_BLOCKS, "Unlock block should be higher than current block plus minimum buffer!");
        require(recipient != address(0), "ZERO address is not a valid recipient!");

        uint _codeSize;
        assembly {
            _codeSize := extcodesize(recipient)
        }
        require(_codeSize == 0, "Recipient should not be a contract!");

        _unlockBlock = unlockBlock;
        _recipient = recipient;

        emit Locked(_unlockBlock);
    }

    function getCurrentBlock() external view returns (uint)
    {
        return block.number;
    }

    function unlockFunds() external 
    {
        require(block.number >= _unlockBlock, "Time has not come!");

        uint _currentBalance = address(this).balance;
        require(_currentBalance > 0, "Nothing to unlock!");

        (bool status, ) = address(_recipient).call{value: _currentBalance}("");
        require(status, "Unlocking has failed!");
        
        emit Unlocked(_currentBalance);
    }

    receive() external payable {
        emit DepositRegistered(msg.value);
    }
}
