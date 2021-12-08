// Lab 4: US Crime Data Map
// Create a variable to hold our map
let myMap;
// Create a variable to hold our canvas
let canvas;
// Create a new Mappa instance using Leaflet.
const mappa = new Mappa("Leaflet");

// Put map options in a single object
const options = {
  lat: 38.5,
  lng: -98.0,
  zoom: 4,
  style:
    "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
};

// Canvas parameters to work with
var canvasWidth = 1450;
var canvasHeight = 750;
var graphCanvasHeight = 400;

//Graph length
var graphStart = 50;
var graphEnd = 1200;

var currentColor = 200;
var crimeVal;
var graphColor = "";
var c1;
var c2;

var stateSelected;
var stateUnselected;

var statename = "";
var polygons;

var colVals = [];
var years = [];
var crimeRates = [];
var mapMin = "";
var mapMax = "";

var yearMin;
var yearMax;
var crimeSelect;
var yearCrime = "";
var sliderMark;
var crimeSelect = "";
let yearSlider;

function preload() {
  crimes = loadTable("data/CrimeByState.csv", "csv", "header");
}

function setup() {
  canvas = createCanvas(canvasWidth, canvasHeight);
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);

  //var statesData is the geoJSON variable from states.js file
  polygons = myMap.geoJSON(statesData, "Polygon");
  multiPolygons = myMap.geoJSON(statesData, "MultiPolygon");

  // Load the State lookup tables to retrieve state names with mouseClicked().
  polygonLookup = loadTable("data/PolygonLookup.csv", "csv", "header");
  multiPolygonLookup = loadTable(
    "data/MultiPolygonLookup.csv",
    "csv",
    "header"
  );

  //the default color of the state is stateUnselected, the stateSelected changes the state color when hovering over
  stateSelected = color(255, 174, 66, 125);
  stateUnselected = color(150, 100, 100, 125);

  // Only redraw the point when the map changes and not every frame.
  myMap.onChange(drawStates);

  // Create a slider below the map:
  // Reference; https://p5js.org/reference/#/p5/createSlider
  yearSlider = createSlider(1960, 2014, 1960);
  yearSlider.position(graphStart, canvasHeight + graphCanvasHeight - 50); //slider x and y position
  yearSlider.size(graphEnd - graphStart); //length of slider, must coincide with the length of the graph

  //Create buttons for each crime rate
  //Reference: https://editor.p5js.org/skupin@sdsu.edu/sketches/GfhxFivCi Previous lab 4
  //RBG color mode to get color buttons Reference: https://www.w3schools.com/colors/colors_rgb.asp
  murderButton = createButton(
    "Murder Rate",
    "Murder and nonnegligent manslaughter rate"
  );
  murderButton.size(145, 35);
  murderButton.style("background-color", color(255, 224, 0));
  murderButton.style("font-weight", "bold");
  murderButton.style("font-size", "16px");
  murderButton.style("color", "#000");
  murderButton.position(0.85 * canvasWidth, 30 + canvasHeight);
  murderButton.mousePressed(function () {
    minMax(murderButton.value()); //calls previous minMax function that gets the min and max values of the data
    crimeYear(murderButton.value(), yearCrime); //calls function that gets the year of the crime
  });

  rapeButton = createButton("Sexual Assault", "Forcible rape rate");
  rapeButton.size(145, 35);
  rapeButton.style("background-color", color(0, 255, 0));
  rapeButton.style("font-weight", "bold");
  rapeButton.style("font-size", "16px");
  rapeButton.style("color", "#000");
  rapeButton.position(0.85 * canvasWidth, 80 + canvasHeight);
  rapeButton.mousePressed(function () {
    minMax(rapeButton.value()); //calls previous minMax function that gets the min and max values of the data
    crimeYear(rapeButton.value(), yearCrime);
  });

  assaultButton = createButton("Assault", "Aggravated assault rate");
  assaultButton.size(145, 35);
  assaultButton.style("background-color", color(0, 240, 175));
  assaultButton.style("font-weight", "bold");
  assaultButton.style("font-size", "16px");
  assaultButton.style("color", "#000");
  assaultButton.position(0.85 * canvasWidth, 130 + canvasHeight);
  assaultButton.mousePressed(function () {
    minMax(assaultButton.value()); //calls previous minMax function that gets the min and max values of the data
    crimeYear(assaultButton.value(), yearCrime); //calls function that gets the year of the crime
  });

  robberyButton = createButton("Robbery Rate", "Robbery rate");
  robberyButton.size(145, 35);
  robberyButton.style("background-color", color(255, 0, 0));
  robberyButton.style("font-weight", "bold");
  robberyButton.style("font-size", "16px");
  robberyButton.style("color", "#fff");
  robberyButton.position(0.85 * canvasWidth, 180 + canvasHeight);
  robberyButton.mousePressed(function () {
    minMax(robberyButton.value()); //calls previous minMax function that gets the min and max values of the data
    crimeYear(robberyButton.value(), yearCrime);
  });

  burglaryButton = createButton("Burglary Rate", "Burglary rate");
  burglaryButton.size(145, 35);
  burglaryButton.style("background-color", color(0, 155, 255));
  burglaryButton.style("font-weight", "bold");
  burglaryButton.style("font-size", "16px");
  burglaryButton.style("color", "#fff");
  burglaryButton.position(0.85 * canvasWidth, 230 + canvasHeight);
  burglaryButton.mousePressed(function () {
    minMax(burglaryButton.value());
    crimeYear(burglaryButton.value(), yearCrime);
  });

  larcenyButton = createButton("Larceny Rate", "Larceny-theft rate");
  larcenyButton.size(145, 35);
  larcenyButton.style("background-color", color(15, 0, 255));
  larcenyButton.style("font-weight", "bold");
  larcenyButton.style("font-size", "16px");
  larcenyButton.style("color", "#fff");
  larcenyButton.position(0.85 * canvasWidth, 280 + canvasHeight);
  larcenyButton.mousePressed(function () {
    minMax(larcenyButton.value());
    crimeYear(larcenyButton.value(), yearCrime);
  });

  motorTheftButton = createButton("Car Theft Rate", "Motor vehicle theft rate");
  motorTheftButton.size(145, 35);
  motorTheftButton.style("background-color", color(247, 0, 255));
  motorTheftButton.style("font-weight", "bold");
  motorTheftButton.style("font-size", "16px");
  motorTheftButton.style("color", "#fff");
  motorTheftButton.position(0.85 * canvasWidth, 330 + canvasHeight);
  motorTheftButton.mousePressed(function () {
    minMax(motorTheftButton.value());
    crimeYear(motorTheftButton.value(), yearCrime);
  });
}

