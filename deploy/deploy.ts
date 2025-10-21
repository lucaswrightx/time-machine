import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedMessages = await deploy("TimeLockedMessages", {
    from: deployer,
    log: true,
  });

  console.log(`TimeLockedMessages contract: `, deployedMessages.address);
};
export default func;
func.id = "deploy_timeLockedMessages"; // id required to prevent reexecution
func.tags = ["TimeLockedMessages"];
