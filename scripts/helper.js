const {ethers, network} = require("hardhat");


const deploy = async (artifactName, args) => {

    console.log(`Deploying ${artifactName} on ${network.name}`);

    const artifact = await ethers.getContractFactory(artifactName);
    const deployment = await artifact.deploy(...args);

    await deployment.waitForDeployment();

    console.log(`${artifactName} deployed at: ${await deployment.getAddress()}`);

    return deployment;
}

module.exports = {deploy};