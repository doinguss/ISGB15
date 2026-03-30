//import {mything} from 'algorythm.tictactoe2.mjs';
//import {turn} from 'algorythm.tictactoe2.mjs';
"use strict";


//pre: body load
//post: initlaizes ogamedata, hides gamearea
//calls validateform, checkforgameover
//catches does nothing
document.body.onload=()=>{
    oGameData.initGlobalObject();
    document.querySelector('#game-area').classList.add("d-none");
    document.querySelector('#newGame').addEventListener("click",()=>oGameData.validateForm());
}


let oGameData = {};
oGameData.initGlobalObject=()=>{
    oGameData.gameField = [["","",""],["","",""],["","",""]];
    oGameData.playerOne = "X";
    oGameData.playerTwo = "O";
    oGameData.currentPlayer = "";
    oGameData.nickNamePlayerOne = "";
    oGameData.nickNamePlayerTwo = "";
    oGameData.colorPlayerOne = "";
    oGameData.colorPlayerTwo = "";
    oGameData.timerEnabled = false; 
    oGameData.timerId = null;
    //oGameData.oppAi;
}
//pre: click newgame
//post: initiaates game (conditional: passes checks)
//calls initategame
//checks name1/2 length > 5, color1/2 != white, color1/2 != black, color1 != color2
//catches display error msg and focus on element
oGameData.validateForm=()=>{
        try{
            if(document.querySelector("#nick1") .value.length<5){throw  {src: document.querySelector("#nick1"),msg: 'för kort, spelare 1'}}
            if(document.querySelector("#nick2") .value.length<5){throw  {src: document.querySelector("#nick2"),msg: 'för kort, spelare 2'}}
            if(document.querySelector("#color1").value==="#fff"){throw  {src: document.querySelector("#color1"),msg: 'kan inte vara vit, spelare 1'}}
            if(document.querySelector("#color1").value==="#000"){throw  {src: document.querySelector("#color1"),msg: 'kan inte vara svart, spelare 1'}}
            if(document.querySelector("#color2").value==="#fff"){throw  {src: document.querySelector("#color2"),msg: 'kan inte vara vit, spelare 2'}}
            if(document.querySelector("#color2").value==="#000"){throw  {src: document.querySelector("#color2"),msg: 'kan inte vara svart, spelare 2'}}
            if(document.querySelector("#nick1") .value===document.querySelector("#nick2") .value){throw  {src: document.querySelector("#nick2") ,msg: 'wtf sama namn'}}
            if(document.querySelector("#color1").value===document.querySelector("#color2").value){throw  {src: document.querySelector("#color2"),msg: 'wtf same färg'}}
            oGameData.initiateGame();
            return true;
        } catch(oError){
            document.querySelector("#errorMsg").textContent=oError.msg;
            oError.src.focus();
            return false;
        }
}
//pre: true
//post:sets ogamedata feilds, hides form, shows gamearea, clearss board, sets player, sets edvent listner click on table
//calls updateBoard, math.random, updateplayer, execute move
//uses nicknameplayerone, nicknameplayertwo, colorplayerone, colorplayertwo, playerone, playertwo
//migth adjust see adendum 1
oGameData.initiateGame=()=>{
    oGameData.initGlobalObject();
    document.querySelector('form')      .classList.add("d-none");
    document.querySelector('#game-area').classList.remove("d-none");
    document.querySelector('#game-area').focus();

    document.querySelector("#errorMsg").textContent="";
    oGameData.nickNamePlayerOne=document.querySelector("#nick1").value;
    oGameData.nickNamePlayerTwo=document.querySelector("#nick2").value;
    oGameData.colorPlayerOne=  document.querySelector("#color1").value;
    oGameData.colorPlayerTwo=  document.querySelector("#color2").value;

    switch(Math.floor(Math.random()*2)){
        case 0:
            oGameData.currentPlayer=oGameData.playerOne;
            break;
            default: 
            oGameData.currentPlayer=oGameData.playerTwo;
            break;
    }
    oGameData.updatePlayer();
    oGameData.updateBoard();
    document.querySelector("table[class]").addEventListener("click",oGameData.clickTableEvent);
    //oGameData.oppAi=new mything(playerTwo);
}
//pre: n/a
//post: n/a
//this function is used to add and remove th event listner from the table
oGameData.clickTableEvent=(evt)=>{ //inspo with the "evt" syntax from here but i adjusted it a lot, main inspo was the no params in the func call and then one in this one https://stackoverflow.com/questions/256754/how-to-pass-arguments-to-addeventlistener-listener-function
        try{
            if(oGameData.gameField[Math.floor(Number(evt.target.dataset.id)*0.34)][Number(evt.target.dataset.id)%3]!==""){throw {}}
            if(oGameData.checkForGameOver()!==0){throw {}}
            oGameData.executeMove(evt.target);
        }catch(oError){}
}
//pre: click on game board&& valid position&& checkforgameover()===0
//post:writes to table cell, updates color of table cell, swaps player, uppdates gui, checks gamestate to determin outcome
//calls updateBoard, checkforgameover, swapplayer, updateplayer, initglobalobject
//uses currentplayer, playerone, colorplayerone, colorplayertwo, nicknameplayerone, nicknameplayertwo
// if the game has ended by any means it hides the game area, shows the form, removes the eventlsitner on table and reinitalizes the ogamedata object
//uppdated check adendum 1
oGameData.executeMove=(target)=>{
    let targetRow=Math.floor((Number(target.dataset.id))*(2.9/8));
    let targetCol=(Number(target.dataset.id))%3;
    oGameData.gameField[targetRow][targetCol]=oGameData.currentPlayer;
    switch(oGameData.checkForGameOver()){
        case 0: oGameData.swapPlayer();  oGameData.updatePlayer();  oGameData.updateBoard();// oGameData.oppAi.turn(oGameData.gameField);
            return;
        case 1: 
            document.querySelector(".jumbotron >h1").textContent=oGameData.nickNamePlayerOne+": vinnare, Spela igen?";
            break;
        case 2:
            document.querySelector(".jumbotron >h1").textContent=oGameData.nickNamePlayerTwo+": vinnare, Spela igen?";
            break;
        case 3:
            document.querySelector(".jumbotron >h1").style.color="black";
            document.querySelector(".jumbotron >h1").textContent="oavgjort";
            break;
    }// all below only execute if the game has ended
    document.querySelector('form')      .classList.remove("d-none");
    document.querySelector('#game-area').classList.add   ("d-none");
    document.querySelector("table[class]").removeEventListener("click",oGameData.clickTableEvent);
}
//pre: true
//post: int 0||1||2||3
//represents board state 0: in progress, 1:player 1 wictory, 2:plaayer 2 wictory, 3: stalemate
//calls on checkrow checkcol checkdiag and checkinprogress, uses playerone and playertwo
//updated check adendum 1
oGameData.checkForGameOver=()=>{
    let c=oGameData.playerOne;
    for(let i=0;i<2;i++){
        for(let j=0;j<3;j++){
            if(oGameData.gameField[j][  0  ]!==c){continue;}
            if(oGameData.gameField[j][  1  ]!==c){continue;}
            if(oGameData.gameField[j][  2  ]!==c){continue;}
            return i+1;}
        for(let j=0;j<3;j++){
            if(oGameData.gameField[0][  j  ]!==c){continue;}
            if(oGameData.gameField[1][  j  ]!==c){continue;}
            if(oGameData.gameField[2][  j  ]!==c){continue;}
            return i+1;}
        for(let j=0;j<2;j++){
            if(oGameData.gameField[0][0+j*2]!==c){continue;}
            if(oGameData.gameField[1][  1  ]!==c){continue;}
            if(oGameData.gameField[2][2-j*2]!==c){continue;}
            return i+1;
        }c=oGameData.playerTwo;}
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if(oGameData.gameField[i][  j  ]===""){return 0;}
        }
    }
    return 3;
}
//pre: true
//post:swaps current player
//uses currentplayer, playerone, playertwo
oGameData.swapPlayer=()=>{
    switch(oGameData.currentPlayer){
        case oGameData.playerOne:   oGameData.currentPlayer=oGameData.playerTwo;    break;
        case oGameData.playerTwo:   oGameData.currentPlayer=oGameData.playerOne;    break;
    }
}
//pre: true
//post:updates displayed player turn graphics
//uses currentplayer, playerone, nicknameplayerone, nicknameplayertwo, colorplayerone, colorplayertwo
oGameData.updatePlayer=()=>{
    let playerChar, playerName, playercolor;
    playerChar= oGameData.currentPlayer;
    playerName= oGameData.currentPlayer===oGameData.playerOne?oGameData.nickNamePlayerOne:oGameData.nickNamePlayerTwo;
    playercolor=oGameData.currentPlayer===oGameData.playerOne?oGameData.colorPlayerOne:oGameData.colorPlayerTwo;
    document.querySelector(".jumbotron >h1").style.color= playercolor;
    document.querySelector(".jumbotron >h1").textContent="aktuella spelare är "+playerName+"("+playerChar+")";
}
//pre: true
//post: updates table to reflect gamefeild
//uses gamefeild, playerone, playertwo, colorplayerone, colorplayertwo
//chekc adendum 1
oGameData.updateBoard=()=>{
    document.querySelectorAll("td[data-id]").forEach((element,index)=>{
        element.textContent=oGameData.gameField[Math.floor(index*0.34)][index%3];
        switch(oGameData.gameField[Math.floor(index*0.34)][index%3]){
            case oGameData.playerOne: element.style.backgroundColor=oGameData.colorPlayerOne; break;
            case oGameData.playerTwo: element.style.backgroundColor=oGameData.colorPlayerTwo; break;
            default: element.style.backgroundColor="#fff"; break;
        }
    });
}


