/* =========================================================================================================================================== */
/*                                             Draw Canvas Size/Checkerboard - Default Pixel (x/y)                                             */
/* =========================================================================================================================================== */

const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions and cell size
canvas.width = 640; // Adjust canvas size as needed
canvas.height = 640;
const cellSize = 10;

// Function to draw a checkerboard pattern
function drawCheckerboard() {
  for (let x = 0; x < canvas.width / cellSize; x++) {
    for (let y = 0; y < canvas.height / cellSize; y++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? 'rgba(255, 255, 255, 0.125)' : 'transparent';
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

// Draw the initial checkerboard
drawCheckerboard();

/* =========================================================================================================================================== */
/*                                                         Overlay Grid - Hover                                                                */
/* =========================================================================================================================================== */

const overlayGrid = document.querySelector('.overlay-grid');

// Create overlay grid cells
for (let i = 0; i < 64 * 64; i++) {
  const cell = document.createElement('div');
  cell.classList.add('grid-cell'); // Ensure you have this class in your CSS for sizing and positioning
  cell.dataset.row = Math.floor(i / 64);
  cell.dataset.col = i % 64;
  overlayGrid.appendChild(cell);
}

// Hover effect and canvas interaction
let hoveredCell = null;
let isDrawing = false;

// Highlight on hover
overlayGrid.addEventListener('mouseover', (event) => {
  const cell = event.target;
  const row = cell.dataset.row;
  const col = cell.dataset.col;
  hoveredCell = { row, col };

  if (hoveredCell && isDrawing) {
    drawOnCanvas(row, col);
  }
});

// Start drawing on mousedown
overlayGrid.addEventListener('mousedown', () => {
  isDrawing = true;
  if (hoveredCell) {
    drawOnCanvas(hoveredCell.row, hoveredCell.col);
  }
});

// Stop drawing on mouseup
document.addEventListener('mouseup', () => {
  isDrawing = false;
});

// Function to draw on the canvas
function drawOnCanvas(row, col) {
  if (ctx) {
    ctx.fillStyle = getCurrentColor(); // Function to get the current color from the .color-indicator
    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
  }
}
