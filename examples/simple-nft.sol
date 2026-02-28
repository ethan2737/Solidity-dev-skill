// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SimpleNFT
 * @notice 简单的 ERC721 NFT 合约示例
 * @dev 演示如何创建 NFT 合约
 *
 * 学习要点：
 * 1. ERC721 标准接口
 * 2. NFT 铸造（URI 支持）
 * 3. 版税机制（EIP-2981）
 */
contract SimpleNFT is ERC721, Ownable {
    uint256 private _nextTokenId;

    // 简单的版税信息
    mapping(uint256 => uint256) private _royalties;

    event TokenMinted(address indexed to, uint256 indexed tokenId, string uri);
    event RoyaltySet(uint256 indexed tokenId, uint256 basisPoints);

    /**
     * @notice 构造函数
     * @dev 初始化合约名称和符号
     */
    constructor() ERC721("MyNFT", "MNFT") Ownable(msg.sender) {
        _nextTokenId = 1;
    }

    /**
     * @notice 铸造新 NFT
     * @param to 接收地址
     * @param uri Token URI
     * @return 新铸造的 Token ID
     */
    function mint(address to, string memory uri) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        emit TokenMinted(to, tokenId, uri);
        return tokenId;
    }

    /**
     * @notice 批量铸造 NFT
     * @param to 接收地址
     * @param uris Token URI 列表
     * @return 铸造的 Token ID 列表
     */
    function batchMint(address to, string[] memory uris) public onlyOwner returns (uint256[] memory) {
        uint256[] memory tokenIds = new uint256[](uris.length);
        for (uint256 i = 0; i < uris.length; i++) {
            tokenIds[i] = _nextTokenId++;
            _safeMint(to, tokenIds[i]);
            emit TokenMinted(to, tokenIds[i], uris[i]);
        }
        return tokenIds;
    }

    /**
     * @notice 设置版税
     * @param tokenId Token ID
     * @param basisPoints 版税基点（100 = 1%）
     */
    function setRoyalty(uint256 tokenId, uint256 basisPoints) public onlyOwner {
        require(basisPoints <= 1000, "Royalty too high"); // Max 10%
        _royalties[tokenId] = basisPoints;
        emit RoyaltySet(tokenId, basisPoints);
    }

    /**
     * @notice 获取版税信息
     * @param tokenId Token ID
     * @return 版税基点
     */
    function getRoyalty(uint256 tokenId) public view returns (uint256) {
        return _royalties[tokenId];
    }

    /**
     * @notice 获取下一个 Token ID
     * @return 下一个可用的 Token ID
     */
    function nextTokenId() public view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @notice 获取合约 NFT 总数
     * @return 总供应量
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId - 1;
    }
}
