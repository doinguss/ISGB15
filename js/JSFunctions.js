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
document.body.onload=function(){
    oGameData.initGlobalObject();
    oGameData.gameField=["","","","","","","","",""];
    document.querySelector('#game-area').classList.add("d-none");
    document.querySelector('#newGame').addEventListener("click",oGameData.validateForm());
    document.querySelector('#game-area').addEventListener("click",(event)=>{
        try{
            if(event.target.textContent!==""){throw {}}
            //if(oGameData.checkForGameOver()!==0){throw {}}
            oGameData.playEvent(event.target);
        }catch(oError){}
    });
}
oGameData.initiateGame=function(){
    document.querySelector('form').classList.add("d-none");
    document.querySelector('#game-area').classList.remove("d-none");
    document.querySelector('#game-area').focus();

    document.querySelector("#errorMsg").textContent="";
    oGameData.nickNamePlayerOne=document.querySelector("#nick1").value;
    oGameData.nickNamePlayerTwo=document.querySelector("#nick2").value;
    oGameData.colorPlayerOne=  document.querySelector("#color1").value;
    oGameData.colorPlayerTwo=  document.querySelector("#color2").value;

    document.querySelectorAll("td").forEach(element=>{
        element.textContent="";
        element.style.backgroundColor="#ffffff";
    });
    oGameData.fetch();
    let playerChar, playerName;
    switch(Math.floor(Math.random()*2)){
        case 0:
            playerChar=oGameData.playerOne;
            playerName=oGameData.nickNamePlayerOne;
            oGameData.currentPlayer=oGameData.playerOne;
            break;
        default: 
            playerChar=oGameData.playerTwo;
            playerName=oGameData.nickNamePlayerTwo;
            oGameData.currentPlayer=oGameData.playerTwo;
            break;
    }
    oGameData.updatePlayer();
}
oGameData.validateForm=()=>{
        try{
            if(document.querySelector("#nick1") .value.length<5){throw  {src: document.querySelector("#nick1"),msg: 'för kort, spelare 1'}}
            if(document.querySelector("#nick2") .value.length<5){throw  {src: document.querySelector("#nick2"),msg: 'för kort, spelare 2'}}
            if(document.querySelector("#color1").value==="#ffffff"){throw  {src: document.querySelector("#color1"),msg: 'kan inte vara vit, spelare 1'}}
            if(document.querySelector("#color1").value==="#000000"){throw  {src: document.querySelector("#color1"),msg: 'kan inte vara svart, spelare 1'}}
            if(document.querySelector("#color2").value==="#ffffff"){throw  {src: document.querySelector("#color2"),msg: 'kan inte vara vit, spelare 2'}}
            if(document.querySelector("#color2").value==="#000000"){throw  {src: document.querySelector("#color2"),msg: 'kan inte vara svart, spelare 2'}}
            if(document.querySelector("#nick1") .value===document.querySelector("#nick2") .value){throw  {src: document.querySelector("#nick2") ,msg: 'wtf sama namn'}}
            if(document.querySelector("#color1").value===document.querySelector("#color2").value){throw  {src: document.querySelector("#color2"),msg: 'wtf same färg'}}
            oGameData.initiateGame();
        } catch(oError){
            document.querySelector("#errorMsg").textContent=oError.msg;
            oError.src.focus();
        }
}
oGameData.updatePlayer=()=>{
    let playerChar, playerName, playercolor;
    playerChar= oGameData.currentPlayer;
    playerName= oGameData.currentPlayer===oGameData.playerOne?oGameData.nickNamePlayerOne:oGameData.nickNamePlayerTwo;
    playercolor=oGameData.currentPlayer===oGameData.playerOne?oGameData.colorPlayerOne:oGameData.colorPlayerTwo;
    document.querySelector(".jumbotron >h1").style.color= playercolor;
    document.querySelector(".jumbotron >h1").textContent="aktuella spelare är "+playerName+"("+playerChar+")";
}
oGameData.swapPlayer=()=>{
    switch(oGameData.currentPlayer){
        case oGameData.playerOne:   oGameData.currentPlayer=oGameData.playerTwo;    break;
        case oGameData.playerTwo:   oGameData.currentPlayer=oGameData.playerOne;    break;
    }
}
oGameData.playEvent=(target)=>{
    target.textContent=oGameData.currentPlayer;
    target.style.backgroundColor=(oGameData.currentPlayer==oGameData.playerOne)?oGameData.colorPlayerOne:oGameData.colorPlayerTwo;
    oGameData.fetch();
    switch(oGameData.checkForGameOver()){
        case 0: oGameData.swapPlayer();  oGameData.updatePlayer();   return;
        case 1: 
            document.querySelector(".jumbotron >h1").textContent=oGameData.nickNamePlayerOne+" vann";
            break;
        case 2:
            document.querySelector(".jumbotron >h1").textContent=oGameData.nickNamePlayerTwo+" vann";
            break;
        case 3:
            document.querySelector(".jumbotron >h1").textContent="oavgjort";
            //document.querySelector("#game-area").removeEventListener("click",oGameData.validateForm());
            break;
    }
    //document.querySelector("form").classList.remove("d-none");
}