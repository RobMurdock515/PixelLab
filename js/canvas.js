/* =========================================================================================================================================== */
/*                                             Draw Canvas Size/Checkerboard - Default Pixel (x/y)                                             */
/* =========================================================================================================================================== */

const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions and cell size
canvas.width = 640; // Adjust canvas size as needed
canvas.height = 640;
const cellSize = 10;

// Function to draw a single cell with customizable color
function drawCell(x, y, color) {
  ctx.fillStyle = color; // Set the fill style (color)
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

// Function to draw a checkerboard pattern
function drawCheckerboard() {
  for (let x = 0; x < canvas.width / cellSize; x++) {
    for (let y = 0; y < canvas.height / cellSize; y++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? 'rgba(255, 255, 255, 0.125)' : 'transparent';
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

// Function to draw the entire grid with a specified color
function drawGrid(color) {
  for (let x = 0; x < 64; x++) {
    for (let y = 0; y < 64; y++) {
      drawCell(x, y, color);
    }
  }
}

// Function to highlight a single cell on canvas
let highlightedCell = null;

function highlightCell(row, col) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear entire canvas
  drawCheckerboard(); // Redraw checkerboard

  ctx.fillStyle = 'red'; // Change color as desired
  ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
  highlightedCell = { row, col };
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
  overlayGrid.appendChild(cell);
}

// Hover effect and canvas interaction
let hoveredCell = null;

// Highlight on hover
overlayGrid.addEventListener('mouseover', (event) => { 
  const cell = event.target;
  const row = cell.dataset.row;
  const col = cell.dataset.col;
  hoveredCell = { row, col };
  if (hoveredCell) {
    highlightCell(row, col);
  }
});

// Remove hober on mouse leave
overlayGrid.addEventListener('mouseout', () => {
  hoveredCell = null;
  if (highlightedCell) {
    ctx.clearRect(highlightedCell.col * cellSize, highlightedCell.row * cellSize, cellSize, cellSize);
    highlightedCell = null;
  }
});
