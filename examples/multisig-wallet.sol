// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SimpleMultisig
 * @notice 简单的多签钱包合约示例
 * @dev 演示多签机制和交易执行
 *
 * 学习要点：
 * 1. 多签机制实现
 * 2. 交易提案和确认
 * 3. ETH 转账安全
 * 4. 重入防护
 */
contract SimpleMultisig {
    // 所有者列表
    address[] public owners;
    mapping(address => bool) public isOwner;

    // 需要的签名数量
    uint256 public requiredConfirmations;

    // 交易结构
    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 confirmations;
    }

    // 交易列表
    Transaction[] public transactions;

    // 交易确认记录
    mapping(uint256 => mapping(address => bool)) public hasConfirmed;

    event OwnerAdded(address indexed owner);
    event OwnerRemoved(address indexed owner);
    event TransactionProposed(uint256 indexed txId, address indexed proposer);
    event TransactionConfirmed(uint256 indexed txId, address indexed owner);
    event TransactionExecuted(uint256 indexed txId);
    event DepositReceived(address indexed from, uint256 amount);

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not an owner");
        _;
    }

    modifier txExists(uint256 _txId) {
        require(_txId < transactions.length, "Transaction does not exist");
        _;
    }

    modifier notExecuted(uint256 _txId) {
        require(!transactions[_txId].executed, "Transaction already executed");
        _;
    }

    modifier notConfirmed(uint256 _txId, address _owner) {
        require(!hasConfirmed[_txId][_owner], "Transaction already confirmed");
        _;
    }

    /**
     * @notice 构造函数
     * @param _owners 初始所有者列表
     * @param _required 需要的确认数量
     */
    constructor(address[] memory _owners, uint256 _required) {
        require(_owners.length > 0, "Owners required");
        require(_required > 0 && _required <= _owners.length, "Invalid required number");

        for (uint256 i = 0; i < _owners.length; i++) {
            owners.push(_owners[i]);
            isOwner[_owners[i]] = true;
            emit OwnerAdded(_owners[i]);
        }

        requiredConfirmations = _required;
    }

    receive() external payable {
        emit DepositReceived(msg.sender, msg.value);
    }

    /**
     * @notice 提议新交易
     * @param _to 目标地址
     * @param _value ETH 数量
     * @param _data 数据
     * @return 交易 ID
     */
    function proposeTransaction(
        address _to,
        uint256 _value,
        bytes memory _data
    ) public onlyOwner returns (uint256) {
        transactions.push(Transaction({
            to: _to,
            value: _value,
            data: _data,
            executed: false,
            confirmations: 0
        }));

        uint256 txId = transactions.length - 1;
        emit TransactionProposed(txId, msg.sender);

        return txId;
    }

    /**
     * @notice 确认交易
     * @param _txId 交易 ID
     */
    function confirmTransaction(uint256 _txId)
        public
        onlyOwner
        txExists(_txId)
        notExecuted(_txId)
        notConfirmed(_txId, msg.sender)
    {
        transactions[_txId].confirmations += 1;
        hasConfirmed[_txId][msg.sender] = true;
        emit TransactionConfirmed(_txId, msg.sender);
    }

    /**
     * @notice 执行交易
     * @param _txId 交易 ID
     */
    function executeTransaction(uint256 _txId)
        public
        onlyOwner
        txExists(_txId)
        notExecuted(_txId)
    {
        Transaction storage tx = transactions[_txId];
        require(tx.confirmations >= requiredConfirmations, "Not enough confirmations");

        tx.executed = true;

        (bool success, ) = tx.to.call{value: tx.value}(tx.data);
        require(success, "Transaction execution failed");

        emit TransactionExecuted(_txId);
    }

    /**
     * @notice 获取交易总数
     * @return 交易数量
     */
    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    /**
     * @notice 获取所有者数量
     * @return 所有者数量
     */
    function getOwnerCount() public view returns (uint256) {
        return owners.length;
    }

    /**
     * @notice 获取合约余额
     * @return 余额（wei）
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
