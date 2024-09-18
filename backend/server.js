require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const { CONTRACT_ABI } = require('./smartContractAbi');
const app = express();
const port = 4000;

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;

const provider = new ethers.InfuraProvider("sepolia", INFURA_PROJECT_ID);
const wallet = new ethers.Wallet(WALLET_PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

app.use(express.json());
app.use(cors());

app.get('/get-properties', async (req, res) => {
    try {
        const properties = await contract.getAllProperties();
        const serializedProperties = properties.map(property => ({
            name: property.name.toString(),
            sellerName: property.sellerName.toString(),
            auctionEndTime: property.auctionEndTime.toString(),
            highestBid: property.highestBid.toString(),
            image: property.image.toString(),
            category: property.category.toString()
        }));
        res.json(serializedProperties);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/create-property', async (req, res) => {
    const { name, sellerName, auctionEndTime, highestBid, image, category } = req.body;
    if (!name || !sellerName || !auctionEndTime || !highestBid || !image || !category)
        return res.status(400).json({ error: "Missing required fields" });
    try {
        const tx = await contract.createProperty(name, sellerName, auctionEndTime, highestBid, image, category);
        await tx.wait();
        res.json({ message: "Property created successfully", transactionHash: tx.hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
});
