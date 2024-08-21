const {ethers} = require("hardhat");
const {deploy} = require("./helper");



const FUNDING = "0.00025";
const DEPLOYED_ADDR = "";



const unlockMyFunds = async () => {
  
  console.log("Unlocking funds..");
  const smartLocker = await ethers.getContractAt("SmartLocker", DEPLOYED_ADDR);
  const unlockReceipt = await smartLocker.unlockFunds();
  await unlockReceipt.wait();

  console.log(`Recipient balance after unlock: ${ethers.formatEther(await ethers.provider.getBalance((await ethers.getSigners())[0].getAddress()))};`)
}




const main = async () => {

  const signer = (await ethers.getSigners())[0];
  const args = [6540340, signer.address];
  const smartLocker = await deploy("SmartLocker", args);

  console.log(`Funding smart locker with ${FUNDING}`);
  const receipt = await signer.sendTransaction({
    to: await smartLocker.getAddress(),
    value: ethers.parseEther(FUNDING)
  });

  await receipt.wait();

  let currentBalance = 0;
  while(!currentBalance)
  {
    currentBalance = await ethers.provider.getBalance(await smartLocker.getAddress());
    setTimeout(() => {}, 1000);
  }
  console.log(`Smart locker balance has now reached: ${ethers.formatEther(currentBalance)} ETH`);

  console.log("Attempting a fund unlock, which will fail obviously!");
  const withdrawalTry = await smartLocker.unlockFunds();

  await withdrawalTry.wait();

}



main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*unlockMyFunds().catch((error) => {
  console.error(error);
});*/