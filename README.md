# Solidity 智能合约开发技能包

**版本**: 1.0.0
**可用性评分**: 100/100

---

## 快速开始

### 安装

将 `skills/solidity-dev` 目录复制到你的项目中：

```bash
cp -r skills/solidity-dev /your/project/skills/
```

### 使用

#### 创建新项目

```bash
# 基础项目
node scripts/init.js my-project

# ERC20 代币项目
node scripts/init.js my-token --template erc20

# NFT 项目
node scripts/init.js my-nft --template nft

# 多签钱包项目
node scripts/init.js my-multisig --template multisig
```

#### 部署合约

```bash
# 本地部署
node scripts/deploy.js --contract Counter

# 带参数部署
node scripts/deploy.js -c MyToken --args '[1000000]'

# 部署到测试网
node scripts/deploy.js -c MyNFT --network sepolia
```

---

## 功能特性

| 功能 | 命令 | 说明 |
|------|------|------|
| 项目初始化 | `node scripts/init.js` | 支持多种模板 |
| 合约编译 | `npm run compile` | Hardhat 编译 |
| 合约部署 | `node scripts/deploy.js` | 支持命令行参数 |
| 测试运行 | `npm test` | Mocha + Chai |
| 覆盖率报告 | `npm run test:coverage` | HTML + 文本报告 |
| Gas 分析 | `npm run analyze-gas` | 分析 Gas 消耗 |
| 静态检查 | `npm run lint` | solhint 代码检查 |

---

## 目录结构

```
skills/solidity-dev/
├── SKILL.md                  # 技能说明
├── LICENSE.txt               # MIT 许可证
├── TEST-REPORT.md            # 测试报告
├── scripts/
│   ├── init.js               # 初始化脚本
│   └── deploy.js             # 部署脚本
├── templates/
│   ├── hardhat.config.js     # Hardhat 配置
│   ├── package.json          # 依赖配置
│   ├── deploy.js             # 部署模板
│   ├── verify.js             # 验证模板
│   ├── analyze-gas.js        # Gas 分析模板
│   ├── test.template.js      # 测试模板
│   ├── .gitignore
│   ├── .env.example
│   └── .solhint.json         # 静态检查配置
└── examples/
    ├── simple-storage.sol    # Counter 示例
    ├── simple-storage.test.js
    ├── erc20.sol             # ERC20 示例
    ├── erc20.test.js
    ├── simple-nft.sol        # NFT 示例
    ├── simple-nft.test.js
    ├── multisig-wallet.sol   # 多签钱包示例
```

---

## 依赖包

### 开发依赖
- @nomicfoundation/hardhat-toolbox
- @nomicfoundation/hardhat-ethers
- chai
- hardhat
- hardhat-gas-reporter
- solidity-coverage
- solhint

### 生产依赖
- @openzeppelin/contracts
- dotenv

---

## 示例合约

### Counter (基础)
- 研究要点：状态变量、事件、view 函数
- 适合：Solidity 入门学习

### ERC20 (代币)
- 学习要点：OpenZeppelin、继承、铸造/销毁
- 适合：创建代币项目

### NFT (ERC721)
- 学习要点：NFT 标准、URI、批量铸造
- 适合：NFT 项目

### Multisig (多签钱包)
- 学习要点：多签机制、交易提案、安全
- 适合：理解多签原理

---

## 可用命令

```bash
# 开发
npm run compile          # 编译合约
npm test                 # 运行测试
npm run test:coverage    # 覆盖率报告
npm run lint             # 静态检查
npm run lint:fix         # 自动修复

# 部署
npm run node             # 启动本地节点
npm run deploy           # 部署到本地
npm run deploy:sepolia   # 部署到 Sepolia
npm run deploy:mainnet   # 部署到主网

# 分析
npm run analyze-gas      # Gas 分析
npm run clean            # 清理缓存
npx hardhat console      # 交互控制台
```

---

## 使用示例

### 示例 1: 创建 ERC20 代币

```bash
# 1. 初始化
node scripts/init.js my-token --template erc20
cd my-token

# 2. 编译
npm run compile

# 3. 测试
npm test
npm run test:coverage

# 4. 部署
npm run node                    # 终端 1
node scripts/deploy.js -c SimpleERC20 --args '[1000000]'  # 终端 2

# 5. 检查
npm run lint
```

### 示例 2: 创建 NFT 项目

```bash
# 1. 初始化
node scripts/init.js my-art --template nft
cd my-art

# 2. 编译
npm run compile

# 3. 测试
npm test

# 4. 部署
npm run node              # 终端 1
node scripts/deploy.js -c SimpleNFT  # 终端 2
```

---

## 命令行参数

### init.js

```bash
node scripts/init.js [项目名称] [选项]

选项:
  --help, -h         显示帮助
  --force, -f        覆盖文件
  --template, -t     模板类型 (default/erc20/nft/multisig)
  --skip-install     跳过安装
```

### deploy.js

```bash
node scripts/deploy.js [选项]

选项:
  --help, -h           显示帮助
  --contract, -c       合约名称
  --args, -a           构造函数参数
  --network, -n        网络名称
  --verify             部署后验证
```

---

## 许可证

MIT License

---

## 支持

如有问题，请查看：
- `SKILL.md` - 详细使用说明
- `TEST-REPORT.md` - 测试报告
- `examples/` - 示例代码