function draw() {
  yearCrime = yearSlider.value().toString();
  crimeYear(crimeSelect, yearCrime);
  drawStates();
  BottomGraph();
  
  //setGradient(1300, 450, 25, 200, 0, 100);
  //Hover icon on map with instructions
  //Reference: https://editor.p5js.org/skupin@sdsu.edu/sketches/8jl8Q9-42 from a previous lab
  push();
  push();
  fill(220);
  stroke(100, 100, 170);
  strokeWeight(4);
  rect(canvasWidth - 320, 0, 320, 190);
  pop();
  textAlign(CENTER);
  textSize(40);

  fill(120);
  textStyle(BOLD);
  text("U.S. Crime Map", canvasWidth - 160, 50);
  textSize(28);
  text("1960 - 2014", canvasWidth - 160, 80);
  textAlign(LEFT);
  textSize(20);
  text("Instructions:", canvasWidth - 214, 105);
  textSize(16);
  text("1. Select a state on the map.", canvasWidth - 266, 130);
  text("2. Select a crime button to see", canvasWidth - 266, 150);
  text(" the change in crime.", canvasWidth - 240, 170);
  pop();

  //giant rectangle that borders the canvas map
  push();
  stroke(100, 100, 170);
  strokeWeight(4);
  noFill();
  rect(0, 0, canvasWidth, canvasHeight);
  pop();

  //add a slider marker
  myp5b.push();
  myp5b.stroke(255, 0, 0);
  myp5b.strokeWeight(3);
  myp5b.line(sliderMark, 100, sliderMark, 300);
  // console.log(sliderPos);
  myp5b.pop();

  sliderMark = map(yearSlider.value(), 1960, 2014, graphStart, graphEnd);
}

