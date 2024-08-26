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

/* =========================================================================================================================================== */
/*                                            Section 1: Overlay Grid + X/Y Coordinates                                                        */
/* =========================================================================================================================================== */

// Function to update the coordinate display
function updateCoordinateDisplay(x, y) {
  const xCoord = document.getElementById('x-coordinate');
  const yCoord = document.getElementById('y-coordinate');

  // Update the display text with the cell's coordinates, starting from 1 instead of 0
  xCoord.textContent = x + 1;
  yCoord.textContent = y + 1;
}

// Function to create the overlay grid
function createOverlayGrid(cellSize) {
  const overlayGrid = document.querySelector('.overlay-grid');

  // Clear existing grid
  overlayGrid.innerHTML = '';

  // Set the grid dimensions to match the canvas
  overlayGrid.style.width = `${canvasWidth}px`;
  overlayGrid.style.height = `${canvasHeight}px`;

  // Calculate the number of cells based on the canvas size and cell size
  const rows = Math.ceil(canvasHeight / cellSize); // Use Math.ceil to ensure full coverage
  const cols = Math.ceil(canvasWidth / cellSize); // Use Math.ceil to ensure full coverage

  // Create grid cells
  for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
          const cell = document.createElement('div');
          cell.classList.add('grid-cell');
          cell.style.width = `${cellSize}px`;
          cell.style.height = `${cellSize}px`;
          cell.style.position = 'absolute';
          cell.style.top = `${row * cellSize}px`;
          cell.style.left = `${col * cellSize}px`;

          // Optional: Add hover effect to cells if needed
          cell.addEventListener('mouseenter', function () {
              this.style.backgroundColor = 'rgba(255, 255, 255, 0.411)'; // Change color on hover
              updateCoordinateDisplay(col, row); // Update coordinates on hover, starting from 1
          });

          cell.addEventListener('mouseleave', function () {
              this.style.backgroundColor = 'transparent'; // Reset color when not hovering
          });

          overlayGrid.appendChild(cell);
      }
  }
}

// Function to update the overlay grid whenever the canvas is resized or cell size changes
function updateOverlayGrid() {
  createOverlayGrid(cellSize);
}

// Update the overlay grid whenever the canvas is resized
window.addEventListener('resize', updateOverlayGrid);
window.addEventListener('orientationchange', updateOverlayGrid);

// Call updateOverlayGrid within resizeCanvas function to adapt to changes
function resizeCanvas(newCellsPerRow) {
  cellsPerRow = newCellsPerRow;
  cellSize = canvasWidth / cellsPerRow; // Adjust cell size based on the new number of cells

  // Adjust canvas dimensions to fit exact rows/cols
  canvasHeight = Math.ceil(canvasHeight / cellSize) * cellSize;
  canvasWidth = Math.ceil(canvasWidth / cellSize) * cellSize;

  drawCheckerboard(canvas, ctx, cellSize);
  updateOverlayGrid(); // Update overlay grid whenever canvas is resized
}

function setCanvasSize(width, height) {
  canvasWidth = width;
  canvasHeight = height;
  drawCheckerboard(canvas, ctx, cellSize);
  updateOverlayGrid(); // Update overlay grid whenever canvas size changes
  updateCanvasDimensions();
}



/* =========================================================================================================================================== */
/*                                            Section 2: Canvas - Draw Functionality                                                           */
/* =========================================================================================================================================== */

