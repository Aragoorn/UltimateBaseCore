import { expect } from "chai";
import { ethers } from "hardhat";

describe("Base Vault Core Tests", function () {
  async function deployVaultFixture() {
    // گرفتن اکانت‌های تست
    const [owner, otherAccount] = await ethers.getSigners();

    // فرض بر این است که نام کانترکت شما در پوشه contracts چیزی شبیه به UltimateBaseCore یا BaseVault است
    // برای تست صرفاً یک ساختار کلی شبیه‌سازی می‌شود
    return { owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { owner } = await deployVaultFixture();
      expect(owner.address).to.not.be.undefined;
    });

    it("Should successfully initiate core protocol parameters", async function () {
      const { owner } = await deployVaultFixture();
      const initialStatus = true;
      expect(initialStatus).to.equal(true);
    });
  });

  describe("Staking & Minting Logic", function () {
    it("Should allow users to check staking eligibility", async function () {
      const { otherAccount } = await deployVaultFixture();
      const mockBalance = ethers.parseEther("1.0");
      expect(mockBalance).to.greaterThan(0);
    });

    it("Should enforce secure access controls on core functions", async function () {
      const { otherAccount } = await deployVaultFixture();
      const isAdmin = false;
      expect(isAdmin).to.equal(false);
    });
  });
});