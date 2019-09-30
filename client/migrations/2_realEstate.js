var realEstate = artifacts.require("./realEstate.sol");

module.exports = function(deployer) {
  deployer.deploy(realEstate);
};
