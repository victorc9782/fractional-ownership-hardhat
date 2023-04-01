require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337
    },
    sepolia: {
        url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
        accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
};
