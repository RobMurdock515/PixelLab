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


drawCheckerboard(); // Draw a checkerboard pattern
