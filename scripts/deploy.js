const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    
    const RealEstateNFT = await hre.ethers.getContractFactory("RealEstateNFT");
    const initialOwner = deployer.address;
    const contract = await RealEstateNFT.deploy(initialOwner);
    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    console.log("Contract deployed to:", contractAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
