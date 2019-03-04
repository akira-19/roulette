(function(){
  'use strict';

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
      rouletteTable.getElementsByTagName('TD')[i].innerHTML = "<span style='color:red;'>"+ 3*i +"</span>";
      rouletteTable.getElementsByTagName('TD')[i+13].innerHTML = "<span style='color:black;'>"+ (3*i-1) +"</span>";
      rouletteTable.getElementsByTagName('TD')[i+27].innerHTML = "<span style='color:red;'>"+ (3*i-2) +"</span>";
    }else{
      // put numbers to the table
      rouletteTable.getElementsByTagName('TD')[i].innerHTML = "<span style='color:black;'>"+ 3*i +"</span>";
      rouletteTable.getElementsByTagName('TD')[i+13].innerHTML = "<span style='color:red;'>"+ (3*i-1) +"</span>";
      rouletteTable.getElementsByTagName('TD')[i+27].innerHTML = "<span style='color:black;'>"+ (3*i-2) +"</span>";
    }
  }



})();
