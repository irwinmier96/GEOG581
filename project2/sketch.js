imgX = 0;
imgY = 0;
imgW = 0;
imgH = 0;

//give imgBldgs own variables attempt to map to img map
imgBldgW = 0;
imgBldgH = 0;

let name;
let order;

//old image width and height
imgWOld = 0;
imgHOld = 0;

//pixel size
pixelX = 0;
pixelY = 0;

//Scale variables for rectangle in smaller left image
overviewScale = (1/3);
findScale = 1; // scales from full image to window size
let finderRect;

//pan variables
panFromX = 0;
panFromY = 0;
panToX = 0;
panToY = 0;

//main image boundaries
leftWall = 0; //boundary of left side of canvas
rightWall = 600; //boundary of right side of original image size
upperWall = 0; //boundary for upper side of canvas
bottomWall = 450; //boundary for bottom side of canvas

//overview boundaries
leftWallOverview = 600; 
rightWallCanvas = 800;
upperWallCanvas = 0;
bottomWallOverview = 150;

function preload() { 
  img = loadImage('data/Campus100dpi.png'); //satellite
  imgBldgs = loadImage('data/Buildings100dpi.png'); //building shapes
  tblBldgs = loadTable('data/Building_Codes_updated.csv', 'csv', 'header');
}

function setup() {
  createCanvas(800, 450);
  imgW = img.width;
  imgH = img.height;
  imgBldgW = imgBldgs.width;
  imgBldgH = imgBldgs.height;
  
  //overview upper right photo parameters
  overX = 600;
  overY = 0;
  overW = (1/3) * imgW; //a third of the size of larger image
  overH = (1/3) * imgH; //a third of the size 

  //finder square
  findX = 0; //center
  findY = 0;
  findW = overW;
  findH = overH;
}

function draw() {
  background(0);
  
  bldgImg = image(img, imgX, imgY, imgBldgW, imgBldgH); //building map (added)
  mainImg = image(img, imgX, imgY, imgW, imgH); //larger image in main screen 
  
  overviewImg = image(img, overX, overY, overW, overH); //smaller image
  
  introScreen();
  finderRectangle();

  //draw the finder rectangle
  push();
  translate(overX, 0);
  noFill();
  stroke(255,204,0);
  strokeWeight(4); 
  // rectMode(RADIUS);
  finderRect = rect(findX, findY, findW, findH);
  pop(); 
  
  //need to refer these functions in draw as well to prevent any of the gaps from being seen
  originalSize();
  ifLargerImage();
  ifSmallImage();  
}

function finderRectangle() {
  //constrain the find rectangle before drawing!
  if (findX < 0){
    findX = 0; //constrains finder rectangle on the left side
  }
  if (findX + findW > 200){
    findX = 200 - findW; //constrains finder rectangle on the right side
  } 
  if (findY < 0){
    findY = 0; //constrains finder rectangle on the top side
  }
  if (findY + findH > 150){
    findY = 150 - findH; //constrains finder rectangle on the bottom side
  }
}

function introScreen() {
  rect(600,150,200,450);
  textSize(15);
  textFont('Helvetica');  
  text("Refillable Water Stations SDSU: Click and hover over any part of the map", 610, 160, 170, 170);
  text("Press 'R' to reset to original size, and just use your mouseWheel to zoom in and out.", 610, 220, 170, 170);
  textSize(20);
  textFont('Helvetica');
  text(name + " has " + order + " stations.", 605, 320, 200);
}

function getFeatureName(grayVal, tbl) {
  name = "";
  order = "";
  //iterate over entries in this table given
  for (var i=1; i<tbl.getRowCount(); i++){
    var code = tbl.get(i, "Pixel_Val");
    if(grayVal == code){
      name = tbl.get(i, "Name");
      order = tbl.get(i, "ORDER"); //replace with water data later
    }
  }
}

function mousePressed() {
  panFromX = mouseX;
  panFromY = mouseY;
  
  pixelX = imgBldgW * (mouseX - imgX) / imgW;
  pixelY = imgBldgH * (mouseY - imgY) / imgH;
  
  bldgCode =  red(imgBldgs.get(pixelX, pixelY));
  bldgName = getFeatureName(bldgCode, tblBldgs); //references building shapes and csv file   
}

function mouseDragged() {
  panToX = mouseX;
  panToY = mouseY;
  xShift = panToX - panFromX;
  yShift = panToY - panFromY;
  
  imgX = imgX + xShift;
  imgY = imgY + yShift;

  findX = findX - (xShift/3);
  findY = findY - (yShift/3);
  
  panFromX = panToX;
  panFromY = panToY;
  
  originalSize();
  ifLargerImage();
  ifSmallImage();  
}

function originalSize(){
  if ((imgW == rightWall) && (imgH == bottomWall) || (imgW < rightWall) || (imgH < bottomWall)) { 
      imgX = constrain(imgX, leftWall, rightWall - imgW);
      imgY = constrain(imgY, upperWall, bottomWall  - imgH);
    }
}  

function ifLargerImage() {
  originalFramex = rightWall - leftWall;
  originalFramey = bottomWall - upperWall;

  //make new conditions if image size is bigger than size of original screen
   if ((imgW > rightWall) || (imgH > bottomWall)) {
    imgX = constrain(imgX, -(imgW - originalFramex), -(imgW - originalFramex) + (imgW - rightWall));
    imgY = constrain(imgY, -(imgH - originalFramey), -(imgH - originalFramey) + (imgH - bottomWall));
   }
  //this constrains the enlarged image within the canvas if the borders of the image touch the borders of the canvas size
}

function ifSmallImage() {  
  // resets the photo to original size if user tries to make image smaller than screen size
  if ((imgW < rightWall) || (imgH < bottomWall)) {
    imgW = rightWall;
    imgH = bottomWall;
  } 
  //constrains the finder rectangle to prevent it from getting bigger than overview
  if ((findW > rightWallCanvas) || (findH > bottomWallOverview)){
    findW = 200;
    findH = 150;
  }
}

function keyPressed() { 
  //reset to original size by clicking a button
  if (key == "r"){
    imgWOld = imgW;
    imgHOld = imgH;
    
    imgW = rightWall;
    imgH = bottomWall;
    
    imgBldgW = rightWall;
    imgBldgH = bottomWall;
    
    findW = overW * findScale;
    findH = overH * findScale;
    finderRect = rect(findX, findY, findW, findH);
  }
}

function mouseWheel(event) {
  scaleFactor  = event.delta * -0.001;
  
  rectangleScaleFactor = event.delta * -(0.001 * (3/4));
  //delta is known to mouseWheel 
  
  imgWOld = imgW;
  imgHOld = imgH;
  findWOld = findW;
  findHOld = findH;
  
  imgW = int(imgW * (1 + scaleFactor));
  imgH = int(imgH * (1 + scaleFactor));
  
  imgX = mouseX - (((mouseX - imgX)/ imgWOld) * imgW);
  imgY = mouseY - (((mouseY - imgY)/ imgHOld) * imgH);
  
  findW = int(findW * (1 - rectangleScaleFactor));
  findH = int(findH * (1 - rectangleScaleFactor));
  
  //uses finder rectangle to locate where the mouse is located
  findX = mouseX/3 - ((mouseX/3 - findX) / findWOld) * findW;
  findY = mouseY/3 - ((mouseY/3 - findY) / findHOld) * findH;  
}

function windowResize() {
  resizeCanvas(windowWidth, windowHeight);
}