//use this for the legend to put in the lower left of the map canvas, want darker shades to be higher rate and lighter shades to be lower
function setGradient(x, y, w, h, satlow, sathigh) {
  for (let i = y; i <= y + h; i++) {
    var inter = map(i, y, y + h, 0, 2);
    var c = lerpColor(satlow, sathigh, inter); //finds interpolated colors, or colors in between a third color between two blended colors
    stroke(c);
    line(x, i, x + w, i);
  }
}

//base code function
function mouseMoved() {
  var mousePosition = myMap.pixelToLatLng(mouseX, mouseY);
  for (let i = 0; i < polygons.length; i++) polygons[i].selected = false; // Remove this if multi-select is ok
  for (let i = 0; i < polygons.length; i++) {
    if (
      pnpoly(
        polygons[i][0].length,
        polygons[i][0],
        mousePosition.lng,
        mousePosition.lat
      ) == true
    ) {
      polygons[i].selected = true;
      // print("mousePressed in poly " + i);
      drawStates();
    }
  }

  for (var m = 0; m < multiPolygons.length; m++)
    for (let i = 0; i < multiPolygons[m].length; i++) {
      multiPolygons[m].selected = false;
      if (
        pnpoly(
          multiPolygons[m][i][0].length,
          multiPolygons[m][i][0],
          mousePosition.lng,
          mousePosition.lat
        ) == true
      ) {
        multiPolygons[m].selected = true;
        // print("mouse in multipoly " + i);
        drawStates();
      }
    }
}

// this function changes the color of the state when hovered over
// base code function
function pnpoly(nvert, vert, testx, testy) {
  var i,
    j = 0;
  var c = false;
  for (i = 0, j = nvert - 1; i < nvert; j = i++) {
    if (
      vert[i][1] > testy != vert[j][1] > testy &&
      testx <
        ((vert[j][0] - vert[i][0]) * (testy - vert[i][1])) /
          (vert[j][1] - vert[i][1]) +
          vert[i][0]
    )
      c = !c;
  }
  return c;
}

//function for clicking a state, will return the name of state in console and the min and max value
function clickedState() {
  const mousePosition = myMap.pixelToLatLng(mouseX, mouseY);
  for (let i = 0; i < polygons.length; i++) polygons[i].selected = false;
  for (let i = 0; i < polygons.length; i++) {
    if (
      pnpoly(
        polygons[i][0].length,
        polygons[i][0],
        mousePosition.lng,
        mousePosition.lat
      ) == true
    ) {
      polygons[i].selected = true;
      // print("mousePressed in poly " + i);
      let row = polygonLookup.findRow(i.toString(), "Polygon");
      statename = row.obj.State;
      // print(row.obj.State);
      // crimeYear(selectedCrime, yearCrime);
      minMax(crimeSelect);
      console.log(statename);
      break;
    }
  }

  for (var m = 0; m < multiPolygons.length; m++)
    for (let i = 0; i < multiPolygons[m].length; i++) {
      multiPolygons[m].selected = false;
      if (
        pnpoly(
          multiPolygons[m][i][0].length,
          multiPolygons[m][i][0],
          mousePosition.lng,
          mousePosition.lat
        ) == true
      ) {
        multiPolygons[m].selected = true;
        // 'm' is the state; 'i' is each multi-feature.
        // print("mouse in multipoly " + m);
        let row = multiPolygonLookup.findRow(m.toString(), "MultiPolygon");
        statename = row.obj.State;
        // print(row.obj.State);
        // drawStates();
        // crimeYear(selectedCrime, yearCrime);
        minMax(selectedCrime);
        console.log(statename);
        break;
      }
    }
}

