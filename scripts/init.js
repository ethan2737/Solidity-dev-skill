#!/usr/bin/env node

/**
 * Solidity Hardhat 项目初始化脚本
 *
 * 用法:
 *   node scripts/init.js [项目名称] [选项]
 *
 * 选项:
 *   --help, -h         显示帮助信息
 *   --force, -f        覆盖已存在的文件
 *   --template, -t     模板类型 (default, erc20, nft, multisig)
 *   --skip-install     跳过 npm install
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 解析命令行参数
const args = process.argv.slice(2);
const showHelp = args.includes('--help') || args.includes('-h');
const force = args.includes('--force') || args.includes('-f');
const skipInstall = args.includes('--skip-install');
const templateType = args.find((arg, i) => {
  return arg === '--template' || arg === '-t';
});
const templateIndex = templateType ? args.indexOf(templateType) : -1;
const templateValue = templateIndex !== -1 && args[templateIndex + 1] ? args[templateIndex + 1] : 'default';
const projectName = args.find(arg => !arg.startsWith('-') && arg !== '--template' && args[args.indexOf(arg) - 1] !== '--template');

if (showHelp) {
  console.log(`
Solidity Hardhat 项目初始化

用法：node scripts/init.js [项目名称] [选项]

选项:
  --help, -h         显示帮助信息
  --force, -f        覆盖已存在的文件
  --template, -t     模板类型 (default, erc20, nft, multisig)
  --skip-install     跳过 npm install

模板说明:
  default    - 基础 Counter 合约示例
  erc20      - ERC20 代币合约示例
  nft        - ERC721 NFT 合约示例
  multisig   - 多签钱包合约示例

示例:
  node scripts/init.js my-project
  node scripts/init.js my-token --template erc20
  node scripts/init.js --template nft --skip-install
`);
  process.exit(0);
}

// 获取脚本所在目录（处理嵌套路径）
let scriptDir = __dirname;
let projectRoot = path.resolve(scriptDir, '..');

// 向上查找包含 SKILL.md 的目录（技能包根目录）
while (projectRoot !== path.dirname(projectRoot)) {
  if (fs.existsSync(path.join(projectRoot, 'SKILL.md'))) {
    break;
  }
  projectRoot = path.dirname(projectRoot);
}

const templatesDir = path.join(projectRoot, 'templates');
const examplesDir = path.join(projectRoot, 'examples');
const targetDir = projectName ? path.resolve(projectName) : process.cwd();

console.log('='.repeat(50));
console.log('Solidity Hardhat 项目初始化');
console.log('='.repeat(50));
console.log(`模板：${templateValue}`);

// 创建目录结构
console.log('\n[1/4] 创建目录结构...');
const dirs = ['contracts', 'scripts', 'test'];
dirs.forEach(dir => {
  const dirPath = path.join(targetDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`  创建：${dir}/`);
  }
});

// 复制模板文件
console.log('\n[2/4] 复制模板文件...');
const templates = [
  'hardhat.config.js',
  'package.json',
  '.gitignore',
  '.env.example',
  '.solhint.json'
];

if (fs.existsSync(templatesDir)) {
  templates.forEach(file => {
    const src = path.join(templatesDir, file);
    const dest = path.join(targetDir, file);
    if (!fs.existsSync(dest) || force) {
      fs.copyFileSync(src, dest);
      console.log(`  复制：${file}`);
    } else {
      console.log(`  跳过：${file} (已存在，使用 --force 覆盖)`);
    }
  });

  // 复制脚本模板
  const scriptTemplates = ['deploy.js', 'verify.js', 'analyze-gas.js'];
  scriptTemplates.forEach(file => {
    const src = path.join(templatesDir, file);
    const dest = path.join(targetDir, 'scripts', file);
    if (!fs.existsSync(dest) || force) {
      fs.copyFileSync(src, dest);
      console.log(`  复制：scripts/${file}`);
    } else {
      console.log(`  跳过：scripts/${file} (已存在)`);
    }
  });
} else {
  console.log('  警告：找不到 templates 目录');
}

// 根据模板类型复制示例合约
console.log('\n[2.5/4] 复制示例合约...');
let contractFile, testFile;
switch (templateValue) {
  case 'erc20':
    contractFile = 'erc20.sol';
    break;
  case 'nft':
    contractFile = 'simple-nft.sol';
    break;
  case 'multisig':
    contractFile = 'multisig-wallet.sol';
    break;
  default:
    contractFile = 'simple-storage.sol';
}

if (fs.existsSync(examplesDir)) {
  const srcContract = path.join(examplesDir, contractFile);
  if (fs.existsSync(srcContract)) {
    const destContract = path.join(targetDir, 'contracts', contractFile);
    fs.copyFileSync(srcContract, destContract);
    console.log(`  复制合约：${contractFile}`);
  }

  // 复制配套测试文件
  const testTemplateName = contractFile.replace('.sol', '.test.js');
  const srcTest = path.join(examplesDir, testTemplateName);
  if (fs.existsSync(srcTest)) {
    const destTest = path.join(targetDir, 'test', testTemplateName);
    fs.copyFileSync(srcTest, destTest);
    console.log(`  复制测试：${testTemplateName}`);
  } else {
    // 使用通用测试模板
    const testTemplate = path.join(templatesDir, 'test.template.js');
    const testDest = path.join(targetDir, 'test', 'Sample.test.js');
    if (!fs.existsSync(testDest) || force) {
      fs.copyFileSync(testTemplate, testDest);
      console.log(`  复制：test/Sample.test.js`);
    }
  }
}

// 安装依赖
if (!skipInstall) {
  console.log('\n[3/4] 安装依赖...');
  try {
    execSync('npm install', { cwd: targetDir, stdio: 'inherit' });
    console.log('  依赖安装完成');
  } catch (error) {
    console.log('  错误：npm install 失败，请检查网络连接');
    process.exit(1);
  }
} else {
  console.log('\n[3/4] 跳过安装依赖 (--skip-install)');
}

// 初始化 Git
console.log('\n[4/4] 初始化 Git 仓库...');
const gitPath = path.join(targetDir, '.git');
if (!fs.existsSync(gitPath)) {
  try {
    execSync('git init', { cwd: targetDir, stdio: 'ignore' });
    console.log('  Git 仓库已初始化');
  } catch (error) {
    console.log('  警告：Git 初始化失败');
  }
} else {
  console.log('  Git 仓库已存在');
}

console.log('\n' + '='.repeat(50));
console.log('项目初始化完成!');
console.log('='.repeat(50));
console.log(`
项目位置：${targetDir}

项目结构:
  contracts/     - Solidity 合约 (${contractFile})
  scripts/       - 部署和验证脚本
  test/          - 测试文件

可用命令:
  npm run compile      - 编译合约
  npm run node         - 启动本地节点
  npm run deploy       - 部署合约
  npm test             - 运行测试
  npm run test:coverage - 运行测试覆盖率
  npm run lint         - Solidity 代码检查
  npm run clean        - 清理缓存

下一步:
  1. 查看 contracts/${contractFile} 了解示例合约
  2. 运行 npm run compile 编译合约
  3. 运行 npm test 运行测试
  4. 运行 npm run node 启动本地节点
  5. 运行 npm run deploy 部署合约
`);
