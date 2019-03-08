// オブジェクトリテラル
App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
      // Modern dapp browsers...
  if (window.ethereum) {
    App.web3Provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access")
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    App.web3Provider = window.web3.currentProvider;
  }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/69c812a113224017b9f3d3357c7aa8c4');
  }
  web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
      $.getJSON('Roulette.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var RouletteArtifact = data;
    App.contracts.Roulette = TruffleContract(RouletteArtifact);

    // Set the provider for our contract
    App.contracts.Roulette.setProvider(App.web3Provider);

    // Use our contract to retrieve and mark the adopted pets
    // return App.showproducts();
  });
    return App.runRoullet();
  },

 runRoullet: function(){
     $(document).off('click');
     $(document).on('click','#startButton', function(event){
         event.preventDefault();
         let betId = $('#choice').attr('id');
         let betNum = betId.slice(3);
         let betNum = parseInt(betNum);
         let betAmount = $('#betAmount').text();
         let rouletteInstance;

         if (betNum){
             App.contracts.ProductOwnership.deployed().then(instance => {
                 rouletteInstance = instance;
                 return rouletteInstance.getResult(betNum, {value:web3js.toWei(betAmount,"ether")});
             }).then((result) => {
                 console.log(result);
             }).catch(function(err) {
                 console.log(err.message)
             });
         }

     })
 }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
