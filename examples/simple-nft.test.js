const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * SimpleNFT 合约测试
 *
 * 运行测试：npm test
 */
describe("SimpleNFT", function () {
  let nft, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("SimpleNFT");
    nft = await NFT.deploy();
    await nft.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const address = await nft.getAddress();
      expect(address).to.not.equal(ethers.ZeroAddress);
    });

    it("Should set the correct owner", async function () {
      expect(await nft.owner()).to.equal(owner.address);
    });

    it("Should start with tokenId 1", async function () {
      expect(await nft.nextTokenId()).to.equal(1);
    });

    it("Should have correct name and symbol", async function () {
      expect(await nft.name()).to.equal("MyNFT");
      expect(await nft.symbol()).to.equal("MNFT");
    });
  });

  describe("mint()", function () {
    it("Should mint NFT to specified address (owner only)", async function () {
      const uri = "ipfs://test1";
      await nft.mint(addr1.address, uri);
      expect(await nft.ownerOf(1)).to.equal(addr1.address);
      expect(await nft.tokenURI(1)).to.equal(uri);
    });

    it("Should increment nextTokenId after mint", async function () {
      await nft.mint(addr1.address, "ipfs://test1");
      expect(await nft.nextTokenId()).to.equal(2);
    });

    it("Should emit TokenMinted event", async function () {
      await expect(nft.mint(addr1.address, "ipfs://test1"))
        .to.emit(nft, "TokenMinted")
        .withArgs(addr1.address, 1, "ipfs://test1");
    });

    it("Should revert when called by non-owner", async function () {
      await expect(nft.connect(addr1).mint(addr1.address, "ipfs://test"))
        .to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });
  });

  describe("batchMint()", function () {
    it("Should batch mint multiple NFTs", async function () {
      const uris = ["ipfs://1", "ipfs://2", "ipfs://3"];
      await nft.batchMint(addr1.address, uris);

      expect(await nft.ownerOf(1)).to.equal(addr1.address);
      expect(await nft.ownerOf(2)).to.equal(addr1.address);
      expect(await nft.ownerOf(3)).to.equal(addr1.address);
    });

    it("Should increment nextTokenId correctly", async function () {
      const uris = ["ipfs://1", "ipfs://2"];
      await nft.batchMint(addr1.address, uris);
      expect(await nft.nextTokenId()).to.equal(3);
    });

    it("Should revert when called by non-owner", async function () {
      await expect(nft.connect(addr1).batchMint(addr1.address, ["ipfs://1"]))
        .to.be.revertedWithCustomError(nft, "OwnableUnauthorizedAccount");
    });
  });

  describe("setRoyalty()", function () {
    it("Should set royalty for token (owner only)", async function () {
      await nft.mint(addr1.address, "ipfs://test");
      await nft.setRoyalty(1, 500); // 5%
      expect(await nft.getRoyalty(1)).to.equal(500);
    });

    it("Should revert when royalty too high", async function () {
      await nft.mint(addr1.address, "ipfs://test");
      await expect(nft.setRoyalty(1, 1001))
        .to.be.revertedWith("Royalty too high");
    });

    it("Should emit RoyaltySet event", async function () {
      await nft.mint(addr1.address, "ipfs://test");
      await expect(nft.setRoyalty(1, 250))
        .to.emit(nft, "RoyaltySet")
        .withArgs(1, 250);
    });
  });

  describe("totalSupply()", function () {
    it("Should return 0 initially", async function () {
      expect(await nft.totalSupply()).to.equal(0);
    });

    it("Should return correct supply after minting", async function () {
      await nft.mint(addr1.address, "ipfs://1");
      await nft.mint(addr2.address, "ipfs://2");
      expect(await nft.totalSupply()).to.equal(2);
    });
  });
});
