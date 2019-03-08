pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Roulette.sol";

contract TestRoulette {
    Roulette roulette = Roulette(DeployedAddresses.Roulette());

    address better = address(this);

    function testConstructor() public{
        uint totalAmount = roulette.contractStoreAmount();

        Assert.equal(totalAmount, 3 ether, "contract initial amount should be 3 ether.");
    }

    /* function testWinTheNumber() {
        uint8 bet = 5;
        judgeResult(bet)
    } */
}
