// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./IPAssetRegistry.sol";

/**
 * @title LicensingModule
 * @dev Handles license creation and purchases for IP Assets
 */
contract LicensingModule is Ownable, ReentrancyGuard {
    IPAssetRegistry public ipAssetRegistry;

    struct License {
        uint256 id;
        uint256 ipId;
        address creator;
        address buyer;
        string termsHash; // IPFS hash of license terms
        string certificateHash; // IPFS hash of certificate
        uint256 price; // Price in wei
        uint256 expiresAt; // Unix timestamp, 0 for no expiration
        bool commercialRights;
        bool distributionRights;
        bool exclusivity;
        uint256 createdAt;
        bool active;
        bool exists;
    }

    mapping(uint256 => License) public licenses;
    mapping(uint256 => uint256[]) public ipLicenses;
    mapping(address => uint256[]) public creatorLicenses;
    mapping(address => uint256[]) public buyerLicenses;
    
    uint256 private _nextLicenseId = 1;

    event LicenseCreated(
        uint256 indexed licenseId,
        uint256 indexed ipId,
        address indexed creator,
        string termsHash,
        uint256 price,
        bool commercialRights,
        bool distributionRights,
        bool exclusivity,
        uint256 expiresAt
    );

    event LicensePurchased(
        uint256 indexed licenseId,
        address indexed buyer,
        string certificateHash,
        uint256 timestamp
    );

    constructor(address _ipAssetRegistry, address initialOwner) Ownable(initialOwner) {
        ipAssetRegistry = IPAssetRegistry(_ipAssetRegistry);
    }

    /**
     * @dev Create a new license for an IP Asset
     */
    function createLicense(
        uint256 ipId,
        string memory termsHash,
        uint256 price,
        bool commercialRights,
        bool distributionRights,
        bool exclusivity,
        uint256 expiresAt
    ) external nonReentrant returns (uint256) {
        // Verify IP Asset exists and creator owns it
        IPAssetRegistry.IPAsset memory ipAsset = ipAssetRegistry.getIPAsset(ipId);
        require(ipAsset.creator == msg.sender, "Not the IP creator");

        uint256 licenseId = _nextLicenseId++;

        licenses[licenseId] = License({
            id: licenseId,
            ipId: ipId,
            creator: msg.sender,
            buyer: address(0),
            termsHash: termsHash,
            certificateHash: "",
            price: price,
            expiresAt: expiresAt,
            commercialRights: commercialRights,
            distributionRights: distributionRights,
            exclusivity: exclusivity,
            createdAt: block.timestamp,
            active: false,
            exists: true
        });

        ipLicenses[ipId].push(licenseId);
        creatorLicenses[msg.sender].push(licenseId);

        emit LicenseCreated(
            licenseId,
            ipId,
            msg.sender,
            termsHash,
            price,
            commercialRights,
            distributionRights,
            exclusivity,
            expiresAt
        );

        return licenseId;
    }

    /**
     * @dev Purchase a license
     */
    function purchaseLicense(
        uint256 licenseId,
        string memory certificateHash
    ) external payable nonReentrant {
        License storage license = licenses[licenseId];
        require(license.exists, "License does not exist");
        require(license.buyer == address(0), "License already purchased");
        require(license.expiresAt == 0 || license.expiresAt > block.timestamp, "License expired");
        require(msg.value >= license.price, "Insufficient payment");

        license.buyer = msg.sender;
        license.certificateHash = certificateHash;
        license.active = true;

        buyerLicenses[msg.sender].push(licenseId);

        // Transfer payment to creator
        if (license.price > 0) {
            (bool success, ) = payable(license.creator).call{value: license.price}("");
            require(success, "Payment transfer failed");

            // Refund excess
            if (msg.value > license.price) {
                (success, ) = payable(msg.sender).call{value: msg.value - license.price}("");
                require(success, "Refund failed");
            }
        }

        emit LicensePurchased(licenseId, msg.sender, certificateHash, block.timestamp);
    }

    /**
     * @dev Get license details
     */
    function getLicense(uint256 licenseId) external view returns (License memory) {
        require(licenses[licenseId].exists, "License does not exist");
        return licenses[licenseId];
    }

    /**
     * @dev Get all licenses for an IP Asset
     */
    function getIPLicenses(uint256 ipId) external view returns (uint256[] memory) {
        return ipLicenses[ipId];
    }

    /**
     * @dev Get licenses created by an address
     */
    function getCreatorLicenses(address creator) external view returns (uint256[] memory) {
        return creatorLicenses[creator];
    }

    /**
     * @dev Get licenses purchased by an address
     */
    function getBuyerLicenses(address buyer) external view returns (uint256[] memory) {
        return buyerLicenses[buyer];
    }

    /**
     * @dev Get total number of licenses
     */
    function totalLicenses() external view returns (uint256) {
        return _nextLicenseId - 1;
    }
}

