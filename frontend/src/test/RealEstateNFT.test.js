require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RealEstateNFT Contract", function () {
  let RealEstateNFT;
  let contract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    RealEstateNFT = await ethers.getContractFactory("RealEstateNFT");
    [owner, addr1, addr2] = await ethers.getSigners(); // Removed the unnecessary underscore (_)

    // Deploy a new contract for each test
    contract = await RealEstateNFT.deploy();
    await contract.deployed();
  });

  it("Should deploy the contract and set the owner correctly", async function () {
    expect(await contract.owner()).to.equal(owner.address);
  });

  it("Should allow the owner to create a new property", async function () {
    const auctionEndTime = Math.floor(Date.now() / 1000) + 5 * 24 * 60 * 60; // Auction end time in seconds

    const createTx = await contract.createProperty(
      "Sunset Villa",
      "David Lee",
      auctionEndTime,
      "image_url_4",
      "Luxury"
    );

    await createTx.wait();

    // Verify that the property was added
    const property = await contract.getProperty(0); // First property should have index 0
    expect(property.name).to.equal("Sunset Villa");
    expect(property.sellerName).to.equal("David Lee");
  });

  it("Should not allow non-owners to create a new property", async function () {
    await expect(
      contract.connect(addr1).createProperty(
        "Mountain Cottage",
        "Sara White",
        Math.floor(Date.now() / 1000) + 6 * 24 * 60 * 60,
        "image_url_5",
        "Cottage"
      )
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  it("Should create multiple properties and fetch them correctly", async function () {
    const auctionEndTime1 = Math.floor(Date.now() / 1000) + 5 * 24 * 60 * 60;
    const auctionEndTime2 = Math.floor(Date.now() / 1000) + 6 * 24 * 60 * 60;

    const createTx1 = await contract.createProperty(
      "Sunset Villa",
      "David Lee",
      auctionEndTime1,
      "image_url_4",
      "Luxury"
    );
    await createTx1.wait();

    const createTx2 = await contract.createProperty(
      "Mountain Cottage",
      "Sara White",
      auctionEndTime2,
      "image_url_5",
      "Cottage"
    );
    await createTx2.wait();

    // Verify both properties are created
    const property1 = await contract.getProperty(0);
    const property2 = await contract.getProperty(1);

    expect(property1.name).to.equal("Sunset Villa");
    expect(property2.name).to.equal("Mountain Cottage");
  });
});
