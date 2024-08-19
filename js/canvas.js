/* =========================================================================================================================================== */
/*                                             Section 1: Draw Canvas Size/Checkerboard - Default Pixel (x/y)                                             */
/* =========================================================================================================================================== */

const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
const widthDisplay = document.getElementById('canvas-width');
const heightDisplay = document.getElementById('canvas-height');

const canvasWidth = 650;
const canvasHeight = 650;

let cellSize = 10; // Default cell size
let cellsPerRow = 64; // Default number of cells per row and column

function drawCheckerboard(canvas, ctx, cellSize) {
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

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
  drawCheckerboard(canvas, ctx, cellSize);
}

// Initial setup
resizeCanvas(64); // Default grid size
updateCanvasDimensions();

// Expose the resizeCanvas function to other scripts
window.resizeCanvas = resizeCanvas;
