const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * SimpleStorage 合约测试示例
 *
 * 运行测试：npm test
 */
describe("SimpleStorage", function () {
  let contract;
  let owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const Contract = await ethers.getContractFactory("SimpleStorage");
    contract = await Contract.deploy();
    await contract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const address = await contract.getAddress();
      expect(address).to.not.equal(ethers.ZeroAddress);
    });

    it("Should set the correct owner", async function () {
      // 如果没有 owner 函数，删除此测试
      // expect(await contract.owner()).to.equal(owner.address);
    });
  });

  describe("set()", function () {
    it("Should update the value", async function () {
      await contract.set(42);
      expect(await contract.get()).to.equal(42);
    });

    it("Should emit ValueChanged event", async function () {
      await expect(contract.set(42))
        .to.emit(contract, "ValueChanged")
        .withArgs(0, 42);
    });
  });

  describe("get()", function () {
    it("Should return the current value", async function () {
      await contract.set(100);
      expect(await contract.get()).to.equal(100);
    });

    it("Should return 0 by default", async function () {
      expect(await contract.get()).to.equal(0);
    });
  });
});
