const {
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FractionalOwnership", function() {

    async function deployNewFractionalOwnership() {
        const totalShares = 100;
        const sharePrice = 10;
        const name = "Happy House"
        const description = "Your best home ever in the world!"
        const propertyAddress = "1 Hong Kong Road, HK Island"

        // Contracts are deployed using the first signer/account by default
        const [owner, userA, userB] = await ethers.getSigners();

        const FractionalOwnership = await ethers.getContractFactory("FractionalOwnership");
        const fractionalOwnership = await FractionalOwnership.deploy(name, description, propertyAddress, totalShares, sharePrice, [userA.address]);

        return { fractionalOwnership, name, description, propertyAddress, totalShares, sharePrice, owner, userA, userB };
    }

    // beforeEach(async function() {
    //     [owner, alice, bob] = await ethers.getSigners();
    //     const FractionalOwnership = await ethers.getContractFactory("FractionalOwnership");
    //     fractionalOwnership = await FractionalOwnership.deploy(totalShares, price);
    //     await fractionalOwnership.deployed();withdrawFunds
    // });

    it("should deploy with correct initial values", async function() {
        const { fractionalOwnership, name, description, propertyAddress, owner, totalShares, sharePrice } = await loadFixture(deployNewFractionalOwnership);
        expect(await fractionalOwnership.getOwner()).to.equal(owner.address);
        expect(await fractionalOwnership.getName()).to.equal(name);
        expect(await fractionalOwnership.getDescription()).to.equal(description);
        expect(await fractionalOwnership.getPropertyAddress()).to.equal(propertyAddress);
        expect(await fractionalOwnership.getTotalShares()).to.equal(totalShares);
        expect(await fractionalOwnership.getSharePrice()).to.equal(sharePrice);
    });

    it("should allow users to buy shares", async function() {
        const { fractionalOwnership, userA } = await loadFixture(deployNewFractionalOwnership);
        await fractionalOwnership.connect(userA).buyShares(5, { value: 50 });
        expect(await fractionalOwnership.getOwningShares(userA.address)).to.equal(5);
    });

    it("should prevent users from buying more shares than available", async function() {
        const { fractionalOwnership, userA } = await loadFixture(deployNewFractionalOwnership);
        await fractionalOwnership.connect(userA).buyShares(50, { value: 500 });
        await expect(fractionalOwnership.connect(userA).buyShares(51, { value: 510 })).to.be.revertedWith("Not enough shares available");
    });

    it("should prevent users from selling more shares than they own", async function() {
        const { fractionalOwnership, userA } = await loadFixture(deployNewFractionalOwnership);
        await fractionalOwnership.connect(userA).buyShares(5, { value: 50 });
        await expect(fractionalOwnership.connect(userA).sellShares(10)).to.be.revertedWith("Not enough shares to sell");
    });

    it("should allow users to sell shares", async function() {
        const { fractionalOwnership, userA } = await loadFixture(deployNewFractionalOwnership);
        await fractionalOwnership.connect(userA).buyShares(5, { value: 50 });
        await fractionalOwnership.connect(userA).sellShares(2);
        expect(await fractionalOwnership.getOwningShares(userA.address)).to.equal(3);
    });
    
    it("should prevent not approved users to buy shares", async function() {
        const { fractionalOwnership, userB} = await loadFixture(deployNewFractionalOwnership);
        await expect(fractionalOwnership.connect(userB).buyShares(5, { value: 50 })).to.be.revertedWith("Only Approved Buyers Can Trade");
    });
    it("should prevent not approved users to buy shares", async function() {
        const { fractionalOwnership, userB} = await loadFixture(deployNewFractionalOwnership);
        await expect(fractionalOwnership.connect(userB).sellShares(5)).to.be.revertedWith("Only Approved Buyers Can Trade");
    });
});