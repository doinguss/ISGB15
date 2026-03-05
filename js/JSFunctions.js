"use strict";
function test(){
    console.log( oGameData );
    oGameData.initGlobalObject();
    oGameData.fetch();
    console.log( oGameData.gameField );
    console.log( oGameData.checkForGameOver() );
} 
let oGameData = {};
oGameData.initGlobalObject = function() {
    oGameData.gameField = new Array(9);
    oGameData.playerOne = "X";
    oGameData.playerTwo = "O";
    oGameData.currentPlayer = "";
    oGameData.nickNamePlayerOne = "";
    oGameData.nickNamePlayerTwo = "";
    oGameData.colorPlayerOne = "";
    oGameData.colorPlayerTwo = "";
    oGameData.timerEnabled = false; 
    oGameData.timerId = null;
}
oGameData.checkForGameOver = function() {
   let players=[oGameData.playerOne,oGameData.playerTwo];
   for(let i=0;i<players.length;i++){
    if( oGameData.checkDiag(players[i])||oGameData.checkCol (players[i])||oGameData.checkRow (players[i])){return i+1;}
   }
   if(oGameData.checkInProgress()){return 0;}
   return 3;
}
/*here yander be thee wictorry checks yarr*/ 
oGameData.checkRow = function(player) {
    for(let i=0;i<3;i++){/*3 cux 3 possible rows*/
        if(oGameData.gameField[3*i+0]!==player){continue;}
        if(oGameData.gameField[3*i+1]!==player){continue;}
        if(oGameData.gameField[3*i+2]!==player){continue;}
        return true;}
    return false;
}
oGameData.checkCol = function(player) {
    for(let i=0;i<3;i++){/*3 cux 3 possible collumns*/
        if(oGameData.gameField[i+0+0]!==player){continue;}
        if(oGameData.gameField[i+3+0]!==player){continue;}
        if(oGameData.gameField[i+6+0]!==player){continue;}
        return true;}
    return false;
}
oGameData.checkDiag = function(player) {
    for(let i=0;i<2;i++){/*2 cux 2 possible diagonals*/
        if(oGameData.gameField[0+2*i]!==player){continue;}
        if(oGameData.gameField[4+0+0]!==player){continue;}
        if(oGameData.gameField[8-2*i]!==player){continue;}
        return true;}
    return false;
}
oGameData.checkInProgress=function(){
    let out=false;
    oGameData.gameField.forEach(element => {if(element===""){out=true;}});
    return out;
}
/*and thus be the end of the wictory checking code yarrr*/
oGameData.fetch=function(){
    document.querySelectorAll("td[data-id]").forEach(element=>{
        oGameData.gameField[Number(element.dataset.id)]=element.textContent;
    });
}
test();