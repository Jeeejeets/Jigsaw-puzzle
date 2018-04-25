const NUMBER_OF_PIECES_HORIZONTAL  = 10;
const NUMBER_OF_PIECES_VERTICAL    = 6;
const PUZZLE_HOVER_TINT            = '#E93D8F';
const PUZZLE_TIMEOUT               = 180;           //Time in seconds

//Declare variables
var canvas;
var stage;
var img;
var guideCanvas;
var guideStage;
var pieces;
var grid;
var puzzleWidth;
var puzzleHeight;
var pieceWidth;
var pieceHeight;
var currentPiece;
var currentDropPiece;
var mouse;
var horizontalBeginning;
var verticalBeginning;

//Declare game preparing functions
function init(){
  img = new Image();
  img.addEventListener('load', onImage, false);
  img.src = "cat.jpg";
}

function onImage(e) {
  pieceWidth = Math.floor(img.width  / NUMBER_OF_PIECES_HORIZONTAL);
  pieceHeight = Math.floor(img.height / NUMBER_OF_PIECES_VERTICAL);
  puzzleWidth = pieceWidth * NUMBER_OF_PIECES_HORIZONTAL;
  puzzleHeight = pieceHeight * NUMBER_OF_PIECES_VERTICAL;
  setCanvas();
  initPuzzle();
}

function setCanvas() {
  //set main puzzle canvas
  canvas = document.getElementById('ukladanka');
  stage  = canvas.getContext('2d');
  var parentWidth = canvas.parentElement.clientWidth;
  var parentHeight = canvas.parentElement.clientHeight;
  canvas.width = parentWidth;
  canvas.height = parentHeight;
  canvas.style.border = "1px solid black";
  horizontalBeginning = canvas.width / 2 - puzzleWidth / 2;
  verticalBeginning = canvas.height /2 - puzzleHeight /2;

  //set guide image canvas
  guideImage = document.getElementById('guideImage');
  guideStage  = guideImage.getContext('2d');
  guideImage.width = parentWidth;
  guideImage.height = parentHeight;
}



function initPuzzle() {
  pieces = [];
  grid = [];
  mouse = {x:0, y:0};
  currentPiece = null;
  currentDropPiece = null;
  stage.drawImage(img, 0, 0, puzzleWidth, puzzleHeight, horizontalBeginning, verticalBeginning, puzzleWidth, puzzleHeight);
  createTitle('Click to start the puzzle');
  buildPieces();
}

function createTitle(message) {

}

function buildPieces() {
  var i;
  var piece;
  var gridPiece;
  var xPos = 0;
  var yPos = 0;
  for(i = 0; i < NUMBER_OF_PIECES_HORIZONTAL * NUMBER_OF_PIECES_VERTICAL; i++){
    piece = {};
    gridPiece = {};
    piece.sx = xPos;
    piece.sy = yPos;
    pieces.push(piece);

    gridPiece.xPos = xPos + horizontalBeginning -1;
    gridPiece.yPos = yPos + verticalBeginning -1;
    grid.push(gridPiece);
    xPos += pieceWidth;
    if(xPos >= puzzleWidth){
      xPos = 0;
      yPos += pieceHeight;
    }
  }
  document.onmousedown = shufflePuzzle;
}

//declare game mechanics functions

function shufflePuzzle() {
  stage.clearRect(0, 0, canvas.width, canvas.height);
  var i;
  var piece;
  var gridPiece;
  for(i = 0;i < pieces.length;i++){
    piece = pieces[i];
    gridPiece = grid[i];
    var yPos = Math.floor(Math.random() * (canvas.height - pieceHeight));
    var xPos = Math.floor(Math.random() * (horizontalBeginning - pieceWidth)) + Math.floor(Math.random() * 2 ) * (horizontalBeginning + puzzleWidth);
    piece.xPos = xPos;
    piece.yPos = yPos;
    // stage.strokeRect(gridPiece.xPos, gridPiece.yPos, pieceWidth, pieceHeight);
    stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, xPos, yPos, pieceWidth, pieceHeight);
    // stage.strokeRect(xPos, yPos, pieceWidth,pieceHeight);
  }
  // startTheClock(PUZZLE_TIMEOUT);
  document.onmousedown = onPuzzleClick;
  drawGuideImage();
}

function drawGuideImage() {
  guideStage.globalAlpha = 0.2;
  guideStage.drawImage(img, 0, 0, puzzleWidth, puzzleHeight, horizontalBeginning, verticalBeginning, puzzleWidth, puzzleHeight);
}

