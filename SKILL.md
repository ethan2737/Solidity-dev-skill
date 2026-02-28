---
name: solidity-dev
description: Solidity 智能合约开发工具包 - 支持 Hardhat 项目初始化、合约编译、部署、测试、Gas 分析和静态检查
license: MIT
---

# Solidity 智能合约开发

使用 Hardhat 框架进行 Solidity 智能合约开发。

**Helper Scripts Available**:
- `scripts/init.js` - 初始化 Hardhat 项目结构（支持模板选择）
- `scripts/deploy.js` - 部署合约到指定网络（支持命令行参数）
- `scripts/verify.js` - 验证部署的合约

**Always run scripts with `--help` first** to see usage. DO NOT read the source until you try running the script first and find that a customized solution is absolutely necessary. These scripts can be large and thus pollute your context window. They exist to be called directly as black-box scripts rather than ingested into your context window.

## 决策树：选择你的方法

```
用户任务 → 是否需要创建新项目？
    ├─ 是 → 运行：node scripts/init.js [选项]
    │        ├─ --template erc20    创建 ERC20 代币项目
    │        ├─ --template nft      创建 NFT 项目
    │        └─ --template multisig 创建多签钱包项目
    │
    └─ 否（已有项目）→ 是否需要部署？
        ├─ 否 → 编写/运行测试
        │        ├─ npm test             运行测试
        │        └─ npm run test:coverage 运行覆盖率报告
        │
        └─ 是 → 是否需要部署到测试网/主网？
            ├─ 否 → 部署到本地节点
            │        npm run node (终端 1)
            │        node scripts/deploy.js --contract Counter (终端 2)
            │
            └─ 是 → 配置 .env 并部署
                     node scripts/deploy.js --contract MyToken --network sepolia
```

## 快速开始

### 创建新项目

```bash
# 方法 1: 使用初始化脚本（推荐）
# 基础项目
node scripts/init.js my-project

# ERC20 代币项目
node scripts/init.js my-token --template erc20

# NFT 项目
node scripts/init.js my-nft --template nft

# 多签钱包项目
node scripts/init.js my-multisig --template multisig

# 跳过依赖安装
node scripts/init.js --skip-install

# 方法 2: 手动创建
mkdir -p contracts scripts test
cp templates/* .
npm install
```

### 标准开发流程

```bash
# 1. 编译合约
npm run compile

# 2. 启动本地节点（新开终端，保持运行）
npm run node

# 3. 部署合约（另一终端，支持命令行参数）
node scripts/deploy.js --contract Counter
node scripts/deploy.js -c MyToken --args '[1000000]'

# 4. 运行测试
npm test

# 5. 运行测试覆盖率
npm run test:coverage

# 6. Gas 分析
npm run analyze-gas

# 7. 静态检查
npm run lint
```

## 示例合约

### Counter (基础示例)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter {
    uint256 private count;
    address public owner;

    event CountChanged(uint256 oldCount, uint256 newCount);

    constructor() {
        count = 0;
        owner = msg.sender;
    }

    function increment() public {
        uint256 oldCount = count;
        count++;
        emit CountChanged(oldCount, count);
    }

    function getCount() public view returns (uint256) {
        return count;
    }
}
```

### ERC20 代币（使用 OpenZeppelin）

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleERC20 is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

### NFT（ERC721）

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SimpleNFT is ERC721, Ownable {
    uint256 private _nextTokenId;

    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {
        _nextTokenId = 1;
    }

    function mint(address to, string memory uri) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }
}
```

## 常见陷阱

❌ **不要**在未启动本地节点的情况下运行 `npm run deploy`
✅ **要**先运行 `npm run node` 启动本地节点

❌ **不要**在测试中共享合约实例（每个测试应该独立）
✅ **要**使用 `beforeEach` 部署新实例

❌ **不要**将 `.env` 文件提交到 git
✅ **要**使用 `.env.example` 作为模板

❌ **不要**忽略 Solidity 版本兼容性
✅ **要**使用 `^0.8.24` 并启用优化器

## 网络配置

| 网络 | 命令 | Chain ID |
|------|------|----------|
| 本地节点 | `npm run deploy` | 31337 |
| Sepolia | `npm run deploy:sepolia` | 11155111 |
| 主网 | `npm run deploy:mainnet` | 1 |

## 环境变量

创建 `.env` 文件：

```bash
# 本地开发不需要配置

# Sepolia 测试网
PRIVATE_KEY=你的私钥
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/你的 API_KEY
INFURA_API_KEY=你的 Infura API 密钥

# 以太坊主网
MAINNET_RPC_URL=https://mainnet.infura.io/v3/你的 API_KEY
ETHERSCAN_API_KEY=你的 Etherscan API 密钥
```

## 最佳实践

- **使用模板文件** - `templates/` 目录包含标准配置文件
- **测试驱动开发** - 先写测试再实现功能
- **Gas 优化** - 使用 `npm run analyze-gas` 分析 Gas 消耗
- **安全第一** - 理解重入、溢出等常见漏洞
- **使用 OpenZeppelin** - 复用经过审计的合约库
- **静态检查** - 使用 `npm run lint` 检查代码风格
- **覆盖率报告** - 使用 `npm run test:coverage` 确保测试覆盖

## 命令行参数

### init.js

```bash
node scripts/init.js [项目名称] [选项]

选项:
  --help, -h         显示帮助信息
  --force, -f        覆盖已存在的文件
  --template, -t     模板类型 (default, erc20, nft, multisig)
  --skip-install     跳过 npm install
```

### deploy.js

```bash
node scripts/deploy.js [选项]

选项:
  --help, -h           显示帮助信息
  --contract, -c       合约名称
  --args, -a           构造函数参数 (JSON 格式或逗号分隔)
  --network, -n        网络名称
  --verify             部署后验证合约
```

## 可用命令

| 命令 | 说明 |
|------|------|
| `npm run compile` | 编译合约 |
| `npm test` | 运行测试 |
| `npm run test:coverage` | 运行测试覆盖率报告 |
| `npm run node` | 启动本地节点 |
| `npm run deploy` | 部署合约到本地 |
| `npm run deploy:sepolia` | 部署到 Sepolia 测试网 |
| `npm run deploy:mainnet` | 部署到主网 |
| `npm run analyze-gas` | Gas 分析 |
| `npm run lint` | Solidity 静态检查 |
| `npm run clean` | 清理缓存 |
| `npx hardhat console` | 进入交互控制台 |

## 参考文件

- **templates/** - 可复用的模板文件
- **examples/** - 示例合约和测试
- **scripts/** - 辅助脚本
