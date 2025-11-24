// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title IPAssetRegistry
 * @dev Registry for IP Assets on Sentrix
 */
contract IPAssetRegistry is Ownable, ReentrancyGuard {
    struct IPAsset {
        uint256 id;
        address creator;
        string ipfsHash;
        string metadataHash;
        uint256 createdAt;
        bool exists;
    }

    mapping(uint256 => IPAsset) public ipAssets;
    mapping(address => uint256[]) public creatorAssets;
    mapping(string => uint256) public ipfsToId;
    
    uint256 private _nextId = 1;
    
    event IPRegistered(
        uint256 indexed ipId,
        address indexed creator,
        string ipfsHash,
        string metadataHash,
        uint256 timestamp
    );

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @dev Register a new IP Asset
     * @param ipfsHash IPFS hash of the content
     * @param metadataHash IPFS hash of the metadata
     */
    function registerIPAsset(
        string memory ipfsHash,
        string memory metadataHash
    ) external nonReentrant returns (uint256) {
        require(bytes(ipfsHash).length > 0, "IPFS hash required");
        require(ipfsToId[ipfsHash] == 0, "IPFS hash already registered");

        uint256 ipId = _nextId++;
        
        ipAssets[ipId] = IPAsset({
            id: ipId,
            creator: msg.sender,
            ipfsHash: ipfsHash,
            metadataHash: metadataHash,
            createdAt: block.timestamp,
            exists: true
        });

        creatorAssets[msg.sender].push(ipId);
        ipfsToId[ipfsHash] = ipId;

        emit IPRegistered(
            ipId,
            msg.sender,
            ipfsHash,
            metadataHash,
            block.timestamp
        );

        return ipId;
    }

    /**
     * @dev Get IP Asset by ID
     */
    function getIPAsset(uint256 ipId) external view returns (IPAsset memory) {
        require(ipAssets[ipId].exists, "IP Asset does not exist");
        return ipAssets[ipId];
    }

    /**
     * @dev Get all IP Assets by creator
     */
    function getCreatorAssets(address creator) external view returns (uint256[] memory) {
        return creatorAssets[creator];
    }

    /**
     * @dev Get IP ID from IPFS hash
     */
    function getIPIdFromIPFS(string memory ipfsHash) external view returns (uint256) {
        return ipfsToId[ipfsHash];
    }

    /**
     * @dev Get total number of registered IP Assets
     */
    function totalIPAssets() external view returns (uint256) {
        return _nextId - 1;
    }
}