function mousePressed() {
  redraw();
  if (mouseButton == LEFT) {
    var stateVal = clickedState();
  }
}

//Reference: Marissa Tucker https://editor.p5js.org/mtucker4816/sketches/kXX7X6VJn
//this function will be used to reference the HSB color mode since it pops out more and gives better visualization
//each crime type will have a different h value
function crimeHues(crime) {
  if (crime == "Robbery rate") {
    h = 0;
  } else if (crime == "Murder and nonnegligent manslaughter rate") {
    h = 51;
  } else if (crime == "Forcible rape rate") {
    h = 102;
  } else if (crime == "Aggravated assault rate") {
    h = 153;
  } else if (crime == "Burglary rate") {
    h = 204;
  } else if (crime == "Larceny-theft rate") {
    h = 255;
  } else if (crime == "Motor vehicle theft rate") {
    h = 306;
  } else {
    h = 0;
  }
  return h;
}

function drawStates() {
  clear();
  colorMode(HSB); //HSB = Hue, Saturation, Brightness: Reference: https://p5js.org/reference/#/p5/colorMode

  for (let i = 0; i < polygons.length; i++) {
    let currentYear = crimes.findRows(yearCrime, "Year");
    crimeVal = currentYear[i].obj[crimeSelect];

    let sat = map(crimeVal, yearMin, yearMax, 0, 255);
    let brt = map(crimeVal, yearMin, yearMax, 0, 100);
    currentHue = crimeHues(crimeSelect);
    currentColor = color(currentHue, sat, 255);
    graphColor = color(currentHue, 125, 125, 0.5); //opacity of 0.5 so the lines of the graph will show up behind the color

    beginShape();
    if (polygons[i].selected) {
      //need to add an "or if state is acutally slected"
      strokeWeight(3);
      fill(currentColor);
    } else {
      fill(currentColor);
      strokeWeight(0.75);
    }
    for (let j = 0; j < polygons[i][0].length; j++) {
      let lat = polygons[i][0][j][1];
      let long = polygons[i][0][j][0];
      let pos = myMap.latLngToPixel(lat, long);
      vertex(pos.x, pos.y);
    }
    endShape();
  }

  for (let m = 0; m < multiPolygons.length; m++) {
    let currentYear = crimes.findRows(yearCrime, "Year");
    crimeVal = currentYear[m].obj[crimeSelect];

    let sat = map(crimeVal, yearMin, yearMax, 0, 255);
    let brt = map(crimeVal, yearMin, yearMax, 0, 100);
    currentHue = crimeHues(crimeSelect);
    currentColor = color(currentHue, sat, 255);
    graphColor = color(currentHue, 255, 255, 0.5);

    if (multiPolygons[m].selected) {
      strokeWeight(3);
      fill(currentColor);
    } else {
      fill(currentColor);
      strokeWeight(0.75);
    }
    for (let j = 0; j < multiPolygons[m].length; j++) {
      beginShape();
      for (let k = 0; k < multiPolygons[m][j][0].length; k++) {
        let lat = multiPolygons[m][j][0][k][1];
        let long = multiPolygons[m][j][0][k][0];
        let pos = myMap.latLngToPixel(lat, long);
        vertex(pos.x, pos.y);
      }
      endShape();
    }
  }
  colorMode(RGB); //Return color mode to default
}

