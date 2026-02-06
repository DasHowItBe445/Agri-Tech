// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract KrishiPassport {

    struct Passport {
        string produceType;
        uint256 quantity;
        uint256 harvestDate;
        string qualityGrade;
        uint256 freshnessScore;
        string sizeCategory;       
        string pesticideInfo;      
        string certificateHash;    
        string imageHash;
        address farmer;
        uint256 timestamp;
        bool isVerified;
    }

    address public admin;
    uint256 public passportCount;

    mapping(uint256 => Passport) private passports;

    event PassportCreated(
        uint256 indexed id,
        address indexed farmer,
        string produceType
    );

    event PassportVerified(
        uint256 indexed id,
        address indexed verifier
    );

    event AdminTransferred(
        address indexed oldAdmin,
        address indexed newAdmin
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    modifier validId(uint256 _id) {
        require(_id > 0 && _id <= passportCount, "Invalid passport ID");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createPassport(
        string memory _produceType,
        uint256 _quantity,
        uint256 _harvestDate,
        string memory _qualityGrade,
        uint256 _freshnessScore,
        string memory _sizeCategory,
        string memory _pesticideInfo,
        string memory _certificateHash,
        string memory _imageHash
    ) external {

        require(_quantity > 0, "Invalid quantity");
        require(_freshnessScore <= 100, "Invalid freshness");

        passportCount++;

        passports[passportCount] = Passport({
            produceType: _produceType,
            quantity: _quantity,
            harvestDate: _harvestDate,
            qualityGrade: _qualityGrade,
            freshnessScore: _freshnessScore,
            sizeCategory: _sizeCategory,
            pesticideInfo: _pesticideInfo,
            certificateHash: _certificateHash,
            imageHash: _imageHash,
            farmer: msg.sender,
            timestamp: block.timestamp,
            isVerified: false
        });

        emit PassportCreated(passportCount, msg.sender, _produceType);
    }

    function verifyPassport(uint256 _id)
        external
        onlyAdmin
        validId(_id)
    {
        passports[_id].isVerified = true;

        emit PassportVerified(_id, msg.sender);
    }

    function getPassport(uint256 _id)
        external
        view
        validId(_id)
        returns (Passport memory)
    {
        return passports[_id];
    }

    function isOwner(uint256 _id)
        external
        view
        validId(_id)
        returns (bool)
    {
        return passports[_id].farmer == msg.sender;
    }

    function transferAdmin(address _newAdmin)
        external
        onlyAdmin
    {
        require(_newAdmin != address(0), "Invalid address");

        address oldAdmin = admin;
        admin = _newAdmin;

        emit AdminTransferred(oldAdmin, _newAdmin);
    }
}
