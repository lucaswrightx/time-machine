// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, eaddress, externalEaddress} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract TimeLockedMessages is SepoliaConfig {
    struct Message {
        address creator;
        string title;
        bytes encryptedContent;
        eaddress encryptedRecipient;
        uint256 createdAt;
        uint256 unlockTimestamp;
        bool accessGranted;
        address grantedRecipient;
    }

    uint256 private _nextMessageId;
    mapping(uint256 => Message) private _messages;
    mapping(address => uint256[]) private _messageIdsByCreator;

    event MessageCreated(uint256 indexed messageId, address indexed creator, uint256 unlockTimestamp, uint256 createdAt);
    event DecryptionAllowed(uint256 indexed messageId, address indexed recipient);

    function createMessage(
        string calldata title,
        bytes calldata encryptedContent,
        externalEaddress encryptedRecipient,
        bytes calldata inputProof,
        uint256 unlockTimestamp
    ) external returns (uint256) {
        require(bytes(title).length > 0, "Title required");
        require(encryptedContent.length > 0, "Encrypted content required");
        require(unlockTimestamp > block.timestamp, "Unlock time must be future");

        eaddress storedRecipient = FHE.fromExternal(encryptedRecipient, inputProof);
        require(FHE.isInitialized(storedRecipient), "Encrypted address required");

        uint256 messageId = _nextMessageId;
        _nextMessageId += 1;

        Message storage newMessage = _messages[messageId];
        newMessage.creator = msg.sender;
        newMessage.title = title;
        newMessage.encryptedContent = encryptedContent;
        newMessage.encryptedRecipient = storedRecipient;
        newMessage.createdAt = block.timestamp;
        newMessage.unlockTimestamp = unlockTimestamp;
        newMessage.accessGranted = false;
        newMessage.grantedRecipient = address(0);

        _messageIdsByCreator[msg.sender].push(messageId);

        FHE.allowThis(storedRecipient);

        emit MessageCreated(messageId, msg.sender, unlockTimestamp, block.timestamp);

        return messageId;
    }

    function getMessage(uint256 messageId)
        external
        view
        returns (
            address creator,
            string memory title,
            bytes memory encryptedContent,
            eaddress encryptedRecipient,
            uint256 createdAt,
            uint256 unlockTimestamp,
            bool accessGranted,
            address grantedRecipient
        )
    {
        Message storage stored = _messages[messageId];
        require(stored.creator != address(0), "Message not found");

        return (
            stored.creator,
            stored.title,
            stored.encryptedContent,
            stored.encryptedRecipient,
            stored.createdAt,
            stored.unlockTimestamp,
            stored.accessGranted,
            stored.grantedRecipient
        );
    }

    function getMessageIdsByCreator(address creator) external view returns (uint256[] memory) {
        return _messageIdsByCreator[creator];
    }

    function allowRecipient(uint256 messageId, address recipient) external {
        Message storage stored = _messages[messageId];
        require(stored.creator != address(0), "Message not found");
        require(msg.sender == stored.creator, "Only creator can allow");
        require(block.timestamp >= stored.unlockTimestamp, "Unlock time not reached");
        require(!stored.accessGranted, "Already allowed");
        require(recipient != address(0), "Invalid recipient");

        FHE.allow(stored.encryptedRecipient, recipient);

        stored.accessGranted = true;
        stored.grantedRecipient = recipient;

        emit DecryptionAllowed(messageId, recipient);
    }
}
