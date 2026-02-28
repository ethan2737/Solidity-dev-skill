#!/usr/bin/env node

/**
 * Solidity 合约部署脚本
 *
 * 用法:
 *   node scripts/deploy.js --network <网络名称>
 *
 * 选项:
 *   --help, -h           显示帮助信息
 *   --network, -n        网络名称 (localhost, sepolia, mainnet)
 *   --contract, -c       合约名称
 */

const { execSync } = require('child_process');
const path = require('path');

// 解析命令行参数
const args = process.argv.slice(2);
const showHelp = args.includes('--help') || args.includes('-h');

if (showHelp) {
  console.log(`
Solidity 合约部署脚本

用法：node scripts/deploy.js --network <网络名称> [选项]

选项:
  --help, -h           显示帮助信息
  --network, -n        网络名称 (localhost, sepolia, mainnet)
  --contract, -c       合约名称（默认：自动检测）

示例:
  node scripts/deploy.js --network localhost
  node scripts/deploy.js --network sepolia --contract MyToken
`);
  process.exit(0);
}

const networkIndex = args.indexOf('--network') || args.indexOf('-n');
const network = networkIndex !== -1 ? args[networkIndex + 1] : 'localhost';

console.log('='.repeat(50));
console.log('Solidity 合约部署');
console.log('='.repeat(50));
console.log(`\n网络：${network}`);

// 运行 Hardhat 部署命令
try {
  const cmd = `npx hardhat run scripts/deploy.js --network ${network}`;
  console.log(`\n执行：${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
} catch (error) {
  console.log('\n错误：部署失败');
  console.log('请确保:');
  console.log('  1. 合约已编译 (npm run compile)');
  console.log('  2. 本地节点已启动 (npm run node)');
  console.log('  3. .env 文件已正确配置（测试网/主网部署）');
  process.exit(1);
}
