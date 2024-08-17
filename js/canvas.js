/* =========================================================================================================================================== */
/*                                             Draw Canvas Size/Checkerboard - Default Pixel (x/y)                                             */
/* =========================================================================================================================================== */

const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
const widthDisplay = document.getElementById('canvas-width');
const heightDisplay = document.getElementById('canvas-height');

// Set canvas dimensions and cell size
canvas.width = 650; // Adjust canvas size as needed
canvas.height = 650;
let cellSize = 10; // Size of each cell on the canvas

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
/*                                Overlay Grid - Hover/Xy Coordinates                                                                                                 */
/* =========================================================================================================================================== */

const overlayGrid = document.querySelector('.overlay-grid');
const xDisplay = document.getElementById('x-coordinate');
const yDisplay = document.getElementById('y-coordinate');

const gridCellSize = cellSize + 10; // Increase the overlay grid cell size slightly

// Dynamically set grid dimensions and styling to match canvas
overlayGrid.style.width = `${canvas.width}px`;
overlayGrid.style.height = `${canvas.height}px`;
overlayGrid.style.display = 'grid';
overlayGrid.style.gridTemplateColumns = `repeat(${canvas.width / cellSize}, ${gridCellSize}px)`;
overlayGrid.style.gridTemplateRows = `repeat(${canvas.height / cellSize}, ${gridCellSize}px)`;

// Create overlay grid cells
for (let i = 0; i < (canvas.width / cellSize) * (canvas.height / cellSize); i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-cell');
    cell.style.border = '1px solid transparent'; // Set default cell border
    cell.style.width = `${gridCellSize}px`; // Set width
    cell.style.height = `${gridCellSize}px`; // Set height
    cell.dataset.row = Math.floor(i / (canvas.width / cellSize));
    cell.dataset.col = i % (canvas.width / cellSize);
    overlayGrid.appendChild(cell);
}

// Hover effect and canvas interaction
let hoveredCell = null;
let isDrawing = false;

// Highlight on hover and update coordinates
overlayGrid.addEventListener('mousemove', (event) => {
    const cell = event.target;
    if (cell.classList.contains('grid-cell')) {
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
/*                                Canvas - Draw Functionality                                                                                  */
/* =========================================================================================================================================== */

const toolDisplay = document.getElementById('selected-tool'); // Display for the selected tool
const colorIndicator = document.querySelector('.color-indicator'); // Color indicator element

// Function to get the current tool from the display
function getCurrentTool() {
    return toolDisplay.textContent.toLowerCase();
}

// Function to get the current color from the color-indicator class
function getCurrentColor() {
    return colorIndicator.style.backgroundColor || 'rgba(0, 0, 0, 0)'; 
}

// Function to draw on the canvas
function drawOnCanvas(row, col) {
    const tool = getCurrentTool();
    const color = getCurrentColor();
    
    // Prevent drawing with transparent color
    if (color === 'rgba(0, 0, 0, 0)' || color === '') {
        return; // No drawing action if color is transparent
    }
    
    ctx.fillStyle = color;
    
    // Draw based on the selected tool
    if (tool === 'pencil') {
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    } else if (tool === 'brush') {
        drawBrushPattern(row, col);
    }
}

// Function to draw brush pattern with a more refined organic look
function drawBrushPattern(row, col) {
    const brushPattern = [
        // Central core (very dense)
        [0, 0], [1, 0], [-1, 0], [0, 1], [0, -1],
        [1, 1], [-1, -1], [1, -1], [-1, 1],
        [2, 0], [-2, 0], [0, 2], [0, -2],
        [2, 1], [-2, -1], [1, 2], [-1, -2],
        [2, 2], [-2, -2], [2, -2], [-2, 2],

        // Intermediate scattering (medium dense)
        [3, 0], [-3, 0], [0, 3], [0, -3],
        [3, 1], [-3, -1], [1, 3], [-1, -3],
        [3, 2], [-3, -2], [2, 3], [-2, -3],

        // Outer scattering (low density)
        [4, 0], [-4, 0], [0, 4], [0, -4],
        [4, 1], [-4, -1], [1, 4], [-1, -4],
        [4, 2], [-4, -2], [2, 4], [-2, -4],
        [4, 3], [-4, -3], [3, 4], [-3, -4],
    ];

    brushPattern.forEach(([dx, dy], index) => {
        const x = col * cellSize + dx * cellSize;
        const y = row * cellSize + dy * cellSize;

        if (index < 9) {
            // Central core: almost always filled
            ctx.fillRect(x, y, cellSize, cellSize);
        } else if (index < 17) {
            // Intermediate scattering: moderate chance of filling
            if (Math.random() < 0.7) ctx.fillRect(x, y, cellSize, cellSize);
        } else {
            // Outer scattering: lower chance of filling
            if (Math.random() < 0.4) ctx.fillRect(x, y, cellSize, cellSize);
        }
    });
}



// Mouse event listeners for drawing
overlayGrid.addEventListener('mousedown', () => {
    isDrawing = true;
});

overlayGrid.addEventListener('mouseup', () => {
    isDrawing = false;
});

overlayGrid.addEventListener('mouseleave', () => {
    isDrawing = false;
});