/*  ADENDUM 1
i am planning on moving the internal (code centered) board data to a 3X3 matrix instead of a 9 array
this would look like [["","",""],["","",""],["","",""]] instead of ["","","","","","","","",""]
the main benefit to doing it like this is that i can implament the ai opponent i have been working on
as a side project, (i and a friend compeeted abt who could make the coolest algorythm without loooking it up)

my solution used a matrix to be able to use transpositions and row reversalas to rotate and flip the board,
drasticaally reducing the number of posible boards. afet every manipulation i checked it against a lookuptable
i developed through using a helper program and i also made sure to do every manipulation to an index matrix of the same dimentions.
when a match was found i take the sugested play from the table apply it to the index matrix to get the original position of
the suggested play before the manipulations, and then i set that position in the matrix.

alterations needed:
 [X]  change the variable ogamedata.gamefeild to a matrix
 [x]  change checkforgameover, (potential sub funcitons) to acommedate matrix
 [/]  change initategame, to make a new object of the ai 
 [X]  change executeMove, to set gamefield and call on updateboard rather than access the board directly
 [X]  add updateboard, inversse of fetch changing the displayed board to fit the internal matrix rather than the other way around
 [X]  remove fetch method to set gamefeild correctly
*/

/** 
 * update
 * importing things (like the ai atm) seems tricky and convalouted to do
 * i can look into it further in the future but for now ill leave it as is,
 * the only thing to fix is basically the topmost lines with import and depending
 * on how that pans out maybe how the functions are called further down in the file.
 * it would only be called upon in like 2 instances, when its created and when
 * its made to take a turn. both of which are short and easy to add.
 * 
 * beyond that i think that maybe a wasy to choose wether to select the ai opp or
 * not would be a good thing to have, which might add some code. atm im thinking of
 * branching it at the validation step and if either player has a specific nickname
 * then theyre transformed into the bot. i think i may need to add some delay before
 * the bot plays in case u have a bot vs bot scenario and i should also dissable the
 * event listner for the duration of the bot turn. and if its bot vs bot i cant use 
 * a player click based execution path (since the player never clicks).
 * 
 * a posible solution is to have if bot play bot call at the end of a click and then
 * rewrite the turn method in the ai to preform a click on the element if thats possible
 * which would then retrigger the thing that started this turn to begin with (bubt since
 * its a normal turn the player would swap and everything should work like intended).
 * 
 * ill have to look into it but for now i kinda just dont wanna. im thinking of using this
 * styling of comment for more blog like explinations maybe, ive been pretty inconsecvential with
 * it in the past and im not sure it truly matters that much but might as well yk would look neat
*/