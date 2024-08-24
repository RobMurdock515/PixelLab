

/* =========================================================================================================================================== */
/*                                Section 2: Overlay Grid - Hover/Xy Coordinates                                                               */
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
/*                                Section 4: Canvas - Draw Functionality                                                                       */
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
    } else if (tool === 'spray') {
        drawSprayPattern(row, col, parseInt(document.getElementById('pixel-size').value), parseFloat(document.getElementById('pixel-strength').value), 0); // Default angle to 0
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

// Function to draw spray pattern with varying density and fade-out effect
function drawSprayPattern(row, col, brushSize, pressure, angle) {
    const brushPattern = [];
    const radius = brushSize / 2;

    // Generate random positions with varying density
    for (let i = 0; i < Math.floor(brushSize * brushSize * pressure * 1.5); i++) {
        const randAngle = Math.random() * Math.PI * 2;
        const distance = Math.random() * radius;
        const dx = Math.cos(randAngle) * distance;
        const dy = Math.sin(randAngle) * distance;
        brushPattern.push([dx, dy]);
    }

    brushPattern.forEach(([dx, dy]) => {
        const x = col * cellSize + dx * cellSize * Math.cos(angle) - dy * cellSize * Math.sin(angle);
        const y = row * cellSize + dx * cellSize * Math.sin(angle) + dy * cellSize * Math.cos(angle);

        const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
        const alpha = pressure * (1 - distanceToCenter / radius) * 0.8; // Adjust alpha for fade-out

        ctx.globalAlpha = alpha;
        ctx.fillRect(x, y, cellSize, cellSize);
    });

    ctx.globalAlpha = 1; // Reset global alpha
}

// Mouse event listeners for drawing
overlayGrid.addEventListener('mousedown', (event) => {
    if (event.button === 0) { // Check if the left mouse button is clicked
        isDrawing = true;
        if (hoveredCell) {
            drawOnCanvas(hoveredCell.row, hoveredCell.col);
        }
    }
});

overlayGrid.addEventListener('mouseup', () => {
    isDrawing = false;
});

overlayGrid.addEventListener('mouseleave', () => {
    isDrawing = false;
});

















/* toolbar code */

/* =========================================================================================================================================== */
/*                                             Section 1: Activating/Selecting a Button                                                        */
/* =========================================================================================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const toolbarButtons = document.querySelectorAll('.toolbar-button');
    const selectedToolDisplay = document.getElementById('selected-tool');

    toolbarButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'selected' class from all buttons
            toolbarButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add 'selected' class to the clicked button
            button.classList.add('selected');
            
            // Update the selected tool display
            const tool = button.getAttribute('data-tool');
            selectedToolDisplay.textContent = tool.charAt(0).toUpperCase() + tool.slice(1);
        });
    });
});


/* =========================================================================================================================================== */
/*                                              Section 2: Pixel Size and Strength Settings                                                    */
/* =========================================================================================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const pixelSizeInput = document.getElementById('pixel-size');
    const pixelSizeValue = document.getElementById('pixel-size-value');
    const pixelStrengthInput = document.getElementById('pixel-strength');
    const pixelStrengthValue = document.getElementById('pixel-strength-value');

    pixelSizeInput.addEventListener('input', () => {
        pixelSizeValue.textContent = pixelSizeInput.value;
        // Update pixel size in your application
        cellSize = parseInt(pixelSizeInput.value, 1);
        updateOverlayGrid(); // Assuming you have a function to update the grid
    });

    pixelStrengthInput.addEventListener('input', () => {
        pixelStrengthValue.textContent = pixelStrengthInput.value;
        pixelStrength = parseFloat(pixelStrengthInput.value);
    });
});

/* =========================================================================================================================================== */
/*                                                Section 3: Pencil Tool                                                                       */
/* =========================================================================================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const pencilButton = document.querySelector('[data-tool="pencil"]');
    const pixelSizeInput = document.getElementById('pixel-size'); // Assuming this is your pixel size input

    // Set default pixel size for the pencil tool
    if (pencilButton) {
        pencilButton.addEventListener('click', () => {
            // Logic for selecting and using the pencil tool
            console.log('Pencil tool selected');

            // Set default pixel size to 1 cell
            pixelSizeInput.value = 1;
            document.getElementById('pixel-size-value').textContent = pixelSizeInput.value;
        });
    }
});

/* =========================================================================================================================================== */
/*                                                Section 3: Eraser Tool                                                                       */
/* =========================================================================================================================================== */

/* Skip Eraser Functionality for now */

/* =========================================================================================================================================== */
/*                                                Section 4: Brush Tool                                                                        */
/* =========================================================================================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const brushButton = document.querySelector('[data-tool="brush"]');
    const pixelSizeInput = document.getElementById('pixel-size'); // Assuming this is your pixel size input

    // Set default pixel size for the brush tool
    if (brushButton) {
        brushButton.addEventListener('click', () => {
            // Logic for selecting and using the brush tool
            console.log('Brush tool selected');

            // Set default pixel size for the brush tool
            pixelSizeInput.value = 24; // Example value
            document.getElementById('pixel-size-value').textContent = pixelSizeInput.value;
        });
    }
});

/* =========================================================================================================================================== */
/*                                                Section 5: Line Tool                                                                         */
/* =========================================================================================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const lineButton = document.querySelector('[data-tool="line"]');
    const pixelSizeInput = document.getElementById('pixel-size'); // Assuming this is your pixel size input

    // Set default pixel size for the line tool
    if (lineButton) {
        lineButton.addEventListener('click', () => {
            // Logic for selecting and using the line tool
            console.log('Line tool selected');

            // Set default pixel size for the line tool
            pixelSizeInput.value = 1;
            document.getElementById('pixel-size-value').textContent = pixelSizeInput.value;
        });
    }
});

/* =========================================================================================================================================== */
/*                                                Section 6: Spray Tool                                                                        */
/* =========================================================================================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const brushButton = document.querySelector('[data-tool="spray"]');
    const pixelSizeInput = document.getElementById('pixel-size'); // Assuming this is your pixel size input

    // Set default pixel size for the spray tool
    if (sprayButton) {
        sprayButton.addEventListener('click', () => {
            // Logic for selecting and using the spray tool
            console.log('Spray tool selected');

            // Set default pixel size for the spray tool
            pixelSizeInput.value = 24; // Example value
            document.getElementById('pixel-size-value').textContent = pixelSizeInput.value;
        });
    }
});