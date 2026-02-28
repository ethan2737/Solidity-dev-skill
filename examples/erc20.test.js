const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * SimpleERC20 合约测试
 *
 * 运行测试：npm test
 */
describe("SimpleERC20", function () {
  let token, owner, addr1, addr2;
  const initialSupply = 1000000;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("SimpleERC20");
    token = await Token.deploy(initialSupply);
    await token.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const address = await token.getAddress();
      expect(address).to.not.equal(ethers.ZeroAddress);
    });

    it("Should set the correct owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should mint initial supply to owner", async function () {
      const decimals = await token.decimals();
      const expectedSupply = BigInt(initialSupply) * BigInt(10 ** decimals);
      expect(await token.balanceOf(owner.address)).to.equal(expectedSupply);
    });

    it("Should have correct name and symbol", async function () {
      expect(await token.name()).to.equal("MyToken");
      expect(await token.symbol()).to.equal("MTK");
    });
  });

  describe("mint()", function () {
    it("Should mint tokens to specified address (owner only)", async function () {
      const mintAmount = ethers.parseEther("1000");
      await token.mint(addr1.address, mintAmount);
      expect(await token.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    it("Should revert when called by non-owner", async function () {
      const mintAmount = ethers.parseEther("1000");
      await expect(token.connect(addr1).mint(addr1.address, mintAmount))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");
    });
  });

  describe("burn()", function () {
    it("Should burn tokens from caller", async function () {
      const burnAmount = ethers.parseEther("100");
      await token.burn(burnAmount);
      const decimals = await token.decimals();
      const expectedSupply = BigInt(initialSupply) * BigInt(10 ** decimals) - burnAmount;
      expect(await token.balanceOf(owner.address)).to.equal(expectedSupply);
    });

    it("Should emit transfer event on burn", async function () {
      const burnAmount = ethers.parseEther("50");
      await expect(token.burn(burnAmount))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, ethers.ZeroAddress, burnAmount);
    });
  });

  describe("burnFrom()", function () {
    it("Should burn tokens from specified address with allowance", async function () {
      const approveAmount = ethers.parseEther("200");
      const burnAmount = ethers.parseEther("100");

      // Owner approves addr1 to spend tokens
      await token.approve(addr1.address, approveAmount);

      // addr1 burns from owner's balance
      await token.connect(addr1).burnFrom(owner.address, burnAmount);

      const decimals = await token.decimals();
      const expectedSupply = BigInt(initialSupply) * BigInt(10 ** decimals) - burnAmount;
      expect(await token.balanceOf(owner.address)).to.equal(expectedSupply);
    });

    it("Should revert when insufficient allowance", async function () {
      const burnAmount = ethers.parseEther("100");
      await expect(token.connect(addr1).burnFrom(owner.address, burnAmount))
        .to.be.reverted;
    });
  });

  describe("transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const transferAmount = ethers.parseEther("500");
      await token.transfer(addr1.address, transferAmount);
      expect(await token.balanceOf(addr1.address)).to.equal(transferAmount);
    });

    it("Should emit Transfer event", async function () {
      const transferAmount = ethers.parseEther("100");
      await expect(token.transfer(addr1.address, transferAmount))
        .to.emit(token, "Transfer")
        .withArgs(owner.address, addr1.address, transferAmount);
    });
  });
});
