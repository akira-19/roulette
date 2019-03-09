pragma solidity ^0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

/// @title A contract for playing roulette game
/// @author akira-19
/// @notice In this contract, you can bet ether and play roulette. If you win the game, you can get ether.
contract Roulette is Ownable{
    using SafeMath for uint256;
    using SafeMath for uint8;

    uint public contractStoreAmount;


    constructor() public payable {
        contractStoreAmount = msg.value;
    }


    event JudgeResult(uint8 result, uint returnAmount);


    function deposit() public payable onlyOwner(){
        contractStoreAmount = contractStoreAmount.add(msg.value);
    }

    function withdraw(uint _amount) external payable onlyOwner() {
        require(_amount < contractStoreAmount);
        msg.sender.transfer(_amount);
    }

    function getResult(uint8 _bet) public payable{
        uint8 randNum = getRandomNum();
        judgeResult(_bet, randNum);
    }

    function judgeResult(uint8 _bet, uint8 _randNum) internal{
        uint betAmount = msg.value;
        uint returnAmount;
        uint8 randNum = _randNum;
        if(_bet <= 37){
            /* 0 is 0, 00 is 37 */
            if(randNum == _bet){
                returnAmount =  betAmount*36;
                msg.sender.transfer(returnAmount);
            }else{
                contractStoreAmount = contractStoreAmount.add(betAmount);
            }
        }else if(_bet <= 43){
            /* 1-12:38, 13-24:39, 25-36:40 */
            /* 1st row:41, 2nd row:42, 3rd row:43 */

            if ((_bet <= 40) && ((_bet-38) == (randNum-1).div(12)) && (randNum >= 1) && (randNum <= 36)){
                /* when bet is on dozens */
                returnAmount = betAmount*3;
                msg.sender.transfer(returnAmount);
            }else if ((_bet >= 41) && (((_bet+1)%3) == (randNum%3)) && (randNum >= 1) && (randNum <= 36)){
                /* when bet is on rows */
                returnAmount = betAmount*3;
                msg.sender.transfer(returnAmount);
            }else{
                contractStoreAmount = contractStoreAmount.add(betAmount);
            }
        }else{
            /* odd:44 even:45, red:46 black:47, 1st half:48 2nd half:49 */
            if(randNum == 0 || randNum == 37){
                contractStoreAmount = contractStoreAmount.add(betAmount);
            }else if((_bet == 45 || _bet == 47) && (randNum%2) == 0 ){
                returnAmount = betAmount*2;
                msg.sender.transfer(returnAmount);
            }else if((_bet == 44 || _bet == 46) && (randNum%2) == 1 ){
                returnAmount = betAmount*2;
                msg.sender.transfer(returnAmount);
            }else if((_bet == 48) && (randNum >= 1) && (randNum <= 18)){
                returnAmount = betAmount*2;
                msg.sender.transfer(returnAmount);
            }else if((_bet == 49) && (randNum >= 19) && (randNum <= 36)){
                returnAmount = betAmount*2;
                msg.sender.transfer(returnAmount);
            }else{
                contractStoreAmount = contractStoreAmount.add(betAmount);
            }

        }

        emit JudgeResult(randNum, returnAmount);
    }

    function getRandomNum() private view returns (uint8) {
        return uint8(uint256(keccak256(abi.encode(block.timestamp)))%38);
    }




}
