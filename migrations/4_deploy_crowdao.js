var CrowDAO = artifacts.require("./crowdao.sol");

module.exports = function(deployer) {
  deployer.deploy(CrowDAO);
};
