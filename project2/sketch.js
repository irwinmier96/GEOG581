imgX = 0;
imgY = 0;
imgW = 0;
imgH = 0;

//give imgBldgs own variables attempt to map to img map
imgBldgX = 0;
imgBldgY = 0;
imgBldgW = 0;
imgBldgH = 0;

//Scale variables for rectangle in smaller left image
overviewScale = (1/3);
findScale = 1; // scales from full image to window size
let finderRect;

//pan variables
panFromX = 0;
panFromY = 0;
panToX = 0;
panToY = 0;

leftWall = 0; //boundary of left side of canvas
rightWall = 600; //boundary of right side of original image size
upperWall = 0; //boundary for upper side of canvas
bottomWall = 450; //boundary for bottom side of canvas

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
  
  imgCentX = img.width/2;
  imgCentY = img.height/2;
  
  //overview upper right photo parameters
  overX = 600;
  overY = 0;
  overW = overviewScale * imgW; //a third of the size of larger image
  overH = overviewScale * imgH; //a third of the size 

  //finder square
  findW = overW * findScale;
  findH = overH * findScale;
  
  findX = overW/2; //center
  findY = overH/2;
}

function draw() {
  background(0);
  
  imageMode(CENTER);
  mainImg = image(img, imgCentX, imgCentY, imgW, imgH); //larger image in main screen
  bldgImg = image(img, imgCentX, imgCentY, imgW, imgH); //building map (added)
 
  // mainImg = image(img, imgX, imgY, imgW, imgH); //larger image in main screen
  // bldgImg = image(img, imgX, imgY, imgW, imgH); //building map (added)
  
  imageMode(CORNER);
  overviewImg = image(img, overX, overY, overW, overH); //smaller image
  
  
  push();
  translate(overX, 0);
  noFill();
  stroke(255,204,0);
  strokeWeight(4);
  rectMode(RADIUS);
  finderRect = rect(findX, findY, findW/2, findH/2);
  pop();
  
  
  introScreen();
  originalSize();
  avoidGaps();
  
}

function introScreen() {
  rect1 = rect(600,150,200,450);
  //fill(115);
  textSize(15);
  textFont('Helvetica');  
  text("Refillable Water Stations SDSU: Click and hover over any part of the map", 610, 160, 170, 170);
  text("Press 'P' to zoom in, 'M' to zoom out, and 'R' to reset size", 610, 220, 170, 170);
  mousePressed(); //returns name of building if hovered over
  //keyPressed();  // will zoom in continuously if pressed
}

function getFeatureName(grayVal, tbl) {
  name = "";
  //iterate over entries in this table given
  for (var i=1; i<tbl.getRowCount(); i++){
    var code = tbl.get(i, "Pixel_Val");
    if(grayVal == code){
      name = tbl.get(i, "Name");
      //console.log(i, name);
      return name;
    }
  }
}

function mousePressed() {
  panFromX = mouseX;
  panFromY = mouseY;
  bldgCode = red(imgBldgs.get(mouseX, mouseY));
  bldgName = getFeatureName(bldgCode, tblBldgs); //references building shapes and csv file 
  //console.log(bldgName);
  textFont("Helvetica");
  textSize(20);
  returnName = text(bldgName, 610, 300, 150, 150);
  //mouseDragged();
  //keyPressed();
}

function mouseDragged() {
  panToX = mouseX;
  panToY = mouseY;
  xShift = panToX - panFromX;
  yShift = panToY - panFromY;
  imgX = imgX + xShift;
  imgY = imgY + yShift;
  
  //generalize the variables so that it can be used regardless of image size
  
  panFromX = panToX;
  panFromY = panToY;
  
//   originalFramex = rightWall - leftWall;
//   originalFramey = bottomWall - upperWall;  
  
  // Reference: https://jinlong25.wordpress.com/2014/02/01/map-zoom-and-pan-in-processing/
  // Constrain function needed since image mode is center
  if((imgCentX - imgW / 2 <= leftWall) 
     &&(imgCentX + imgW / 2 >= rightWall) 
     &&(imgCentY - imgH / 2 <= upperWall) 
     &&(imgCentY + imgH / 2 >= bottomWall)) {
    imgCentX = imgCentX + xShift;
    imgCentY = imgCentY + yShift;
    finderRect = rect(findX, findY, findW/2, findH/2);
    //finderRect = constrain(overX, rightWall, 800);
  }
  if(imgCentX - imgW / 2 > leftWall){
    imgCentX = imgW/2;
  }   
  if(imgCentX + imgW / 2 < rightWall){
    imgCentX = rightWall - imgW / 2;
  }   
  if(imgCentY - imgH / 2 > upperWall){
    imgCentY = imgH/2;
  }   
  if(imgCentY + imgH / 2 < bottomWall){
    imgCentY = bottomWall - imgH/2;   
  } 
 
  if(imgCentX - imgW / 2 < leftWall && imgCentX + imgW / 2 == rightWall){
    imgX = constrain(imgX, -(imgW + leftWall), rightWall);
  }
  
//   if((imgCentX - imgW / 2 > leftWall) || (imgCentX + imgW / 2 < rightWall) || (imgCentY - imgW / 2 > upperWall) || (imgCentY + imgH / 2 < bottomWall)){
//     pixelX = imgBldgW * (mouseX - imgX) / imgW;
//     pixelY = imgBldgH * (mouseY - imgY) / imgH;
    
//     bldgCode =  red(imgBldgs.get(pixelX, pixelY));
//     bldgName = getFeatureName(bldgCode, tblBldgs);
//     returnName = text(bldgName, 610, 330, 150, 150); 
//   } //not working for me
  
  
  findX = findX - (xShift/2 * findScale);
  findY = findY - (yShift/2 * findScale);
  
  originalSize();
  avoidGaps();
//  ifLargerImage();
}

