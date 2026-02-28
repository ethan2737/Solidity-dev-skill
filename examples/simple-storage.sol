// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SimpleStorage
 * @notice 一个简单的存储合约示例
 * @dev 用于演示 Solidity 基础功能
 */
contract SimpleStorage {
    uint256 private value;

    event ValueChanged(uint256 oldValue, uint256 newValue);

    /**
     * @notice 设置新值
     * @param _value 要存储的值
     */
    function set(uint256 _value) public {
        emit ValueChanged(value, _value);
        value = _value;
    }

    /**
     * @notice 获取当前值
     * @return 当前存储的值
     */
    function get() public view returns (uint256) {
        return value;
    }
}
