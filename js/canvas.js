/* =========================================================================================================================================== */
/*                                            Section 0: Draw Canvas Size/Checkerboard - Default Pixel (x/y)                                   */
/* =========================================================================================================================================== */

const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
const widthDisplay = document.getElementById('canvas-width');
const heightDisplay = document.getElementById('canvas-height');

let canvasWidth = 640; // Default width
let canvasHeight = 640; // Default height

let cellSize = 1; // Default cell size
let cellsPerRow = 64; // Default number of cells per row and column

function drawCheckerboard(canvas, ctx, cellSize) {
  // Update the canvas size
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Clear the canvas before redrawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the checkerboard pattern
  for (let x = 0; x < canvas.width / cellSize; x++) {
    for (let y = 0; y < canvas.height / cellSize; y++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? 'rgba(255, 255, 255, 0.125)' : 'transparent';
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

function updateCanvasDimensions() {
  widthDisplay.textContent = canvasWidth;
  heightDisplay.textContent = canvasHeight;
}

function resizeCanvas(newCellsPerRow) {
  cellsPerRow = newCellsPerRow;
  cellSize = canvasWidth / cellsPerRow; // Adjust cell size based on the new number of cells

  // Ensure the number of rows and columns are integers
  const rows = Math.floor(canvasHeight / cellSize);
  const cols = Math.floor(canvasWidth / cellSize);
  
  // If needed, adjust canvas dimensions to fit exact rows/cols
  canvasHeight = rows * cellSize;
  canvasWidth = cols * cellSize;

  drawCheckerboard(canvas, ctx, cellSize);
}


function setCanvasSize(width, height) {
  canvasWidth = width;
  canvasHeight = height;
  drawCheckerboard(canvas, ctx, cellSize);
  updateCanvasDimensions();
}

if (selectedOrientation === 'portrait') {
  setCanvasSize(640, 640);
} else if (selectedOrientation === 'landscape') {
  setCanvasSize(1080, 720); // Adjust dimensions as needed
}

// Initial setup
resizeCanvas(64); // Default grid size
updateCanvasDimensions();

// Expose functions to other scripts
window.setCanvasSize = setCanvasSize;
window.resizeCanvas = resizeCanvas;