function originalSize() {  
  //constrain original sized image in default position, keep so that theres no gap between blank space and image when it resets
  if ((imgW == rightWall) && (imgH == bottomWall) || (imgW < rightWall) || (imgH < bottomWall)) { 
//     imgX = constrain(imgCentX + imgW / 2, leftWall, rightWall - imgW);
//     imgY = constrain(imgCentY + imgH / 2, upperWall, bottomWall  - imgH);
    
    //keeps image at the original size if user tries to make image smaller than screen size
    imgW = rightWall;
    imgH = bottomWall;
    
    //constrain the rectangle
    overX = constrain(overX, rightWall, 800);
  }   
 
}


function avoidGaps() {
  if(imgCentX - imgW / 2 < leftWall && imgCentX + imgW / 2 == rightWall){
    imgX = constrain(imgCentX + imgW / 2, -(imgW + leftWall), -(imgW + leftWall) +  (imgW - rightWall));
  }
}

//function ifLargerImage() { 
  
  // if(imgCentX - imgW / 2 < leftWall && imgCentX + imgW / 2 == rightWall){
  //   imgX = constrain(imgX, -(imgW + leftWall), rightWall);
  // }
//   originalFramex = rightWall - leftWall;
//   originalFramey = bottomWall - upperWall;
  
//   //make new conditions if image size is bigger than size of original screen
//   if ((imgW > rightWall) || (imgH > bottomWall)) {
//     imgX = constrain(imgX, -(imgW - originalFramex), -(imgW - originalFramex) + (imgW - rightWall));
//     imgY = constrain(imgY, -(imgH - originalFramey), -(imgH - originalFramey) + (imgH - bottomWall));
//   } 
  
//}

function keyPressed() {
  
  // zoom in and zoom out of the main photo
  // try to match building names to zoomed in photo
  
  scaleFactor = 0.01
  rectangleScaleFactorW = (0.01 / 3);
  rectangleScaleFactorH = (0.01 / 3);
  
  pixelX = imgBldgW * (mouseX - imgX) / imgW;
  pixelY = imgBldgH * (mouseY - imgY) / imgH;
  
  //zoom in
  if (key == 'p'){
    imgW = int(imgW * (1 + scaleFactor));
    imgH = int(imgH * (1 + scaleFactor));
    
    findW = int(findW * (1 - rectangleScaleFactorW));
    findH = int(findH * (1 - rectangleScaleFactorH)); 
    
//     bldgW = int(imgBldgW * (1 + scaleFactor));
//     bldgH = int(imgBldgH * (1 + scaleFactor));
    
    bldgCode =  red(imgBldgs.get(pixelX, pixelY));
    bldgName = getFeatureName(bldgCode, tblBldgs);
    console.log(bldgName);
    returnName = text(bldgName, 610, 330, 150, 150);   
  }
  
  //zoom out
  if (key == 'm'){
    imgW = int(imgW * (1 - scaleFactor));
    imgH = int(imgH * (1 - scaleFactor));
    
    findW = int(findW * (1 + rectangleScaleFactorW));
    findH = int(findH * (1 + rectangleScaleFactorH));
    
    bldgCode =  red(imgBldgs.get(pixelX, pixelY));
    bldgName = getFeatureName(bldgCode, tblBldgs);
    console.log(bldgName);
    //returnName = text(bldgName, 610, 330, 150, 150);
 
  }
  
  //reset to original size by clicking a button
  if (key == "r"){
    imgW = rightWall;
    imgH = bottomWall;
    
    //finderRect = rect(findX, findY, findW/2, findH/2);
    findW = overW * findScale;
    findH = overH * findScale;
    finderRect = rect(findX, findY, findW/2, findH/2);
  }
}

function mouseWheel(event) {
  scaleFactor  = event.delta * -0.001;
  //delta is known to mouseWheel  
  imgW = int(imgW * (1 + scaleFactor));
  imgH = int(imgH * (1 + scaleFactor));
  
  findW = int(findW * (1 - scaleFactor));
  findH = int(findH * (1 - scaleFactor));
    
  mousePressed();
}

function windowResize() {
  resizeCanvas(windowWidth, windowHeight);
}

