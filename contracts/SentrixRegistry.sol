// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title SentrixRegistry
/// @notice Minimal registry for tracking Story Protocol IP assets on-chain
contract SentrixRegistry {
    struct Asset {
        uint256 id;
        address owner;
        string title;
        string category;
        string metadataURI;
        uint64 createdAt;
    }

    uint256 private _nextAssetId = 1;

    mapping(uint256 => Asset) private _assets;
    mapping(address => uint256[]) private _assetsByOwner;

    event AssetRegistered(
        uint256 indexed assetId,
        address indexed owner,
        string title,
        string category,
        string metadataURI
    );

    event AssetMetadataUpdated(
        uint256 indexed assetId,
        string metadataURI
    );

    error AssetNotFound(uint256 assetId);
    error NotAssetOwner(address caller, uint256 assetId);
    error InvalidMetadata();

    /// @notice Register a new IP asset and associate arbitrary metadata (IPFS, Arweave, etc.)
    function registerAsset(
        string calldata title,
        string calldata category,
        string calldata metadataURI
    ) external returns (uint256 assetId) {
        if (bytes(title).length == 0 || bytes(metadataURI).length == 0) {
            revert InvalidMetadata();
        }

        assetId = _nextAssetId++;

        Asset memory asset = Asset({
            id: assetId,
            owner: msg.sender,
            title: title,
            category: category,
            metadataURI: metadataURI,
            createdAt: uint64(block.timestamp)
        });

        _assets[assetId] = asset;
        _assetsByOwner[msg.sender].push(assetId);

        emit AssetRegistered(assetId, msg.sender, title, category, metadataURI);
    }

    /// @notice Update the metadata URI for an existing IP asset
    function updateMetadata(uint256 assetId, string calldata metadataURI) external {
        if (bytes(metadataURI).length == 0) {
            revert InvalidMetadata();
        }

        Asset storage asset = _assets[assetId];
        if (asset.owner == address(0)) {
            revert AssetNotFound(assetId);
        }
        if (asset.owner != msg.sender) {
            revert NotAssetOwner(msg.sender, assetId);
        }

        asset.metadataURI = metadataURI;

        emit AssetMetadataUpdated(assetId, metadataURI);
    }

    /// @notice Return the owner of an asset
    function assetOwner(uint256 assetId) external view returns (address) {
        address owner = _assets[assetId].owner;
        if (owner == address(0)) {
            revert AssetNotFound(assetId);
        }
        return owner;
    }

    /// @notice Fetch metadata for an asset
    function getAsset(uint256 assetId) external view returns (Asset memory) {
        Asset memory asset = _assets[assetId];
        if (asset.owner == address(0)) {
            revert AssetNotFound(assetId);
        }
        return asset;
    }

    /// @notice Return all assets owned by an address
    function getAssetsByOwner(address owner) external view returns (Asset[] memory assets) {
        uint256[] storage ids = _assetsByOwner[owner];
        assets = new Asset[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            assets[i] = _assets[ids[i]];
        }
    }

    /// @notice How many assets have been registered
    function totalAssets() external view returns (uint256) {
        return _nextAssetId - 1;
    }
}

