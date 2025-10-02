require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); 

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.30",
  networks: {
    sealium: {
      url: process.env.RPC_URL,
      // It's good practice to name env variables according to their use-case.
      accounts: [process.env.SEALIUM_DEPLOYER_PRIVATE_KEY],
      gasPrice: 50000000000,
      chainId: Number(process.env.CHAIN_ID)
    }
  }
};
