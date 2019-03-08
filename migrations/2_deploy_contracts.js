var Roulette = artifacts.require("Roulette");

module.exports = function(deployer) {
  deployer.deploy(Roulette, {value: 3000000000000000000});
};
