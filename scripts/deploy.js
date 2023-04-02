// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hardhat = require("hardhat");

async function main() {
    const walletAddress = '0xca7AF68134ED9840027d134B47Ec3ab9cDb852F4'
    const approvedBuyers = [
        walletAddress
    ];
    const properties = [
        { 
            name: "LFG Tower",
            description: "Cozy 2-bedroom apartment with a balcony and stunning city views.",
            propertyAddress: "21 Satoshi Street",
            totalShares: 100,
            sharePrice: 10,
            approvedBuyers: approvedBuyers
        },
        { 
            name: "HODL Buildings",
            description: "Cosmic observatory with a 360-degree view of the galaxy.",
            propertyAddress: "124 Ethereum Avenue",
            totalShares: 1000,
            sharePrice: 20,
            approvedBuyers: approvedBuyers
        },
        { 
            name: "FOMO House",
            description: "Stylish urban apartment with a rooftop pool and fitness center.",
            propertyAddress: "420 Doge Lane",
            totalShares: 10000,
            sharePrice: 1,
            approvedBuyers: approvedBuyers
        },
        { 
            name: "DYOR Court",
            description: "Newly renovated 3-bedroom townhouse with a garage and outdoor patio.",
            propertyAddress: "100 Moon Road",
            totalShares: 12345,
            sharePrice: 5,
            approvedBuyers: approvedBuyers
        },

    ]

    const FractionalOwnershipFactory = await hardhat.ethers.getContractFactory("FractionalOwnershipFactory");
    const fractionalOwnershipFactory = await FractionalOwnershipFactory.deploy();
    console.log(
        `Deployed fractionalOwnershipFactory to ${fractionalOwnershipFactory.address}`
    );

    const contractAddressList = [];
    fractionalOwnershipFactory.getFractionalOwnershipArray()
    for await (const property of properties) {
    
        const FractionalOwnership = await hardhat.ethers.getContractFactory("FractionalOwnership");
        
        console.log(property)
        const fractionalOwnership = await FractionalOwnership.deploy(property.name, property.description, property.propertyAddress, property.totalShares, property.sharePrice, property.approvedBuyers);
    
        await fractionalOwnership.deployed();
    
        console.log(
            `Deployed to ${fractionalOwnership.address}`
        );

        contractAddressList.push(fractionalOwnership.address)

        const info = await fractionalOwnership.getInfo(walletAddress);

        console.log(info)
        
    }
    console.log(contractAddressList)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
