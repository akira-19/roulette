
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
    // App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/69c812a113224017b9f3d3357c7aa8c4');
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
    return App.runRoulette();
  },

//
// start the roulette and return the result
//
 runRoulette: function(){
     $(document).on('click','#startButton', function(event){
         event.preventDefault();
         let betId = $('#choice').attr("value");
         let betNum = parseInt(betId);
         let betAmount = $('#betInput').val();
         let rouletteInstance;
         let resultNumber;
         let resultText;


         if ((betNum != null) && (betAmount >= 0.01) && (betAmount <= 0.03)){
             App.contracts.Roulette.deployed().then(instance => {
                 rouletteInstance = instance;
                 return rouletteInstance.getResult(betNum, {value:web3.toWei(betAmount,"ether")});
             }).then((result) => {

                 if (result.logs[0].args.returnAmount == 0){
                     resultText = "Oops, you lost.";
                 }else{
                     resultText = "Yay, you won " + (result.logs[0].args.returnAmount/(10**18)) + " ether!";
                 }
                 resultNumber = result.logs[0].args.result;

             }).then(() => {
                 App.createRoulette()(resultNumber, resultText);

             }).catch(function(err) {
                 console.log(err.message)
             });
         }else{
             alert("Select the place and bet must be from 0.01 to 0.03 ether.");
         }

     })
 },

 //
 // show numbers on the table
 //
 createRouletteTable: function(){
   var rouletteTable = document.getElementById('bet-table');
   var allocateId = (number, id) => {
     rouletteTable.getElementsByTagName('TD')[number].setAttribute('id', "td-"+id);
   };
     for(var i = 1; i < 13; i++){
         allocateId(i, 3*i);
         allocateId(i+13, 3*i-1);
         allocateId(i+27, 3*i-2);

       if (i%2 == 1){
         // put numbers to the table
         rouletteTable.getElementsByTagName('TD')[i].innerHTML = "<div class='numRed'>"+ 3*i +"</div>";
         rouletteTable.getElementsByTagName('TD')[i+13].innerHTML = "<div class='numBlack'>"+ (3*i-1) +"</div>";
         rouletteTable.getElementsByTagName('TD')[i+27].innerHTML = "<div class='numRed'>"+ (3*i-2) +"</div>";
       }else{
         // put numbers to the table
         rouletteTable.getElementsByTagName('TD')[i].innerHTML = "<div class='numBlack'>"+ 3*i +"</div>";
         rouletteTable.getElementsByTagName('TD')[i+13].innerHTML = "<div class='numRed'>"+ (3*i-1) +"</div>";
         rouletteTable.getElementsByTagName('TD')[i+27].innerHTML = "<div class='numBlack'>"+ (3*i-2) +"</div>";
       }
     }


     for (var i=0; i<50; i++){
         var idName = "td-" + i;
         if (i >= 1 && i <= 36){
             document.getElementById(idName).addEventListener('click', function(e){
                 document.getElementById('choice').innerHTML = this.firstElementChild.textContent
                 let value = this.getAttribute('id');
                 value = value.slice(3);
                 document.getElementById('choice').setAttribute("value", value);
             });
         }else if(i === 46){
             document.getElementById(idName).addEventListener('click', function(e){
                 document.getElementById('choice').innerHTML = 'red';
                 let value = this.getAttribute('id');
                 value = value.slice(3);
                 document.getElementById('choice').setAttribute("value", value);
             });
         }else if(i === 47){
             document.getElementById(idName).addEventListener('click', function(e){
                 document.getElementById('choice').innerHTML = 'black';
                 let value = this.getAttribute('id');
                 value = value.slice(3);
                 document.getElementById('choice').setAttribute("value", value);
             });
         }else{
             document.getElementById(idName).addEventListener('click', function(e){
                 document.getElementById('choice').innerHTML = this.textContent;
                 let value = this.getAttribute('id');
                 value = value.slice(3);
                 document.getElementById('choice').setAttribute("value", value);
             });
         }
     }
  },


  //
  // create the roulette by using canvas and return the run the roulette
  //
  createRoulette: function(){
    // data object for each number on the roulette****************
    var data = [{
            name: "label0",
            color: 'green',
            weight: 1
        }
    ]

    for (var i=1; i<=37; i++){
      if(i<19){
          if ((i%2)==0){
              data.push({name: "label"+i,
              color: 'black',
              weight: 1})
          }else{
              data.push({name: "label"+i,
              color: 'red',
              weight: 1})
          }
      }else if (i == 19){
          data.push({name: "label00",
          color: 'green',
          weight: 1})
      }else{
          if ((i%2)==0){
              data.push({name: "label"+(i-1),
              color: 'red',
              weight: 1})
          }else{
              data.push({name: "label"+(i-1),
              color: 'black',
              weight: 1})
          }
      }
    }
    // *****************************************

    const canvas = document.getElementById("canvas")
    const context = canvas.getContext('2d');
    var center = {
        x: 200,
        y: 200
    }
    var radius = 170;
    var sum_weight = 0
    var unit_weight = 0
    var stopFlag = false;
    var startFlag = false;

    // main proccess
    data.forEach(e => {
        sum_weight += e.weight
    })
    unit_weight = 360 / sum_weight
    init()
    drawRoullet(0)



    function drawRoullet(offset) {
        var uw_count = offset

        data.forEach(e => {
            drawPie(center.x, center.y, uw_count, uw_count + unit_weight, radius, e.color);
            drawWhiteCircle(center.x, center.y);
            putNumber(center.x, center.y, uw_count, uw_count + unit_weight, radius, e.name);
            uw_count += unit_weight
        })
    }

    function init() {
        canvas.width = 400;
        canvas.height = 400;

        var dst = context.createImageData(canvas.width, canvas.height);
        for (var i = 0; i < dst.data.length; i++) {
            dst.data[i] = 255
        }
        context.putImageData(dst, 0, 0);
    }

    function drawPie(cx, cy, start_deg, end_deg, radius, color) {
        var _start_deg = (360 - start_deg) * Math.PI / 180;
        var _end_deg = (360 - end_deg) * Math.PI / 180;

        context.beginPath();
        context.moveTo(cx, cy)
        context.fillStyle = color;
        context.arc(cx, cy, radius, _start_deg, _end_deg, true);
        context.fill();

        showArrow()
    }

    function putNumber(cx, cy, start_deg, end_deg, radius, name){
        var number = name.slice(5);

        context.beginPath();
        context.save();
        context.translate(cx, cy);
        context.rotate(-(start_deg+4) * Math.PI / 180);
        context.translate(-cx, -cy);
        context.font = "normal 13px Arial";
        context.textBaseline = "middle";
        context.fillStyle = 'white';
        context.fillText(number, cx + radius-19, cy);
        context.restore();
        context.save();
    }

    function drawWhiteCircle(cx, cy) {
        context.beginPath();
        context.moveTo(cx, cy)
        context.fillStyle = 'white';
        context.arc(cx, cy, 100, 360 * Math.PI / 180, 0, true)
        context.fill();
    }


    function showArrow() {
        context.beginPath();
        context.moveTo(center.x, center.y - radius);
        context.lineTo(center.x + 10, center.y - radius - 10);
        context.lineTo(center.x - 10, center.y - radius - 10);
        context.closePath();
        context.stroke();
        context.fillStyle = "rgba(40,40,40)";
        context.fill();
    }

    var runRoulette = function(resultNumber, resultText) {
        var count = 1; //count till the end
        var deg_counter = 0 // angle counter
        var acceleration = 1
        var counteEnd;


        var rotateNum = new Object();
        for (var j=0; j<=37; j++){
            if (j<=18){
                var rotation = 1;
                for(var i=2; i<=40; i++){
                    if (38*rotation < 11*i){
                        rotation++;
                    }
                    if ((38 * rotation) % (11 * i) == j){
                        countEnd = i + 19;
                        rotateNum[j] = countEnd;
                        break;
                    }
                }
            }else{
                var rotation = 1;
                for(var i=2; i<=40; i++){
                    if (38*rotation < 11*i){
                        rotation++;
                    }
                    if ((38 * rotation) % (11 * i) == (j+1)){
                        countEnd = i + 19;
                        rotateNum[j] = countEnd;
                        break;
                    }
                }
            }
            rotateNum[37] = 38;
        }




        var timer = setInterval(function() {

            deg_counter += acceleration
            count++;

            if (count < 50 + rotateNum[resultNumber]) {
                acceleration = 360 * 11 / 38
                drawRoullet(deg_counter);
            } else if(count < 140 + rotateNum[resultNumber]){
                acceleration = 100 / (count - rotateNum[resultNumber] - 45);
                drawRoullet(deg_counter);
            }else{
                count = 0;
                clearInterval(timer);
                endEvent();
            }

        }, 70);

        var endEvent = function() {
            count++;
            var id = setTimeout(endEvent, 115);
            if (count > 9) {
                clearTimeout(id);
                startFlag = false;
                stopFlag = false;
                var current_deg = Math.ceil(deg_counter % 360)
                var sum = 0
                for (var i = 0; i < data.length; i++) {
                    if (unit_weight * sum < current_deg && current_deg < unit_weight * (sum + data[i].weight)) {
                        document.getElementById("returnAmount").innerHTML = resultText;
                        if(resultNumber == 37){
                            document.getElementById("rouletteResult").innerHTML = "00";
                        }else{
                            document.getElementById("rouletteResult").innerHTML = resultNumber;

                        }
                        break;
                    }
                    sum += data[i].weight
                }
            }
        };
    }

    return runRoulette;
  }
};

$(function() {
  $(window).load(function() {
    App.createRouletteTable();
    App.createRoulette();
    App.init();
  });
});
