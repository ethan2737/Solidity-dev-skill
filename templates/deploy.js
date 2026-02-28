const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * 部署脚本 - 支持命令行参数
 *
 * 用法:
 *   node scripts/deploy.js [选项]
 *
 * 选项:
 *   --help, -h           显示帮助信息
 *   --contract, -c       合约名称
 *   --args, -a           构造函数参数 (JSON 格式或逗号分隔)
 *   --network, -n        网络名称 (localhost, sepolia, mainnet)
 *   --verify             部署后验证合约
 *
 * 示例:
 *   node scripts/deploy.js --contract Counter
 *   node scripts/deploy.js --contract MyToken --args '[1000000]'
 *   node scripts/deploy.js -c SimpleNFT --network sepolia
 */

// 解析命令行参数
const args = process.argv.slice(2);
const showHelp = args.includes('--help') || args.includes('-h');

if (showHelp) {
  console.log(`
Solidity 合约部署脚本

用法：node scripts/deploy.js [选项]

选项:
  --help, -h           显示帮助信息
  --contract, -c       合约名称
  --args, -a           构造函数参数 (JSON 格式或逗号分隔)
  --network, -n        网络名称 (localhost, sepolia, mainnet)
  --verify             部署后验证合约

示例:
  node scripts/deploy.js --contract Counter
  node scripts/deploy.js --contract MyToken --args '[1000000]'
  node scripts/deploy.js -c SimpleNFT --network sepolia
`);
  process.exit(0);
}

// 获取参数值
function getArgValue(name) {
  const index = args.indexOf(name);
  if (index !== -1 && args[index + 1]) {
    return args[index + 1];
  }
  // 支持简写
  const shortName = name.replace('--', '-');
  const shortIndex = args.indexOf(shortName);
  if (shortIndex !== -1 && args[shortIndex + 1]) {
    return args[shortIndex + 1];
  }
  return null;
}

const contractName = getArgValue('--contract') || getArgValue('-c') || 'Counter';
const argsInput = getArgValue('--args') || getArgValue('-a');
const network = getArgValue('--network') || getArgValue('-n');
const shouldVerify = args.includes('--verify');

// 解析构造函数参数
let constructorArgs = [];
if (argsInput) {
  try {
    // 尝试解析 JSON 格式
    if (argsInput.startsWith('[')) {
      constructorArgs = JSON.parse(argsInput);
    } else {
      // 逗号分隔格式
      constructorArgs = argsInput.split(',').map(arg => arg.trim());
    }
  } catch (e) {
    console.log('警告：无法解析参数，将使用原始字符串');
    constructorArgs = [argsInput];
  }
}

async function main() {
  console.log("=".repeat(50));
  console.log("Solidity 智能合约部署脚本");
  console.log("=".repeat(50));
  console.log(`合约：${contractName}`);
  if (constructorArgs.length > 0) {
    console.log(`参数：${JSON.stringify(constructorArgs)}`);
  }

  // 1. 获取部署者账户
  const [deployer] = await hre.ethers.getSigners();
  console.log("\n[1] 部署者账户:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("    账户余额:", hre.ethers.formatEther(balance), "ETH");

  // 2. 网络信息
  console.log("\n[2] 网络信息:");
  console.log("    网络名称:", hre.network.name);
  console.log("    Chain ID:", hre.network.config.chainId);

  // 3. 编译合约
  console.log("\n[3] 编译合约...");
  await hre.run("compile");
  console.log("    编译完成");

  // 4. 部署合约
  console.log("\n[4] 部署合约...");
  const Contract = await hre.ethers.getContractFactory(contractName);

  let contract;
  if (constructorArgs.length > 0) {
    contract = await Contract.deploy(...constructorArgs);
  } else {
    contract = await Contract.deploy();
  }
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("    合约地址:", contractAddress);

  // 5. 保存部署信息
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId || 31337,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contractAddress: contractAddress,
    contractName: contractName,
    constructorArgs: constructorArgs
  };

  const infoPath = path.join(__dirname, "..", "deployment-info.json");
  fs.writeFileSync(infoPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n[5] 部署信息已保存:", infoPath);

  // 6. 验证合约（可选）
  if (shouldVerify && hre.network.name !== 'localhost' && hre.network.name !== 'hardhat') {
    console.log("\n[6] 验证合约...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: constructorArgs
      });
      console.log("    合约验证成功");
    } catch (error) {
      console.log("    合约验证失败:", error.message);
    }
  } else if (shouldVerify) {
    console.log("\n[6] 跳过验证：本地网络不支持验证");
  }

  console.log("\n" + "=".repeat(50));
  console.log("部署完成!");
  console.log("=".repeat(50));

  return { contract, deployer, info: deploymentInfo };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
