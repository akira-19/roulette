(function(){
  'use strict';

  createRouletteTable();
  createRoulette();

function createRouletteTable() {
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

    /* 1-12:38, 13-24:39, 25-36:40 */
    /* 1st row:41, 2nd row:42, 3rd row:43 */
    /* odd:44 even:45, red:46 black:47, 1st half:48 2nd half:49 */


    for (var i=0; i<50; i++){
        var idName = "td-" + i;
        if (i >= 1 && i <= 36){
            document.getElementById(idName).addEventListener('click', function(e){
                document.getElementById('choice').innerHTML = this.firstElementChild.textContent
            });
        }else if(i === 46){
            document.getElementById(idName).addEventListener('click', function(e){
                document.getElementById('choice').innerHTML = 'red';

            });
        }else if(i === 47){
            document.getElementById(idName).addEventListener('click', function(e){
                document.getElementById('choice').innerHTML = 'black';
            });
        }else{
            document.getElementById(idName).addEventListener('click', function(e){
                document.getElementById('choice').innerHTML = this.textContent;
            });
        }
    }


}




function createRoulette(){
  const canvas = document.getElementById("canvas")
  const context = canvas.getContext('2d');

  var center = {
      x: 200,
      y: 200
  }

  var radius = 170;

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

  var sum_weight = 0
  var unit_weight = 0
  var stopFlag = false;
  var startFlag = false;

  //
  // main proccess
  //
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


  function runRoullet(countEnd) {
      var count = 1; //count till the end
      var lastCell = "";
      var deg_counter = 0 // angle counter
      var acceleration = 1

      var rotation = 1;
      for(var i=1; i<=38; i++){
          if (38*rotation < 11*i){
              rotation++;
          }
          if ((38 * rotation) % (11 * i) == countEnd){
              countEnd = i + 19;
              console.log(countEnd);
              console.log(rotation);
              break;
          }
      }


      var timer = setInterval(function() {

          deg_counter += acceleration
          count++;

          if (count < 50 + countEnd) {
              acceleration = 360 * 11 / 38
              drawRoullet(deg_counter);
          } else if(count < 140 + countEnd){
              acceleration = 100 / (count - countEnd - 45);
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
                      document.getElementById("debug").innerHTML = data[i].name
                      break
                  }
                  sum += data[i].weight
              }
          }
      };
  }



  document.getElementById("run").addEventListener("click", function() {
      // can't press start button more than one time
      if (startFlag === false) {
          runRoullet(26);
          startFlag = true;
      } else {
          startFlag = false;
      }

  });

  document.getElementById("stop").addEventListener("click", function() {
      if (startFlag) {
          stopFlag = true;
      }
  });



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
}

})();
