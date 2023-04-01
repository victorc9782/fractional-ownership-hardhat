// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hardhat = require("hardhat");

async function main() {
    const totalShares = 100;
    const sharePrice = 10;
    const name = "Happy House"
    const description = "Your best home ever in the world!"
    const propertyAddress = "1 Hong Kong Road, HK Island"
    const approvedBuyers = [
        '0xca7AF68134ED9840027d134B47Ec3ab9cDb852F4'
    ];

    const FractionalOwnership = await hardhat.ethers.getContractFactory("FractionalOwnership");
    const fractionalOwnership = await FractionalOwnership.deploy(name, description, propertyAddress, totalShares, sharePrice, approvedBuyers);

    await fractionalOwnership.deployed();

    console.log(
        `Deployed to ${fractionalOwnership.address}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
