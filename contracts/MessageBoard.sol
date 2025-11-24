// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MessageBoard {
    string public message;

    event MessageUpdated(address indexed sender, string newMessage);

    function setMessage(string memory _msg) public {
        message = _msg;
        emit MessageUpdated(msg.sender, _msg);
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
}