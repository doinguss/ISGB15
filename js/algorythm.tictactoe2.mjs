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
            if(--err===0){console.warn(this.mx2s(o));return;}
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
        return table[this.mx2s(o)]==null?   -1:table[this.mx2s(o)];
        }
    }