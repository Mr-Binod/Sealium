const { ethers } = require("hardhat");


const Deploy = async() => {
    const Contract = await ethers.getContractFactory('DidContract') 
    const wait = await Contract.deploy()
    console.log(wait.target, 'success')
}


Deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});  