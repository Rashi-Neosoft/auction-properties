// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstateNFT is Ownable {
    struct Property {
        string name;
        string sellerName;
        uint256 auctionEndTime;
        uint256 highestBid;
        address highestBidder;
        string image;
        string category;
    }

    mapping(uint256 => Property) public properties;
    uint256 public propertyCount;

    // Event emitted when a new property is created
    event PropertyCreated(
        uint256 indexed propertyId,
        string name,
        string sellerName,
        uint256 auctionEndTime,
        uint256 highestBid,
        string image,
        string category
    );

    constructor(address initialOwner) Ownable(initialOwner) {
        transferOwnership(initialOwner);
    }

    // Function to create a new property
    function createProperty(
        string memory _name,
        string memory _sellerName,
        uint256 _auctionEndTime,
        uint256 _highestBid,
        string memory _image,
        string memory _category
    ) public onlyOwner {
        properties[propertyCount] = Property(
            _name,
            _sellerName,
            _auctionEndTime,
            _highestBid,
            address(0),
            _image,
            _category
        );
        emit PropertyCreated(propertyCount, _name, _sellerName, _auctionEndTime, _highestBid, _image, _category);
        propertyCount++;
    }

    // Function to retrieve a specific property
    function getProperty(uint256 _propertyId) public view returns (Property memory) {
        require(_propertyId < propertyCount, "Property does not exist.");
        return properties[_propertyId];
    }

    // Function to retrieve all properties
    function getAllProperties() public view returns (Property[] memory) {
        Property[] memory allProperties = new Property[](propertyCount);
        for (uint256 i = 0; i < propertyCount; i++) {
            allProperties[i] = properties[i];
        }
        return allProperties;
    }
}
