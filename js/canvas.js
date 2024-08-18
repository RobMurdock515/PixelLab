/* =========================================================================================================================================== */
/*                                             Section 1: Draw Canvas Size/Checkerboard - Default Pixel (x/y)                                             */
/* =========================================================================================================================================== */

const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
const widthDisplay = document.getElementById('canvas-width');
const heightDisplay = document.getElementById('canvas-height');

// Set canvas dimensions and default cell size
canvas.width = 650; // Adjust canvas size as needed
canvas.height = 650;
let cellSize = 10; // Default size of each cell on the canvas

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