function onPuzzleClick(e) {

    //takes cursor position
    if(e.layerX || e.layerX == 0){
      mouse.x = e.layerX - canvas.offsetLeft;
      mouse.y = e.layerY - canvas.offsetTop;
    } else if (e.offsetX || e.offsetX == 0){
      mouse.x = e.offsetX - canvas.offsetLeft;
      mouse.y = e.offsetY - canvas.offsetTop;
    }

    currentPiece = checkPieceClicked();
    if(currentPiece != null){
      stage.clearRect(currentPiece.xPos, currentPiece.yPos, pieceWidth, pieceHeight);
      stage.save();
      stage.globalAlpha = .9;
      stage.drawImage(img, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
      stage.restore();
      document.onmousemove = updatePuzzle;
      document.onmouseup = pieceDropped;
    }
}

function checkPieceClicked(){
  var i;
  var piece;
  for(i = 0; i< pieces.length; i++){
    piece = pieces[i];
    if(mouse.x < piece.xPos || mouse.x > (piece.xPos + pieceWidth) || mouse.y < piece.yPos || mouse.y > (piece.yPos + pieceHeight)){
        //not hit
    } else {
      return piece;
    }
  }
  return null;
}

function updatePuzzle(e) {

  //określanie pozycji kursora
  currentDropPiece = null;
  if(e.layerX || e.layerX == 0){
    mouse.x = e.layerX - canvas.offsetLeft;
    mouse.y = e.layerY - canvas.offsetTop;
  } else if (e.offsetX || e.offsetX == 0){
    mouse.x = e.offsetX - canvas.offsetLeft;
    mouse.y = e.offsetY - canvas.offsetTop;
  }

  //Podsiwetlanie kafelka, rysowanie kafelków nieprzeciąganych od nowa
  stage.clearRect(0, 0, canvas.width, canvas.height);
  var i;
  var piece;
  for(i = 0; i < pieces.length; i++){
    piece = pieces[i];
    gridPiece = grid[i];
    if(piece == currentPiece){
      continue;
    }
    stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos, pieceWidth, pieceHeight);
    stage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
    stage.strokeRect(gridPiece.xPos, gridPiece.yPos, pieceWidth, pieceHeight);
    console.log("mysz-x: " + mouse.x + " " + "mysz-y: " +mouse.y);
    if(currentDropPiece == null){
      if((mouse.x > gridPiece.xPos && mouse.x < (gridPiece.xPos + pieceWidth)) && (mouse.y > gridPiece.yPos && mouse.y < (gridPiece.yPos + pieceHeight))){
        console.log('grid');
        currentDropPiece = gridPiece;
        stage.save();
        stage.globalAlpha = .4;
        stage.fillStyle = PUZZLE_HOVER_TINT;
        stage.fillRect(currentDropPiece.xPos, currentDropPiece.yPos, pieceWidth, pieceHeight);
        stage.restore();

      } else if((mouse.x > piece.xPos && mouse.x < (piece.xPos + pieceWidth)) && (mouse.y > piece.yPos && mouse.y < (piece.yPos + pieceHeight))){
        console.log('piece');
        currentDropPiece = piece;
        stage.save();
        stage.globalAlpha = .4;
        stage.fillStyle = PUZZLE_HOVER_TINT;
        stage.fillRect(currentDropPiece.xPos, currentDropPiece.yPos, pieceWidth, pieceHeight);
        stage.restore();
      } else {
        console.log('nit');
      }
    }
  }

  //rysowanie kafelka przeciąganego
  stage.save();
  stage.globalAlpha = .6;
  stage.drawImage(img, currentPiece.sx, currentPiece.sy, pieceWidth, pieceHeight, mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
  stage.restore();
  stage.strokeRect(mouse.x - (pieceWidth / 2), mouse.y - (pieceHeight / 2), pieceWidth, pieceHeight);
}

function pieceDropped(e) {
  document.onmousemove = null;
  document.onmouseup = null;
  if(currentDropPiece != null){
    var tmp = {xPos: currentPiece.xPos, yPos: currentPiece.yPos};
    currentPiece.xPos = currentDropPiece.xPos;
    currentPiece.yPos = currentDropPiece.yPos;
    currentDropPiece.xPos = tmp.xPos;
    currentDropPiece.yPos = tmp.yPos;
  } else {
    currentPiece.xPos = mouse.x - pieceWidth /2;
    currentPiece.yPos = mouse.y - pieceHeight/2;
  }
  resetPuzzleAndCheckWin();
}

function resetPuzzleAndCheckWin() {
  stage.clearRect(0, 0, canvas.width, canvas.height);
  var gameWin = true;
  var i;
  var piece;
  for(i = 0; i < pieces.length; i++){
    piece = pieces[i];
    gridPiece = grid[i];
    stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, piece.xPos, piece.yPos ,pieceWidth, pieceHeight);
    // stage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
    // stage.strokeRect(gridPiece.xPos, gridPiece.yPos, pieceWidth, pieceHeight);
    if(piece.xPos != piece.sx || piece.yPos != piece.sy){
      gameWin = false;
    }
  }
  if(gameWin){
    alert('wygrana');
  }
}
