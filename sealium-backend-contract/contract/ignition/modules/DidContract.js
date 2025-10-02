const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("DidContractModule", (m) => {
  // Deploy the "DidContract" contract. Ensure you have a contract with this name.
  // The `m.contract()` function returns a "Future" object, not an address.
  const didContract = m.contract("DidContract");

  // The console.log here will show the Future object structure, not the deployed address.
  // The actual address will be available in the deployment artifacts after running ignition.
  console.log(didContract, "Deploying DidContract...");
  return { didContract };
});