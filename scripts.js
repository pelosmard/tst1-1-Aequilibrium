var heights = [];
var numelem = 0;

var valley = 1;				//	Valley
var peak = 2;				//	Peak
var trend = 0;				//	Up=1, Down=-1
var origheigth = 0;			//	The original height
var castles = 0;			//	Castles built
var castlesarr = [];		//	Array that has the properties of the created castles
var countcast = 0;			//	Counter for the actual castle number
var peakorvalley = 0;		//	variable to define if it is apeak or a valley
var distmin = 0;			//	distance from minimum
var distmax = 0;			//	distance from maximum
var was_castle;             //  Boolean for displaying info when is castle or not
var booltmin = false;		//	Boolean for distance from minimum
var boolmax = false;		//	Boolean for distance from maximum

function showDiv(divname) {
    var x = document.getElementById(divname);
    x.style.display = "block";
}

function hideDiv(divname) {
    var x = document.getElementById(divname);
    x.style.display = "none";
}

function initialState() {
    hideDiv("divnums");
    hideDiv("divbutproc");
    hideDiv("divresult");
}

function countFunction(field) {
    var x, text;

    // Get the value of the input field with id="field"
    x = document.getElementById(field).value;

    // If x is Not a Number or less than one or greater than 10
    if (isNaN(x) || x < 1 || x > 10) {
        text = "Input not numeric or valid";
        document.getElementById("err").innerHTML = text;
    } else {
        text = "You'll data enter " + x + " values";
        hideDiv("divcount");

        document.getElementById("err").innerHTML = text;

        showDiv("divnums");
        showDiv("divbutproc");
        /*
        var zdiv = document.getElementById("divnums");
        zdiv.style.display = "block";
        var ydiv = document.getElementById("divbutproc");
        ydiv.style.display = "block";
        */
        let xy = Number(x) + Number(1);
        for (let index = xy; index <= 10; index++) {
            var xcell = document.getElementById(index);
            xcell.style.display = "none";
        }
        numelem = x;
    }
}

function ExtractFldsInsArr() {
    for (let index = 1; index <= numelem; index++) {
        var namefld = 'qtty' + index.toString();
        x = document.getElementById(namefld).value;
        console.log('The val of the field ' + namefld + ' index=' + index + ' Is=' + x);
        heights.push(x);
        console.log(heights);
    }
    calcFeasibility();
}

var validIndex = function (numb) {
    if (numb === "") return false;
    return true;
}

var buildCastle = function (position, height, peakorvalley) {
    castlesarr[countcast] = [];
    castlesarr[countcast][0] = countcast;    //  castle
    castlesarr[countcast][1] = position;	 //  position    
    castlesarr[countcast][2] = peakorvalley; //  peakorvalley
    castlesarr[countcast][3] = height;       //  height      
    countcast++;
    console.log(castlesarr);
    was_castle = true;
    CreateTableRow(position, peakorvalley, height, "A place to build a Castle!", was_castle);
}

function CreateTableRow(position, peakorvalley, height, comment, iscastle) {
    var whatispeakvalley = (peakorvalley == 1) ? "Valley" : (peakorvalley == 2) ? "Peak" : "Not feasible";
    var ifiscastle = (iscastle) ? "Is Castle" : "Don't fullfill";
    var table = document.getElementById("TableRes1");
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    cell1.innerHTML = position;
    cell2.innerHTML = whatispeakvalley;
    cell3.innerHTML = height;
    cell4.innerHTML = comment;
    cell5.innerHTML = ifiscastle;
}

function calcFeasibility() {
    let maxval = Math.max(...heights);	//	Get the highest value in the array (works only with ES6/ES2016 destructuring)
    let minval = Math.min(...heights);	//	Get the lowest value in the array (works only with ES6/ES2016 destructuring)
    var longh = heights.length;	    //	The number of elements of array
    var previous_item = false;

    var z = document.getElementById("divresult");
    z.style.display = "block";

    for (var index = 0; index < longh; index++) {
        if (!validIndex(heights[index])) continue;	//	discard empty data
        var current = heights[index];
        was_castle = false;

        distmin = heights[index] - minval;
        distmax = maxval - heights[index];

        if (origheigth != 0) {		            //	Not beginning
            if (index == longh - 1) {	        //	previous item
                var next = heights[index];
                var previous = heights[index - 1];
                previous_item = true;
            } else {
                var previous = heights[index - 1];
                var next = heights[index + 1];
            }

        } else						            //	Beginning
        {
            var next = heights[index + 1];
            //var previous = heights[index];
            var previous = 0;
            origheigth = 1;
        }

        //	Special case for lowest and highest
        if (distmin == 0) {
            if (!booltmin) {				        //	It's a valley! and it's the lowest!
                peakorvalley = valley;
                buildCastle(index, heights[index], peakorvalley);
                trend = 1;			//	Goes Up
                booltmin = true;
            } else
                if (current != previous && current != next) {   //	It's a valley! and it's the lowest!
                    peakorvalley = valley;
                    buildCastle(index, heights[index], peakorvalley);
                    trend = 1;			//	Goes Up
                    booltmin = true;
                }
        } else {
            if (distmax == 0) {
                if (!boolmax) {				    //	It's a peak! and it's the highest!
                    peakorvalley = peak;
                    buildCastle(index, heights[index], peakorvalley);
                    trend = -1;		                //	Goes down
                    boolmax = true;
                } else
                    if (current != previous && current != next) {   //	It's a valley! and it's the lowest!
                        peakorvalley = peak;
                        buildCastle(index, heights[index], peakorvalley);
                        trend = -1;			//	Goes Up
                        boolmax = true;
                    }
            } else {
                if (current == previous) continue;


                if (previous_item) {                //  previous item case
                    if (current > previous) {
                        peakorvalley = peak;
                        buildCastle(index, heights[index], peakorvalley);
                        trend = -1;		            //	Goes down
                    } else
                        if (current < previous) {
                            peakorvalley = valley;
                            buildCastle(index, heights[index], peakorvalley);
                            trend = 1;			//	Goes Up
                        }
                } else
                    if (current > next && current > previous) {
                        peakorvalley = peak;
                        buildCastle(index, heights[index], peakorvalley);
                        trend = -1;		            //	Goes down
                    }
                    else
                        if (current < next && current < previous) {
                            peakorvalley = valley;
                            buildCastle(index, heights[index], peakorvalley);
                            trend = 1;			//	Goes Up
                        } //	else continues the trend
            }
        }
        if (!was_castle) {
            CreateTableRow(index, 0, heights[index], "Not suitable", false);
        }
    }
}