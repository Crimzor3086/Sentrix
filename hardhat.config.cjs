require("@nomicfoundation/hardhat-ethers");
require("dotenv").config();

const { MANTLE_SEPOLIA_RPC_URL, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  paths: {
    sources: "./contracts",
  },
  networks: {
    mantleSepolia: {
      type: "http",
      url: MANTLE_SEPOLIA_RPC_URL || "",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
};

