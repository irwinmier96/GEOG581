imgX = 0;
imgY = 0;
imgW = 0;
imgH = 0;

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
}

function draw() {
  background(0);
  mainImg = image(img, imgX, imgY, imgW, imgH); //larger image in main screen
  bldgImg = image(img, imgX, imgY, imgW, imgH); //building map (added)
  overviewImg = image(img, 600, 0, 200, (200 * img.height) / img.width); //smaller image
  
  introScreen();
  ifSmallImage();
  ifLargerImage();
  originalSize();
}

function introScreen() {
  rect1 = rect(600,120,200,450);
  //fill(115);
  textSize(15);
  textFont('Helvetica');  
  text("Refillable Water Stations SDSU: Click and hover over any part of the map", 610, 140, 170, 170);
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
      // text(name, 610, 300, 150, 150);
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

  let xm = mouseX;
  
  pamFromX = panToX;
  panFromY = panToY;
  
  originalSize();
  ifLargerImage();
}

function originalSize() {  
  //constrain original sized image in default position, keep so that theres no gap between blank space and image when it resets
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
}

function ifSmallImage() {  
  // resets the photo to original size if user tries to make image smaller than screen size
  if ((imgW < rightWall) || (imgH < bottomWall)) {
    imgW = rightWall;
    imgH = bottomWall;
  }  
}

function keyPressed() {
  
  // zoom in and zoom out of the main photo
  // try to match building names to zoomed in photo
  
  scaleFactor = 0.01;
  
  //zoom in
  if (key == 'p'){
    imgW = int(imgW * (1 + scaleFactor));
    imgH = int(imgH * (1 + scaleFactor));
    //imgX = constrain(imgX, -leftWall * (1 + scaleFactor), -rightWall * (1 + scaleFactor));
  }
  
  //zoom out
  if (key == 'm'){
    imgW = int(imgW * (1 - scaleFactor));
    imgH = int(imgH * (1 - scaleFactor));
  }
  
  //reset to original size by clicking a button
  if (key == "r"){
    imgW = rightWall;
    imgH = bottomWall;
  }
}

function mouseWheel(event) {
  scaleFactor  = event.delta * 0.001;
  //delta is known to mouseWheel  
  imgW = int(imgW * (1 + scaleFactor));
  imgH = int(imgH * (1 + scaleFactor));
  mousePressed();
}

function windowResize() {
  resizeCanvas(windowWidth, windowHeight);
}
