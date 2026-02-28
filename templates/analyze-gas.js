const hre = require("hardhat");

async function main() {
  console.log("=".repeat(50));
  console.log("Gas 分析工具");
  console.log("=".repeat(50));

  // 部署合约
  console.log("\n部署合约...");
  // TODO: 修改为你的合约名称
  const Contract = await hre.ethers.getContractFactory("YourContractName");
  const contract = await Contract.deploy();
  await contract.waitForDeployment();

  // 分析部署 Gas
  const deploymentReceipt = await hre.ethers.provider.getTransactionReceipt(
    contract.deploymentTransaction().hash
  );
  console.log("\n部署 Gas 使用:", deploymentReceipt.gasUsed.toString());

  // 分析函数 Gas
  console.log("\n分析函数 Gas...");

  // TODO: 替换为你的函数
  // 示例：
  // const tx1 = await contract.someFunction();
  // const receipt1 = await tx1.wait();
  // console.log("someFunction() Gas 使用:", receipt1.gasUsed.toString());

  console.log("\n提示：view/pure 函数是离线调用，不消耗 Gas");

  console.log("\n" + "=".repeat(50));
  console.log("Gas 分析完成");
  console.log("=".repeat(50));
}

main()
  .catch(console.error);
