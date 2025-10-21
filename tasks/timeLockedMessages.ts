import { task } from "hardhat/config";

task("messages:create", "Creates a time-locked encrypted message")
  .addParam("title", "Plaintext title for the message")
  .addParam("body", "Encrypted payload to store (hex or utf-8)")
  .addParam("recipient", "Address that should receive access when unlocked")
  .addOptionalParam("delay", "Unlock delay in seconds", "3600")
  .setAction(async (args, hre) => {
    const { title, body, recipient, delay } = args;
    const [creator] = await hre.ethers.getSigners();
    const deployment = await hre.deployments.get("TimeLockedMessages");
    const contract = await hre.ethers.getContractAt("TimeLockedMessages", deployment.address, creator);

    const unlockTimestamp = BigInt(Math.floor(Date.now() / 1000) + Number(delay));
    const payload = body.startsWith("0x") ? body : hre.ethers.hexlify(hre.ethers.toUtf8Bytes(body));

    const encryptedInput = await hre.fhevm
      .createEncryptedInput(deployment.address, creator.address)
      .addAddress(recipient)
      .encrypt();

    const tx = await contract.createMessage(
      title,
      payload,
      encryptedInput.handles[0],
      encryptedInput.inputProof,
      unlockTimestamp,
    );
    const receipt = await tx.wait();

    console.log(`Message created in tx ${receipt?.hash}`);
  });

task("messages:list", "Lists message ids created by an address")
  .addOptionalParam("creator", "Creator address (defaults to first signer)")
  .setAction(async ({ creator }, hre) => {
    const [defaultSigner] = await hre.ethers.getSigners();
    const creatorAddress = (creator ?? defaultSigner.address) as string;
    const deployment = await hre.deployments.get("TimeLockedMessages");
    const contract = await hre.ethers.getContractAt("TimeLockedMessages", deployment.address);

    const messageIds: bigint[] = await contract.getMessageIdsByCreator(creatorAddress);

    if (messageIds.length === 0) {
      console.log("No messages found for", creatorAddress);
      return;
    }

    for (const id of messageIds) {
      const message = await contract.getMessage(id);
      console.log(`Message ${id.toString()}: title=${message[1]}, unlock=${message[5]}, granted=${message[6]}`);
    }
  });

task("messages:allow", "Allows the recipient to decrypt a message after the unlock time")
  .addParam("messageid", "Message identifier")
  .addParam("recipient", "Recipient address")
  .setAction(async ({ messageid, recipient }, hre) => {
    const [creator] = await hre.ethers.getSigners();
    const deployment = await hre.deployments.get("TimeLockedMessages");
    const contract = await hre.ethers.getContractAt("TimeLockedMessages", deployment.address, creator);

    const tx = await contract.allowRecipient(BigInt(messageid), recipient);
    const receipt = await tx.wait();

    console.log(`Access granted in tx ${receipt?.hash}`);
  });
