const {
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FractionalOwnership", function() {

    async function deployNewFractionalOwnership() {
        const totalShares = 100;
        const price = 10;

        // Contracts are deployed using the first signer/account by default
        const [owner, userA, userB] = await ethers.getSigners();

        const FractionalOwnership = await ethers.getContractFactory("FractionalOwnership");
        const fractionalOwnership = await FractionalOwnership.deploy(totalShares, price);

        return { fractionalOwnership, totalShares, price, owner, userA, userB };
    }

    // beforeEach(async function() {
    //     [owner, alice, bob] = await ethers.getSigners();
    //     const FractionalOwnership = await ethers.getContractFactory("FractionalOwnership");
    //     fractionalOwnership = await FractionalOwnership.deploy(totalShares, price);
    //     await fractionalOwnership.deployed();withdrawFunds
    // });

    it("should deploy with correct initial values", async function() {
        const { fractionalOwnership, owner, totalShares, price } = await loadFixture(deployNewFractionalOwnership);
        expect(await fractionalOwnership.owner()).to.equal(owner.address);
        expect(await fractionalOwnership.totalShares()).to.equal(totalShares);
        expect(await fractionalOwnership.sharePrice()).to.equal(price);
    });

    it("should allow users to buy shares", async function() {
        const { fractionalOwnership, userA } = await loadFixture(deployNewFractionalOwnership);
        await fractionalOwnership.connect(userA).buyShares(5, { value: 50 });
        expect(await fractionalOwnership.shares(userA.address)).to.equal(5);
    });

    it("should prevent users from buying more shares than available", async function() {
        const { fractionalOwnership, userA, userB } = await loadFixture(deployNewFractionalOwnership);
        await fractionalOwnership.connect(userA).buyShares(50, { value: 500 });
        await expect(fractionalOwnership.connect(userB).buyShares(51, { value: 510 })).to.be.revertedWith("Not enough shares available");
    });

    it("should prevent users from selling more shares than they own", async function() {
        const { fractionalOwnership, userA, userB } = await loadFixture(deployNewFractionalOwnership);
        await fractionalOwnership.connect(userA).buyShares(5, { value: 50 });
        await expect(fractionalOwnership.connect(userB).sellShares(10)).to.be.revertedWith("Not enough shares to sell");
    });

    it("should allow users to sell shares", async function() {
        const { fractionalOwnership, userA, userB } = await loadFixture(deployNewFractionalOwnership);
        await fractionalOwnership.connect(userA).buyShares(5, { value: 50 });
        await fractionalOwnership.connect(userA).sellShares(2);
        expect(await fractionalOwnership.shares(userA.address)).to.equal(3);
    });
});