var Roulette = artifacts.require("Roulette");
const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');

contract("RouletteTest", function(accounts){
    it("should have 3 ehter at the beginning", function(){
        return Roulette.new({from: accounts[0], value: web3.utils.toWei("1", "ether")}).then(function(instance){
            return instance.contractStoreAmount();
        }).then(contractStoreAmount => {
            assert.equal(contractStoreAmount, web3.utils.toWei("1", "ether"), "contract has 3 ether");
        }).catch(err => {
            console.log(err);
        })
    })

    it("should be possible to win and get ether (36times)", function(){
        var rouletteInstance;
        return Roulette.new({from: accounts[0], value: web3.utils.toWei("1", "ether")}).then(function(instance){
            rouletteInstance = instance;
            return rouletteInstance.judgeResult(5, 5, {value: web3.utils.toWei("0.01", "ether")});
        }).then((result) => {
            truffleAssert.eventEmitted(result, 'JudgeResult', (ev) => {
                return ev.returnAmount == web3.utils.toWei("0.36", "ether")
            }, 'Contract should return 36 times as much as bet');
        }).catch(err => {
            console.log(err);
        })
    });

    it("should be possible to win and get ether(2 times)", function(){
        var rouletteInstance;
        return Roulette.new({from: accounts[0], value: web3.utils.toWei("1", "ether")}).then(function(instance){
            rouletteInstance = instance;
            return rouletteInstance.judgeResult(46, 4, {value: web3.utils.toWei("0.01", "ether")});
        }).then((result) => {
            truffleAssert.eventEmitted(result, 'JudgeResult', (ev) => {
                return ev.returnAmount == web3.utils.toWei("0.02", "ether")
            }, 'Contract should return 2 times as much as bet');
        }).catch(err => {
            console.log(err);
        })
    });

    it("should be possible to win and get ether (3 times)", function(){
        var rouletteInstance;
        return Roulette.new({from: accounts[0], value: web3.utils.toWei("1", "ether")}).then(function(instance){
            rouletteInstance = instance;
            return rouletteInstance.judgeResult(39, 10, {value: web3.utils.toWei("0.01", "ether")});
        }).then((result) => {
            truffleAssert.eventEmitted(result, 'JudgeResult', (ev) => {
                return ev.returnAmount == web3.utils.toWei("0.03", "ether")
            }, 'Contract should return 3 times as much as bet');
        }).catch(err => {
            console.log(err);
        })
    });

    it("should be possible to lose", function(){
        var rouletteInstance;
        return Roulette.new({from: accounts[0], value: web3.utils.toWei("1", "ether")}).then(function(instance){
            rouletteInstance = instance;
            return rouletteInstance.judgeResult(5, 1, {value: web3.utils.toWei("0.01", "ether")});
        }).then((result) => {
            truffleAssert.eventEmitted(result, 'JudgeResult', (ev) => {
                return ev.returnAmount == 0
            }, 'Contract should return 0');
        }).catch(err => {
            console.log(err);
        })
    });



    it("should be possible to lose", function(){
        var rouletteInstance;
        return Roulette.new({from: accounts[0], value: web3.utils.toWei("1", "ether")}).then(function(instance){
            rouletteInstance = instance;
            return rouletteInstance.judgeResult(46, 5, {value: web3.utils.toWei("0.01", "ether")});
        }).then((result) => {
            truffleAssert.eventEmitted(result, 'JudgeResult', (ev) => {
                return ev.returnAmount == 0
            }, 'Contract should return 0');
        }).catch(err => {
            console.log(err);
        })
    });

});