//Fetching data from crime csv file functions
//With these datasets, getting the minimum and maximum values for selected crime rate, and map
function minMax(crime) {
  let rows = crimes.findRows(statename, "State");
  for (let i = 0; i < rows.length; i++) {
    let stateSelect = rows[i].obj;
    console.log(stateSelect); //should return name of state that was clicked
    colVals[i] = stateSelect[crime];
    console.log(colVals);
    years[i] = stateSelect.Year;
  }
  mapMin = min(colVals);
  mapMax = max(colVals);
  crimeSelect = crime;
} //getting the min and max crime rates for specific states

function crimeYear(crime, yearCrime) {
  let rows = crimes.findRows(yearCrime, "Year");
  for (var i = 0; i < rows.length; i++) {
    let yearSelect = rows[i].obj;
    crimeRates[i] = yearSelect[crime];
  }
  yearMin = min(crimeRates);
  yearMax = max(crimeRates);
}

//Instance Mode reference: https://www.youtube.com/watch?v=Su792jEauZg
//Create new canvas for the slider and buttons

var myp5 = new p5(s, "c1");

var s = function (p) {
  p.setup = function () {
    p.createCanvas(canvasWidth, 400);
  };

  p.draw = function () {
    p.background(125);
  };
};

var myp5b = new p5(s, "c2"); //this order lets the graph show up on the bottom canvas

function BottomGraph() {
  myp5b.push();
  myp5b.noFill();
  myp5b.stroke(100, 100, 170);
  myp5b.strokeWeight(4);
  myp5b.rect(0, 0, width, 400);
  myp5b.pop();

  // Draw background grid.
  myp5b.push();
  myp5b.stroke(255);
  myp5b.textSize(8);
  myp5b.textAlign(CENTER);

  myp5b.line(graphStart, 100, graphEnd, 100); //bottom line
  myp5b.line(graphStart, 300, graphEnd, 300); //right border line
  myp5b.line(graphStart, 100, graphStart, 300);
  myp5b.line(graphEnd, 100, graphEnd, 300);
  for (var i = 0; i <= colVals.length; i++) {
    let x = map(i, 0, colVals.length, graphStart, graphEnd);
    myp5b.stroke(180);
    myp5b.line(x, 100, x, 300);
  }
  myp5b.pop();

  myp5b.push();
  myp5b.fill(255);
  myp5b.textAlign(CENTER);
  myp5b.textSize(14);
  for (var k = 0; k < years.length; k += 1) {
    //iterates to show every year
    let x = map(k, 0, years.length - 1, graphStart, graphEnd);
    //years will be the length of the graph
    myp5b.push();
    myp5b.translate(x, 325);
    myp5b.rotate(-HALF_PI / 2);
    myp5b.text(years[k], 0, 0);
    myp5b.pop();
  }
  myp5b.pop();

  myp5b.push();
  //p.textAlign(CENTER);
  myp5b.textSize(14);
  myp5b.fill(200);
  myp5b.noStroke();
  myp5b.text(mapMax, 20, 100);

  myp5b.fill(200);
  myp5b.noStroke();
  myp5b.text(mapMin, 20, 300);
  myp5b.pop();

  myp5b.push();
  myp5b.fill(graphColor);
  myp5b.stroke(255);
  //p.strokeWeight(1);
  myp5b.beginShape();
  myp5b.vertex(75, 300);
  for (let i = 0; i < colVals.length; i++) {
    var x = map(i, 0, colVals.length - 1, graphStart, graphEnd);
    var y = map(colVals[i], mapMin, mapMax, 300, 100);
    myp5b.vertex(x, y);
  }

  //length of the graph that will show up
  myp5b.vertex(graphEnd, 300);
  myp5b.endShape();
  myp5b.pop();

  //title for the graph that shows the crime type and the state
  myp5b.push();
  myp5b.fill(255);
  myp5b.textSize(32);
  myp5b.textAlign(LEFT);
  myp5b.textSize(20);
  myp5b.text(statename + " " + crimeSelect + " per 100,000 people", 50, 75);
  myp5b.pop();
}
