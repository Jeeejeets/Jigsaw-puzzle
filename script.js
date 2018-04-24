const NUMBER_OF_PIECES_HORIZONTAL  = 6;
const NUMBER_OF_PIECES_VERTICAL  = 4;
const PUZZLE_HOVER_TINT = '#009900';
const PUZZLE_TIMEOUT    = 180;           //Time in seconds

//Declare variables
var canvas;
var stage;
var img;
var pieces;
var puzzleWidth;
var puzzleHeight;
var pieceWidth;
var pieceHeight;
var currentPiece;
var currentDropPiece;
var mouse;

//Declare game preparing functions
function init(){
  img = new Image();
  img.addEventListener('load', onImage, false);
  img.src = "cat.jpg";
}

function onImage(e) {
  pieceWidth = Math.floor(img.width / NUMBER_OF_PIECES_HORIZONTAL);
  pieceHeight = Math.floor(img.height / NUMBER_OF_PIECES_VERTICAL);
  puzzleWidth = pieceWidth * NUMBER_OF_PIECES_HORIZONTAL;
  puzzleHeight = pieceHeight * NUMBER_OF_PIECES_VERTICAL;
  setCanvas();
  initPuzzle();
}

function setCanvas() {
  canvas = document.getElementById('ukladanka');
  stage  = canvas.getContext('2d');
  canvas.width = puzzleWidth;
  canvas.height = puzzleHeight;
  canvas.style.border = "1px solid black";
}

function initPuzzle() {
  pieces = [];
  mouse = {x:0, y:0};
  currentPiece = null;
  currentDropPiece = null;
  stage.drawImage(img, 0, 0, puzzleWidth, puzzleHeight, 0, 0, puzzleWidth, puzzleHeight);
  createTitle('Click to start the puzzle');
  buildPieces();
}

function createTitle(message) {
  stage.fillStyle = "black";
  stage.globalAlpha = .4;
  stage.fillRect(100, puzzleHeight - 40, puzzleWidth - 200, 40);
  stage.fillStyle = "white";
  stage.globalAlpha = 1;
  stage.textAlign = "center";
  stage.textBaseline = "middle";
  stage.font = "20px Arial";
  stage.fillText(message, puzzleWidth / 2, puzzleHeight - 20);
}

function buildPieces() {
  var i;
  var piece;
  var xPos = 0;
  var yPos = 0;
  for(i = 0; i < NUMBER_OF_PIECES_HORIZONTAL * NUMBER_OF_PIECES_VERTICAL; i++){
    piece = {};
    piece.sx = xPos;
    piece.sy = yPos;
    pieces.push(piece);
    xPos += pieceWidth;
    if(xPos >= puzzleWidth){
      xPos = 0;
      yPos += pieceHeight;
    }
  }
  shufflePuzzle();
}

//declare game mechanics functions

function shufflePuzzle() {
  pieces = shuffleArray(pieces);
  stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
  var i;
  var piece;
  var xPos = 0;
  var yPos = 0;
  for(i = 0;i < pieces.length;i++){
    piece = pieces[i];
    piece.xPos = xPos;
    piece.yPos = yPos;
    stage.drawImage(img, piece.sx, piece.sy, pieceWidth, pieceHeight, xPos, yPos, pieceWidth, pieceHeight);
    stage.strokeRect(xPos, yPos, pieceWidth,pieceHeight);
    xPos += pieceWidth;
    if(xPos >= puzzleWidth){
        xPos = 0;
        yPos += pieceHeight;
      }
  }
  // document.onmousedown = onPuzzleClick;
}

function shuffleArray(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}
