// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ISentrixRegistry {
    function assetOwner(uint256 assetId) external view returns (address);
}

/// @title SentrixLicensing
/// @notice Simple programmable license marketplace for Sentrix IP assets
contract SentrixLicensing {
    enum Status {
        Pending,
        Active,
        Revoked
    }

    struct LicenseListing {
        uint256 id;
        uint256 assetId;
        address licensor;
        address licensee;
        uint256 fee;
        uint64 startDate;
        uint64 endDate;
        string termsURI;
        Status status;
    }

    ISentrixRegistry public immutable registry;
    uint256 private _nextLicenseId = 1;

    mapping(uint256 => LicenseListing) private _licenses;
    mapping(uint256 => uint256[]) private _licensesByAsset;

    event LicenseCreated(
        uint256 indexed licenseId,
        uint256 indexed assetId,
        address indexed licensor,
        uint256 fee,
        string termsURI
    );

    event LicenseAccepted(
        uint256 indexed licenseId,
        address indexed licensee
    );

    event LicenseRevoked(uint256 indexed licenseId);

    error NotAssetOwner(address caller, uint256 assetId);
    error InvalidLicensee();
    error InvalidDates();
    error InvalidFee();
    error LicenseNotFound(uint256 licenseId);
    error InvalidStatus();

    constructor(address registryAddress) {
        registry = ISentrixRegistry(registryAddress);
    }

    function createLicense(
        uint256 assetId,
        uint64 startDate,
        uint64 endDate,
        uint256 fee,
        string calldata termsURI,
        address licensee
    ) external returns (uint256 licenseId) {
        if (registry.assetOwner(assetId) != msg.sender) {
            revert NotAssetOwner(msg.sender, assetId);
        }
        if (endDate != 0 && endDate <= startDate) {
            revert InvalidDates();
        }
        if (fee == 0) {
            revert InvalidFee();
        }
        if (licensee == address(0)) {
            revert InvalidLicensee();
        }

        licenseId = _nextLicenseId++;

        _licenses[licenseId] = LicenseListing({
            id: licenseId,
            assetId: assetId,
            licensor: msg.sender,
            licensee: licensee,
            fee: fee,
            startDate: startDate,
            endDate: endDate,
            termsURI: termsURI,
            status: Status.Pending
        });

        _licensesByAsset[assetId].push(licenseId);

        emit LicenseCreated(licenseId, assetId, msg.sender, fee, termsURI);
    }

    function acceptLicense(uint256 licenseId) external payable {
        LicenseListing storage listing = _licenses[licenseId];
        if (listing.licensor == address(0)) {
            revert LicenseNotFound(licenseId);
        }
        if (listing.status != Status.Pending) {
            revert InvalidStatus();
        }
        if (msg.sender != listing.licensee) {
            revert InvalidLicensee();
        }
        if (msg.value != listing.fee) {
            revert InvalidFee();
        }

        listing.status = Status.Active;

        (bool success, ) = listing.licensor.call{value: msg.value}("");
        if (!success) {
            revert InvalidFee();
        }

        emit LicenseAccepted(licenseId, msg.sender);
    }

    function revokeLicense(uint256 licenseId) external {
        LicenseListing storage listing = _licenses[licenseId];
        if (listing.licensor == address(0)) {
            revert LicenseNotFound(licenseId);
        }
        if (msg.sender != listing.licensor) {
            revert NotAssetOwner(msg.sender, listing.assetId);
        }

        listing.status = Status.Revoked;

        emit LicenseRevoked(licenseId);
    }

    function getLicense(uint256 licenseId) external view returns (LicenseListing memory) {
        LicenseListing memory listing = _licenses[licenseId];
        if (listing.licensor == address(0)) {
            revert LicenseNotFound(licenseId);
        }
        return listing;
    }

    function getLicensesByAsset(uint256 assetId) external view returns (LicenseListing[] memory licenses) {
        uint256[] storage ids = _licensesByAsset[assetId];
        licenses = new LicenseListing[](ids.length);
        for (uint256 i = 0; i < ids.length; i++) {
            licenses[i] = _licenses[ids[i]];
        }
    }

    function getOpenLicenses() external view returns (LicenseListing[] memory licenses) {
        uint256 openCount;
        for (uint256 i = 1; i < _nextLicenseId; i++) {
            if (_licenses[i].status == Status.Pending) {
                openCount++;
            }
        }

        licenses = new LicenseListing[](openCount);
        uint256 cursor;
        for (uint256 i = 1; i < _nextLicenseId; i++) {
            if (_licenses[i].status == Status.Pending) {
                licenses[cursor++] = _licenses[i];
            }
        }
    }
}

