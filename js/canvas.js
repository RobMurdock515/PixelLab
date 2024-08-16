/* =========================================================================================================================================== */
/*                                             Draw Canvas Size/Checkerboard - Default Pixel (x/y)                                             */
/* =========================================================================================================================================== */

const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
const widthDisplay = document.getElementById('canvas-width');
const heightDisplay = document.getElementById('canvas-height');

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

// Function to update canvas dimensions display
function updateCanvasDimensions() {
  widthDisplay.textContent = canvas.width;
  heightDisplay.textContent = canvas.height;
}

// Initial update of dimensions display
updateCanvasDimensions();

/* =========================================================================================================================================== */
/*                                                Overlay Grid - Hover/Xy Coordinates                                                          */
/* =========================================================================================================================================== */

const overlayGrid = document.querySelector('.overlay-grid');
const xDisplay = document.getElementById('x-coordinate');
const yDisplay = document.getElementById('y-coordinate');

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

// Highlight on hover and update coordinates
overlayGrid.addEventListener('mousemove', (event) => {
  const cell = event.target;
  if (cell.classList.contains('grid-cell')) { // Ensure it's a grid cell
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    hoveredCell = { row, col };

    xDisplay.textContent = col;
    yDisplay.textContent = row;
    
    if (isDrawing) {
      drawOnCanvas(row, col);
    }
  }
});

/* =========================================================================================================================================== */
/*                                                   Canvas/Cell - Draw Function                                                               */
/* =========================================================================================================================================== */

