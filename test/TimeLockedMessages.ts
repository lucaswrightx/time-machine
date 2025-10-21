import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { TimeLockedMessages, TimeLockedMessages__factory } from "../types";
import { time } from "@nomicfoundation/hardhat-network-helpers";

type Signers = {
  creator: HardhatEthersSigner;
  recipient: HardhatEthersSigner;
  stranger: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("TimeLockedMessages")) as TimeLockedMessages__factory;
  const contract = (await factory.deploy()) as TimeLockedMessages;
  const contractAddress = await contract.getAddress();
  return { contract, contractAddress };
}

describe("TimeLockedMessages", function () {
  let signers: Signers;
  let contract: TimeLockedMessages;
  let contractAddress: string;

  before(async function () {
    const allSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { creator: allSigners[0], recipient: allSigners[1], stranger: allSigners[2] };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn("This Hardhat test suite requires the FHEVM mock");
      this.skip();
    }

    ({ contract, contractAddress } = await deployFixture());
  });

  async function createEncryptedRecipient(creator: HardhatEthersSigner, recipientAddress: string) {
    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, creator.address)
      .addAddress(recipientAddress)
      .encrypt();

    return encryptedInput;
  }

  it("stores message metadata", async function () {
    const unlockTimestamp = (await time.latest()) + 3600;
    const encryptedRecipient = await createEncryptedRecipient(signers.creator, signers.recipient.address);
    const body = ethers.toUtf8Bytes("cipher-body");

    const tx = await contract
      .connect(signers.creator)
      .createMessage("Hello title", body, encryptedRecipient.handles[0], encryptedRecipient.inputProof, unlockTimestamp);
    const receipt = await tx.wait();

    const createdEvent = receipt?.logs.find((log) => log.fragment?.name === "MessageCreated");
    expect(createdEvent).to.not.be.undefined;

    const ids = await contract.getMessageIdsByCreator(signers.creator.address);
    expect(ids.length).to.eq(1);
    expect(ids[0]).to.eq(0);

    const stored = await contract.getMessage(0);
    expect(stored[0]).to.eq(signers.creator.address);
    expect(stored[1]).to.eq("Hello title");
    expect(stored[2]).to.eq(ethers.hexlify(body));
    expect(stored[5]).to.eq(unlockTimestamp);
    expect(stored[6]).to.eq(false);
    expect(stored[7]).to.eq(ethers.ZeroAddress);
  });

  it("blocks allow before unlock and grants after unlock", async function () {
    const currentTime = await time.latest();
    const unlockTimestamp = currentTime + 500;
    const encryptedRecipient = await createEncryptedRecipient(signers.creator, signers.recipient.address);

    await contract
      .connect(signers.creator)
      .createMessage("Secret", ethers.toUtf8Bytes("---"), encryptedRecipient.handles[0], encryptedRecipient.inputProof, unlockTimestamp);

    await expect(
      contract.connect(signers.creator).allowRecipient(0, signers.recipient.address),
    ).to.be.revertedWith("Unlock time not reached");

    await expect(
      contract.connect(signers.stranger).allowRecipient(0, signers.recipient.address),
    ).to.be.revertedWith("Only creator can allow");

    await time.increaseTo(unlockTimestamp + 1);

    await contract.connect(signers.creator).allowRecipient(0, signers.recipient.address);

    const stored = await contract.getMessage(0);
    expect(stored[6]).to.eq(true);
    expect(stored[7]).to.eq(signers.recipient.address);

    // Recipient can decrypt after allow
    const decrypted = await fhevm.userDecryptEaddress(stored[3], contractAddress, signers.recipient);
    expect(ethers.getAddress(decrypted)).to.eq(signers.recipient.address);

    // Access cannot be granted twice
    await expect(
      contract.connect(signers.creator).allowRecipient(0, signers.recipient.address),
    ).to.be.revertedWith("Already allowed");
  });
});
