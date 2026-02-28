const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(50));
  console.log("合约验证脚本");
  console.log("=".repeat(50));

  // 读取部署信息
  const infoPath = path.join(__dirname, "..", "deployment-info.json");
  if (!fs.existsSync(infoPath)) {
    console.error("错误：未找到 deployment-info.json，请先运行部署脚本");
    return;
  }

  const info = JSON.parse(fs.readFileSync(infoPath, "utf8"));
  console.log("\n合约地址:", info.contractAddress);
  console.log("合约名称:", info.contractName);
  console.log("网络:", info.network);
  console.log("Chain ID:", info.chainId);

  // 获取合约实例
  const contract = await hre.ethers.getContractAt(info.contractName, info.contractAddress);
  console.log("\n合约实例已获取");

  // TODO: 在这里添加你的验证逻辑
  // 例如：调用合约方法并验证返回值

  console.log("\n验证完成！");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
