async function main() {
  const UltimateBaseCore = await ethers.getContractFactory("UltimateBaseCore");
  console.log("Deploying contract...");
  
  // اینجا باید اسم توکن و سمبل توکن رو وارد کنی
  const contract = await UltimateBaseCore.deploy("MyToken", "MTK");
  
  await contract.waitForDeployment();
  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});