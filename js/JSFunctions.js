//import {mything} from 'algorythm.tictactoe2.mjs';
//import {turn} from 'algorythm.tictactoe2.mjs'; //could not make work without editing html
"use strict";


//pre: body load
//post: initlaizes ogamedata, hides gamearea, creates div check box and label, sets values and attributes of new elementss, adds them to dom
//calls validateform, initglobalobject
//catches does nothing
//document.body.onload=()=>{
addEventListener("load",()=>{
    oGameData.initGlobalObject();
    document.querySelector('#game-area').classList.add("d-none");
    document.querySelector('#newGame').addEventListener("click",()=>oGameData.validateForm());
    let timerdiv = document.createElement("div"); //here and down is new for assignment 4, rn adding checkbox + label for the timer
    let timercbx = document.createElement("input");
    let timerlbl = document.createTextNode("5 sec turn timer");
    timercbx.setAttribute("type","checkbox");
    timercbx.id="timer-cbx";
    timerdiv.id="timer-div";
    timerdiv.appendChild(timercbx);
    timerdiv.appendChild(timerlbl);
    timerdiv.classList.add("inline");
    document.querySelector("#div-in-form").insertBefore(timerdiv,document.querySelector("#div-with-a"));
    // algorythm stuff down below
    let oppaidiv = document.createElement("div");//adding checkbox + label for the ai/algorythm opponent (basically the same as a bove)
    let oppaicbx = document.createElement("input");
    let oppailbl = document.createTextNode("player 2 bot");
    oppaicbx.setAttribute("type","checkbox");
    oppaicbx.id="bot-cbx";
    oppaidiv.id="bot-div";
    oppaidiv.appendChild(oppaicbx);
    oppaidiv.appendChild(oppailbl);
    oppaidiv.classList.add("inline");
    document.querySelector("#div-in-form").insertBefore(oppaidiv,document.querySelector("#div-with-a"));
}
);


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
    oGameData.intervalId = null;
    oGameData.visualCountdown = 5;
    oGameData.oppAiEnabled = false;
    oGameData.oppAiId = null;
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
            if(document.querySelector("#color1").value==="#ffffff"){throw  {src: document.querySelector("#color1"),msg: 'kan inte vara vit, spelare 1'}}
            if(document.querySelector("#color1").value==="#000000"){throw  {src: document.querySelector("#color1"),msg: 'kan inte vara svart, spelare 1'}}
            if(document.querySelector("#color2").value==="#ffffff"){throw  {src: document.querySelector("#color2"),msg: 'kan inte vara vit, spelare 2'}}
            if(document.querySelector("#color2").value==="#000000"){throw  {src: document.querySelector("#color2"),msg: 'kan inte vara svart, spelare 2'}}
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
//uses nicknameplayerone, nicknameplayertwo, colorplayerone, colorplayertwo, playerone, playertwo, timerenabled
//migth adjust see adendum 1
oGameData.initiateGame=()=>{
    oGameData.initGlobalObject();
    document.querySelector('form')      .classList.add("d-none");       //display block
    document.querySelector('#game-area').classList.remove("d-none");
    document.querySelector('#game-area').focus();

    document.querySelector("#errorMsg").textContent="";                  //gathering data block
    oGameData.nickNamePlayerOne=document.querySelector("#nick1").value;
    oGameData.nickNamePlayerTwo=document.querySelector("#nick2").value;
    oGameData.colorPlayerOne=  document.querySelector("#color1").value;
    oGameData.colorPlayerTwo=  document.querySelector("#color2").value;
    oGameData.timerEnabled= document.querySelector("#timer-cbx").checked;
    oGameData.oppAiEnabled=   document.querySelector("#bot-cbx").checked;
    
    if(oGameData.timerEnabled){                                             //timerspecific block
        document.querySelector("#errorMsg").textContent= oGameData.visualCountdown;
    }

    if(oGameData.oppAiEnabled){                                             //algorythm opponent specific block
        oGameData.oppAiId=new mything(oGameData.playerTwo);
        oGameData.currentPlayer=oGameData.playerOne; 
    }

    else{                                                                   //standard player randomizer block
        switch(Math.floor(Math.random()*2)){
            case 0:
                oGameData.currentPlayer=oGameData.playerOne;
                break;
                default: 
                oGameData.currentPlayer=oGameData.playerTwo;
                break;
            }
        }

    oGameData.updatePlayer();                                               //readys board
    oGameData.updateBoard();
    document.querySelector("table[class]").addEventListener("click",oGameData.clickTableEvent);
}
//pre: click on element
//post: execute move if conditions met
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
    let targetRow=Math.floor(((target.dataset.id))*(2.9/8));    //converts nmber 0-8 to matrix positions [0-2][0-2]
    let targetCol=((target.dataset.id))%3;
    oGameData.gameField[targetRow][targetCol]=oGameData.currentPlayer;  //adds current player char to specified position in matrix (not the visual board)

    if(oGameData.oppAiEnabled && oGameData.checkForGameOver()===0){     //ai/ allgorythmthings self explanitory
        oGameData.oppAiId.turn(oGameData.gameField);
    }
    switch(oGameData.checkForGameOver()){                           //gamestate check
        case 0: 
        oGameData.swapPlayer();  
        oGameData.updatePlayer();  
        oGameData.updateBoard();
            return;
        case 1: 
            document.querySelector(".jumbotron >h1").textContent=oGameData.nickNamePlayerOne+": vinnare, Spela igen?";
            break;
        case 2:
            if(oGameData.oppAiEnabled){ document.querySelector(".jumbotron >h1").style.color=oGameData.colorPlayerTwo;}
            document.querySelector(".jumbotron >h1").textContent=oGameData.nickNamePlayerTwo+": vinnare, Spela igen?";
            break;
        case 3:
            document.querySelector(".jumbotron >h1").style.color="black";
            document.querySelector(".jumbotron >h1").textContent="oavgjort";
            break;
    }           // all below only execute if the game has ended
    clearTimeout(oGameData.timerId);
    clearInterval(oGameData.intervalId);
    oGameData.timerId=null;
    oGameData.intervalIdId=null;
    oGameData.initGlobalObject();
    document.querySelector("#errorMsg").textContent= "";
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
    oGameData.ensureMatrix(); //in case of "malicious" user interference like the autochecker assigning a value of the wrong format to gamefeild
    let c=oGameData.playerOne;
    for(let i=1;i<3;i++){ //changed from "0 to 2" to "1 to 3" so it indexes at 1 instead of 0, otherwise its the same. this simplifies the return at the cost of sligthly obscuring the loop duration, itll still only play twice tho its the same as before.
        for(let j=0;j<3;j++){
            if(oGameData.gameField[j][  0  ]!==c){continue;}    //checks each row
            if(oGameData.gameField[j][  1  ]!==c){continue;}
            if(oGameData.gameField[j][  2  ]!==c){continue;}
            return i;}
        for(let j=0;j<3;j++){
            if(oGameData.gameField[0][  j  ]!==c){continue;}    //checks each collumn
            if(oGameData.gameField[1][  j  ]!==c){continue;}
            if(oGameData.gameField[2][  j  ]!==c){continue;}
            return i;}
        for(let j=0;j<2;j++){
            if(oGameData.gameField[0][0+j*2]!==c){continue;}    //checks the two diagonals
            if(oGameData.gameField[1][  1  ]!==c){continue;}
            if(oGameData.gameField[2][2-j*2]!==c){continue;}
            return i;
        }c=oGameData.playerTwo;}        //changes to playr two and tries all above again (computationally very lenient due to the continue and lack of math)
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if(oGameData.gameField[i][  j  ]===""){return 0;}   //checks if in progress
        }
    }
    return 3;                       //if all else fails, tie
}
//pre: true
//post:swaps current player
//uses currentplayer, playerone, playertwo
oGameData.swapPlayer=()=>{
    if(oGameData.oppAiEnabled){return;}     //when playing with the ai u never swap the current player
    switch(oGameData.currentPlayer){
        case oGameData.playerOne:   oGameData.currentPlayer=oGameData.playerTwo;    break;
        case oGameData.playerTwo:   oGameData.currentPlayer=oGameData.playerOne;    break;
    }
}
//pre: true
//post:updates displayed player turn graphics, handles timer stuff if enabled
//uses currentplayer, playerone, nicknameplayerone, nicknameplayertwo, colorplayerone, colorplayertwo
oGameData.updatePlayer=()=>{
    let playerChar, playerName, playercolor;        //this block is jjust for the visula indication of whos turn it is
    playerChar= oGameData.currentPlayer;
    playerName= oGameData.currentPlayer===oGameData.playerOne?oGameData.nickNamePlayerOne:oGameData.nickNamePlayerTwo;
    playercolor=oGameData.currentPlayer===oGameData.playerOne?oGameData.colorPlayerOne:oGameData.colorPlayerTwo;
    document.querySelector(".jumbotron >h1").style.color= playercolor;
    document.querySelector(".jumbotron >h1").textContent="aktuella spelare är "+playerName+"  ("+playerChar+")";
    
    if (!oGameData.timerEnabled){ return;}  //early return
    oGameData.visualCountdown=5;            //this block is for countdowns, i clear both interva and timeout and then reset them to keep the timekeeping constant
    document.querySelector("#errorMsg").textContent= oGameData.visualCountdown;
    clearTimeout(oGameData.timerId);
    clearInterval(oGameData.intervalId);
    oGameData.timerId=setTimeout(()=>{
        if(oGameData.oppAiEnabled){oGameData.instantWin(oGameData.playerTwo);return;}
        oGameData.swapPlayer();
        oGameData.updatePlayer();
        }, 5000);//5000 const and magic nnumber atm, its 5 second as described in the requirements
    oGameData.intervalId=setInterval(() => {
        oGameData.visualCountdown--;
        document.querySelector("#errorMsg").textContent= oGameData.visualCountdown;
        }, 1000);//1000 const rep 1 sec, unlikely to be changed but if u do know that itll remove one sec from the visula timer for whichever interval u change it to, likely not what you want to do
}
//pre: true
//post: updates table to reflect gamefeild
//uses gamefeild, playerone, playertwo, colorplayerone, colorplayertwo
//chekc adendum 1
oGameData.updateBoard=()=>{
    document.querySelectorAll("td[data-id]").forEach((element,index)=>{             //takess the element and its index of each td and fills it with the corresponding matrix value and color
        element.textContent=oGameData.gameField[Math.floor(index*0.34)][index%3];
        switch(oGameData.gameField[Math.floor(index*0.34)][index%3]){
            case oGameData.playerOne: element.style.backgroundColor=oGameData.colorPlayerOne; break;
            case oGameData.playerTwo: element.style.backgroundColor=oGameData.colorPlayerTwo; break;
            default: element.style.backgroundColor="#fff"; break;
        }
    });
}
//pre: player==playerone||player==playertwo && checkforgameover==0
//post: player instantly wins
oGameData.instantWin=(player)=>{
    oGameData.gameField=[[player,player,player],[player,player,player],[player,player,player]]; //just like fills the entire board with the specified player and then play once to instantly win no matter what
    oGameData.executeMove(document.querySelector("td[data-id]"));
}
//pre: true
//post: forces gamefield into being an array (retains values)
// this is made cuz the first lab was entierly orieneted around using a 9 lenght array for the game feild, overwwriting my matrix and generally being a thorn
oGameData.ensureMatrix=()=>{
    if(Array.isArray(oGameData.gameField[0])){return;}  //normal case, early return
    let inp=structuredClone(oGameData.gameField);       //clone
    oGameData.gameField=   [[inp[0]??"",inp[1]??"",inp[2]??""],
                            [inp[3]??"",inp[4]??"",inp[5]??""],
                            [inp[6]??"",inp[7]??"",inp[8]??""]];    //new matrix stripping the value of the clone and assigning it to gamefeild, if any are null itll be replaced with ""
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
 [X]  change initategame, to make a new object of the ai 
 [X]  change executeMove, to set gamefield and call on updateboard rather than access the board directly
 [X]  add updateboard, inversse of fetch changing the displayed board to fit the internal matrix rather than the other way around
 [X]  remove fetch method to set gamefeild correctly
*/

/** update
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

/** my algorythm
 * well whatever doesnt seem to be a way to import a file into here unless i change the html script sorce to module (other ways too but that seems to be the best one)
 * so i throw in the towl at this one for now im just gonna paste the darn code here myself, its not too long since i made all nice like and stuff from scratch myself
 * 
 * okay there here it is isnt it beautiful! i made this in a friednly comp with my friend to see who could make the neatest ai without looking up any solutions 
 * everything is documented on my github : https://github.com/doinguss/tic-tac-toe-algorythm
 * ive also uppploaded this courses progress (in a diffrent repo ofc )
 * 
 * anyway sry if the code commenting standards arent uppheeld in this part, i figured this is beyond the bounds of the assignment anyways so
 */
class mything{
    constructor(playchar){
        this.p=playchar;
    }
    trsp(b) {let o=[["","",""],["","",""],["","",""]];for(let i=0;i<3;i++){for(let j=0;j<3;j++){                     o[i][j]=b[j][i];                       }}return o;}//mirrors on diagonal/ transposes the matrix
    rev (b) {let o=[["","",""],["","",""],["","",""]];for(let i=0;i<3;i++){for(let j=0;j<3;j++){                    o[i][j]=b[i][2-j];                      }}return o;}//reverses the order in each row
    mx2s(b) {let o=""                                ;for(let i=0;i<3;i++){for(let j=0;j<3;j++){if(b[i][j]===""){o+='.';}else{o+=(b[i][j]==this.p?'x':'o');}}}return o;}//generates a 1d string from 2d matrix(3x3) replaces empty with '.'
    turn(b) {//the thing getting called at each turn, checks if boardstate is in lookuptable otherwise manipulates the matrix and looks again untill it finds a match
        let o=structuredClone(b),u=[[0,1,2],[3,4,5],[6,7,8]];// u= index matrix, is manipulated the same way the data matrix is but retains the original position of each position in form of value
        let i=this.lookup(o),err=15;
        while(i===-1){
            o=this.trsp   (o);
            u=this.trsp   (u);
            i=this.lookup (o);
            if(i!==-1){break;}
            o=this.rev    (o);
            u=this.rev    (u);
            i=this.lookup (o);
            if(--err===0){/**/console.warn(this.mx2s(o));/**/return;}
        }
        b[Math.floor(u[Math.floor(i*0.3625)][i%3]*0.3625)][u[Math.floor(i*0.3625)][i%3]%3]=this.p; //the const is 2.9/8 and im taking the floor of that so that itll increase by 1 every third exluding the final one so its 0 0 0 1 1 1 2 2 2 for all the numbers 0 trhough 8
    }
    lookup(o) {//lookup table for compressed gamestates, returns optimal* move (*i dont know its optimal its the best i can do tho xd)
        const table={
            ".........": 0, ".oo.x....": 0, ".o..xo...": 0, "....o....": 0, "x..o.....": 1, "x...o....": 1, "x.....o..": 1, "x.x.o..o.": 1, "x.x..o.o.": 1,
            "x.xo....o": 1, "x.x.o...o": 1, "x.x..o..o": 1, "x.x...o.o": 1, "x.x....oo": 1, "o.o.x....": 1, "o.oox.x..": 1, "o...xo...": 1, "o...x...o": 1,
            "x.oooxxo.": 1, "x.oooxx.o": 1, "xx.oo....": 2, "xx.o.o...": 2, "xx.o..o..": 2, "xx.o...o.": 2, "xx.o....o": 2, "xx..oo...": 2, "xx..o.o..": 2,
            "xx..o..o.": 2, "xx..o...o": 2, "x..oxoxo.": 2, "x..oxox.o": 2, "xx...oo..": 2, "xx....oo.": 2, "xx....o.o": 2, "x......o.": 2, "x.......o": 2,
            "oo.ox.x..": 2, "o..oxox..": 2, "o..ox.xo.": 2, "o..ox.x.o": 2, "ox..xo.o.": 2, "ox.ox.xoo": 2, "ox..xoxoo": 2, "xo..xo..o": 2, "xo.ooxox.": 2,
            "xo.oox.xo": 2, "xo.xooox.": 2, "xo..o.ox.": 2, "xo.xo.oxo": 2, "xxo.oox..": 3, "xxo.o.xo.": 3, "xxo.o.x.o": 3, "xox.o.x.o": 3, "oxo.x..o.": 3,
            "xoo.xxo.o": 3, "xoo.xx.oo": 3, "xoo.ooxx.": 3, "xoo.o.xxo": 3, "xo..oo.x.": 3, "xo..o..xo": 3, "xoo.o.x..": 3, "x.o.oox..": 3, "x.o.o.xo.": 3,
            "x.o.o.x.o": 3, "xo.x..o..": 4, "x.ox..o..": 4, "x..o.ox..": 4, "xoxo..x.o": 4, "xox..ox.o": 4, "xox...xoo": 4, "o........": 4, ".o.......": 4,
            "xo.xx.o.o": 5, "x.oxx.o.o": 5, "xxooo.x..": 5, "oxoxx.oo.": 5, "oxoxx..oo": 5, "oxoox.xo.": 5, "oxo.x.xoo": 5, "xo.oo..x.": 5, "xoxoo.ox.": 5,
            "x.ooo.x..": 5, "xxo.o....": 6, "xox.....o": 6, "oxxoxo.o.": 6, "oxx.xo.oo": 6, "ox..x..oo": 6, "xoxoxo..o": 6, "xox.xo.oo": 6, "xoo.o..x.": 6,
            "xooxoo.x.": 6, "xo.xoo.xo": 6, "xooxo..xo": 6, "x.o.o....": 6, "xxooxo...": 7, "xxoox.o..": 7, "xxoooxx.o": 7, "oxoox....": 7, "oxo.x.o..": 7,
            "ox.oxo...": 7, "ox..xoo..": 7, "ox..xo..o": 7, "ox.ox...o": 7, "ox..x.o.o": 7, "xox.xoo.o": 7, "xo..o....": 7, "xo.xxoo..": 8, "x.oxxoo..": 8,
            "x.oxx.oo.": 8, "xxoooxxo.": 8, "oxoxxo.o.": 8, "oxx.xooo.": 8, "xo.oxo...": 8, "xo..xoo..": 8, "xo..xo.o.": 8, "xoooo.xx.": 8, ".o..o.x..": 7,
            "...oxo...": 0, "x..xoo.o.": 6, "x.ooxo...": 8, "x..xooo..": 2, "xx.oo..o.": 2, "xx..o.oo.": 2, "x...o...o": 2, "xx..o..oo": 2, "xo..x..oo": 6,
            "x.xoxoo.o": 1, "xxo.ooxo.": 3, "xxooo.xo.": 5, "xo..xoxoo": 3}
        return table[this.mx2s(o)]??-1;
        }//ox..xo.o. -> 2 is a loosing move and is the only way to win against this algorythm acounting for its rotations and symetreis. to fix it change it to 6, remove oxx.xooo. ->8 or adjust it to become oxo.xoxo.->8 ,oxxoxo.o. oxx.xo.oo (->6) have now become unreachable and should be replaced by ox..xoxoo ox.oxoxo.(->2) although make sure to test this with the checker i made before hand so that these states are dupes, and also check the test enviroment if these would leed to any dead branches both available on my github (file names setval.js, test.algorythm2.html respectivly) link: https://github.com/doinguss/tic-tac-toe-algorythm  
    }