    /* =========================================================================================================================================== */
    /*                                            Section 0: Canvas Setup and Initialization                                                       */
    /* =========================================================================================================================================== */

window.onload = function() {
    const checkerboardCanvas = document.getElementById('checkerboardCanvas');
    const checkerboardContext = checkerboardCanvas.getContext('2d');
    const drawCanvas = document.getElementById('drawCanvas');
    const drawContext = drawCanvas.getContext('2d');
    const hoverCanvas = document.getElementById('hoverCanvas');
    const hoverContext = hoverCanvas.getContext('2d');
    
    const defaultPortraitWidth = 640; // Default width for portrait
    const defaultPortraitHeight = 640; // Default height for portrait
    const defaultLandscapeWidth = 1080; // Default width for landscape
    const defaultLandscapeHeight = 720; // Default height for landscape
    
    let numCells = 64; // Default number of cells per row/column (64x64)
    let cellSize = defaultPortraitWidth / numCells; // Initial cell size based on portrait orientation
    let width = defaultPortraitWidth;
    let height = defaultPortraitHeight;
    let selectedOrientation = 'portrait'; // Default orientation is portrait

    let pixelSize = 1; // Default pixel size value (1x1 cells)
    let selectedTool = 'none'; // Variable to keep track of the selected tool
    let isDrawing = false; // Flag to indicate if drawing is in progress
    let opacity = 1; // Default opacity value (100%)

    let lineStartX = null; // Start X coordinate for line tool
    let lineStartY = null; // Start Y coordinate for line tool
    
    /* =========================================================================================================================================== */
    /*                                            Section 1: Checkerboard Canvas Layer - Generates Default Cells (x/y)                             */
    /* =========================================================================================================================================== */
    
    function drawCheckerboard() {
        checkerboardCanvas.width = width;
        checkerboardCanvas.height = height;
    
        drawCanvas.width = width;
        drawCanvas.height = height;
        hoverCanvas.width = width;
        hoverCanvas.height = height;
    
        for (let row = 0; row < numCells; row++) {
            for (let col = 0; col < numCells; col++) {
                const isBlack = (row + col) % 2 === 0;
                checkerboardContext.fillStyle = isBlack ? 'rgba(255, 255, 255, 0.125)' : 'transparent';
                checkerboardContext.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }
    
        updateDimensionsDisplay(width, height); // Update the displayed canvas dimensions
    }
    
    function updateDimensionsDisplay(width, height) {
        document.getElementById('canvas-width').textContent = width;
        document.getElementById('canvas-height').textContent = height;
    }
    
    /* =========================================================================================================================================== */
    /*                                            Section 2: Canvas Resizing                                                                       */
    /* =========================================================================================================================================== */
    
    // Variables to track selected size and orientation
    let selectedSize = 64; // Default size is 64x64
    
    // Function to apply canvas resizing based on size and orientation
    function resizeCanvas() {
        // Update number of cells based on selected size
        numCells = selectedSize;
            
        // Update cell size based on canvas size and number of cells
        cellSize = (selectedOrientation === 'portrait' ? defaultPortraitWidth : defaultLandscapeWidth) / numCells;
            
        // Set canvas dimensions based on orientation
        width = selectedOrientation === 'portrait' ? defaultPortraitWidth : defaultLandscapeWidth;
        height = selectedOrientation === 'portrait' ? defaultPortraitHeight : defaultLandscapeHeight;
            
        // Redraw the checkerboard with updated cell size
        drawCheckerboard();
    }
    
    // Event listener for size buttons in the resizePopup
    document.querySelectorAll('.size-options button').forEach(button => {
        button.addEventListener('click', function() {
            // Update selected size
            selectedSize = parseInt(this.textContent);
                
            // Remove 'active-button' class from other buttons
            document.querySelectorAll('.size-options button').forEach(btn => btn.classList.remove('active-button'));
            // Add 'active-button' class to clicked button
            this.classList.add('active-button');
        });
    });
    
    // Event listener for orientation radio buttons
    document.querySelectorAll('input[name="orientation"]').forEach(radio => {
        radio.addEventListener('change', function() {
            selectedOrientation = this.value; // Update selected orientation
        });
    });
    
    // Apply button event listener to resize the canvas
    document.querySelector('.apply-btn').addEventListener('click', function() {
        resizeCanvas(); // Resize canvas when apply is clicked
        closeResizePopup(); // Close the resize popup after applying changes
    });
    
    // Function to close the resize popup
    function closeResizePopup() {
        document.getElementById('resizePopup').classList.add('hidden');
    }
    
    /* =========================================================================================================================================== */
    /*                                            Section 3: Hover Layer                                                                           */
    /* =========================================================================================================================================== */
    
    function highlightCellAndDisplayCoordinates(x, y) {
        const cellX = Math.floor(x / cellSize);
        const cellY = Math.floor(y / cellSize);
    
        hoverContext.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height);
    
        hoverContext.fillStyle = 'rgba(255, 255, 255, 0.3)'; // Semi-transparent white
            
        // Draw highlighted area based on pixel size
        const size = cellSize * pixelSize;
        hoverContext.fillRect(cellX * cellSize, cellY * cellSize, size, size);
    
        document.getElementById('x-coordinate').textContent = cellX + 1; // Display X coordinate
        document.getElementById('y-coordinate').textContent = cellY + 1; // Display Y coordinate
    }
    
    function resetCoordinates() {
        document.getElementById('x-coordinate').textContent = 0;
        document.getElementById('y-coordinate').textContent = 0;
    }
    
    /* =========================================================================================================================================== */
    /*                                            Section 4: Draw Layer                                                                            */
    /* =========================================================================================================================================== */

    const opacitySlider = document.getElementById('opacitySlider');
    const opacityValue = document.getElementById('opacityValue'); // Element to display current opacity value

    opacitySlider.addEventListener('input', function() {
        opacity = Math.max(0.0, parseFloat(this.value));
        opacityValue.textContent = opacity.toFixed(1); // Update the opacity display
    });

    function applyAction(x, y) {
        const cellX = Math.floor(x / cellSize);
        const cellY = Math.floor(y / cellSize);
        const size = cellSize * pixelSize;

        if (selectedTool === 'pencil') {
            drawContext.globalAlpha = opacity;
            drawContext.fillStyle = document.querySelector('.color-indicator').style.backgroundColor; // Use the selected color
            drawContext.clearRect(cellX * cellSize, cellY * cellSize, size, size); // Clear area
            drawContext.fillRect(cellX * cellSize, cellY * cellSize, size, size); // Draw new color
        } else if (selectedTool === 'eraser') {
            drawContext.globalCompositeOperation = 'destination-out';
            drawContext.globalAlpha = opacity; // Use the current opacity for erasing
            drawContext.fillStyle = 'rgba(255, 255, 255, 1)'; // Erase with full opacity
            drawContext.fillRect(cellX * cellSize, cellY * cellSize, size, size);
            drawContext.globalCompositeOperation = 'source-over';
        } else if (selectedTool === 'spray') {
            drawContext.fillStyle = document.querySelector('.color-indicator').style.backgroundColor; // Use the selected color
            drawSprayPattern(cellY, cellX, pixelSize, opacity, 0); // Use 0 for angle (no rotation)
        } else if (selectedTool === 'brush') {
            drawContext.globalAlpha = opacity; // Apply opacity scaling
            drawContext.fillStyle = document.querySelector('.color-indicator').style.backgroundColor; // Use the selected color
            drawBrushPattern(cellY, cellX); // Use updated brush size and opacity
        } else if (selectedTool === 'bucket') {
            floodFill(cellX, cellY);
        }
    }

    const pixelSizeSlider = document.getElementById('pixel-size-slider');
    const pixelSizeValue = document.getElementById('pixel-size-value'); // Element to display current pixel size value

    pixelSizeSlider.addEventListener('input', function() {
        pixelSize = parseInt(this.value); // Update pixel size based on slider value (1, 2, 3, 4)
        pixelSizeValue.textContent = this.value; // Update the pixel size display
    });

    document.querySelectorAll('.toolbar-button').forEach(button => {
        button.addEventListener('click', function() {
            const tool = this.getAttribute('data-tool');
            if (selectedTool === tool) {
                this.classList.remove('selected');
                selectedTool = 'none';
                isDrawing = false;
                lineStartX = null; // Reset line start position
                lineStartY = null; // Reset line start position
            } else {
                document.querySelectorAll('.toolbar-button').forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
                selectedTool = tool;
                isDrawing = tool === 'pencil' || tool === 'eraser' || tool === 'spray' || tool === 'brush' || tool === 'bucket' || tool === 'line';
            }
        });
    });

    /* =========================================================================================================================================== */
    /*                                            Section 5: Mouse Event Handling                                                                  */
    /* =========================================================================================================================================== */

    // Event listeners for drawing/erasing
    drawCanvas.addEventListener('mousedown', function(e) {
        if (selectedTool !== 'none') {
            const rect = drawCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
    
            if (selectedTool === 'line') {
                lineStartX = x;
                lineStartY = y;
            } else {
                applyAction(x, y);
                isDrawing = true;
    
                const moveAction = function(e) {
                    if (isDrawing) {
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        applyAction(x, y);
                    }
                };
    
                drawCanvas.addEventListener('mousemove', moveAction);
    
                drawCanvas.addEventListener('mouseup', function() {
                    isDrawing = false;
                    drawCanvas.removeEventListener('mousemove', moveAction);
                });
            }
        }
    });
    
    drawCanvas.addEventListener('mouseup', function(e) {
        if (selectedTool === 'line' && lineStartX !== null && lineStartY !== null) {
            const rect = drawCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
    
            drawLine(lineStartX, lineStartY, x, y); // Draw the line
            lineStartX = null; // Reset line start position
            lineStartY = null; // Reset line start position
        }
    });
    

    // Highlight cell and display coordinates on mouse move
    drawCanvas.addEventListener('mousemove', function(e) {
        const rect = drawCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        highlightCellAndDisplayCoordinates(x, y);
    });

    // Clear hover effect and reset coordinates when mouse leaves the canvas
    drawCanvas.addEventListener('mouseleave', function() {
        hoverContext.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height);
        resetCoordinates();
    });    

    /* =========================================================================================================================================== */
    /*                                            Section 6: Spray Pattern Functionality                                                           */
    /* =========================================================================================================================================== */

    function drawSprayPattern(row, col, brushSize, pressure, angle) {
        const brushPattern = [];
        const radius = brushSize / 2;
        const minAlpha = 0.2; // Minimum alpha to ensure particles are visible
        
        const densityFactor = pixelSize === 1 ? 2 : 1; // Increase density for pixel size 1
    
        for (let i = 0; i < Math.floor(brushSize * brushSize * pressure * densityFactor); i++) {
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
            const alpha = Math.max(minAlpha, pressure * (1 - distanceToCenter / radius) * 0.8); // Ensure minimum alpha
    
            drawContext.globalAlpha = alpha * opacity; // Apply opacity scaling
            drawContext.fillRect(x, y, cellSize, cellSize);
        });
    
        drawContext.globalAlpha = 1; // Reset global alpha
    }
    
    /* =========================================================================================================================================== */
    /*                                            Section 7: Brush Pattern Functionality                                                           */
    /* =========================================================================================================================================== */

    function drawBrushPattern(row, col) {
        const brushPattern = [
            // Central core (very dense)
            [0, 0], [0.5, 0], [-0.5, 0], [0, 0.5], [0, -0.5],
            [0.5, 0.5], [-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5],
            [1, 0], [-1, 0], [0, 1], [0, -1],
            [1, 0.5], [-1, -0.5], [0.5, 1], [-0.5, -1],
            [1, 1], [-1, -1], [1, -1], [-1, 1],
  
            // Intermediate scattering (medium dense)
            [1.5, 0], [-1.5, 0], [0, 1.5], [0, -1.5],
            [1.5, 0.5], [-1.5, -0.5], [0.5, 1.5], [-0.5, -1.5],
            [1.5, 1], [-1.5, -1], [1, 1.5], [-1, -1.5],
  
            // Outer scattering (low density)
            [2, 0], [-2, 0], [0, 2], [0, -2],
            [2, 0.5], [-2, -0.5], [0.5, 2], [-0.5, -2],
            [2, 1], [-2, -1], [1, 2], [-1, -2],
            [2, 1.5], [-2, -1.5], [1.5, 2], [-1.5, -2],
        ];
    
        const size = cellSize * pixelSize;
        const minAlpha = 0.; // Increased minimum alpha to enhance visibility
    
        brushPattern.forEach(([dx, dy], index) => {
            const x = col * cellSize + dx * size;
            const y = row * cellSize + dy * size;
    
            const distanceToCenter = Math.sqrt(dx * dx + dy * dy);
            const alpha = Math.max(minAlpha, opacity * (1 - distanceToCenter / (size / 2)) * 0.7); // Increased opacity scaling factor
    
            drawContext.globalAlpha = alpha; // Apply opacity scaling
            drawContext.fillRect(x, y, size, size);
        });
    
        drawContext.globalAlpha = 1; // Reset global alpha
    }

    /* =========================================================================================================================================== */
    /*                                            Section 8: Bucket Functionality                                                                  */
    /* =========================================================================================================================================== */

    function floodFill(x, y) {
        const targetColor = getPixelColor(x, y);
        const fillColor = document.querySelector('.color-indicator').style.backgroundColor; // Use the selected color
    
        if (colorsMatch(targetColor, fillColor)) return;
    
        const stack = [[x, y]];
    
        while (stack.length > 0) {
            const [cx, cy] = stack.pop();
            if (getPixelColor(cx, cy) === targetColor) {
                drawContext.fillStyle = fillColor;
                drawContext.fillRect(cx * cellSize, cy * cellSize, cellSize, cellSize);
    
                if (cx > 0) stack.push([cx - 1, cy]);
                if (cx < numCells - 1) stack.push([cx + 1, cy]);
                if (cy > 0) stack.push([cx, cy - 1]);
                if (cy < numCells - 1) stack.push([cx, cy + 1]);
            }
        }
    }
    
    function getPixelColor(x, y) {
        const imageData = drawContext.getImageData(x * cellSize, y * cellSize, cellSize, cellSize);
        const [r, g, b, a] = imageData.data;
        return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
    }
    
    function colorsMatch(color1, color2) {
        return color1 === color2;
    }

    /* =========================================================================================================================================== */
    /*                                            Section 9: Line Tool Functionality                                                               */
    /* =========================================================================================================================================== */

    function drawLine(x1, y1, x2, y2, preview = false) {
        drawContext.globalAlpha = opacity;
        drawContext.strokeStyle = document.querySelector('.color-indicator').style.backgroundColor; // Use the selected color
        drawContext.lineWidth = pixelSize * cellSize; // Adjust line width based on pixel size
        drawContext.beginPath();
        drawContext.moveTo(x1, y1);
        drawContext.lineTo(x2, y2);
        drawContext.stroke();
    }    

    /* =========================================================================================================================================== */
    /*                                            Section 10: Select Tool Functionality                                                             */
    /* =========================================================================================================================================== */

    /* =========================================================================================================================================== */
    /*                                            Section 11: Move Tool Functionality                                                              */
    /* =========================================================================================================================================== */

    /* =========================================================================================================================================== */
    /*                                            Section 12: Initialization Apply                                                                 */
    /* =========================================================================================================================================== */

    drawCheckerboard();
    applyPalette('defaultPalette');
};
