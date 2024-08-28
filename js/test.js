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