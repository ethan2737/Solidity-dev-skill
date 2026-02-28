// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleERC20
 * @notice 简单的 ERC20 代币合约示例
 * @dev 演示如何使用 OpenZeppelin 库创建代币
 *
 * 学习要点：
 * 1. 继承 OpenZeppelin 合约
 * 2. ERC20 标准接口
 * 3. Ownable 权限控制
 * 4. 代币铸造和销毁
 */
contract SimpleERC20 is ERC20, Ownable {
    /**
     * @notice 构造函数
     * @param initialSupply 初始供应量
     * @dev 部署时将所有代币分配给所有者
     */
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    /**
     * @notice 铸造新代币
     * @param to 接收地址
     * @param amount 铸造数量
     * @dev 只有所有者可以调用
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /**
     * @notice 销毁代币
     * @param amount 销毁数量
     * @dev 销毁调用者自己的代币
     */
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    /**
     * @notice 从指定地址销毁代币
     * @param from 销毁地址
     * @param amount 销毁数量
     * @dev 需要预先授权
     */
    function burnFrom(address from, uint256 amount) public {
        _spendAllowance(from, msg.sender, amount);
        _burn(from, amount);
    }
}
