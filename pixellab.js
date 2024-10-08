/* =========================================================================================================================================== */
/*                                            Section 0: Canvas Setup and Initialization                                                       */
/* =========================================================================================================================================== */

window.onload = function() {
    // Canvas and Contexts
    const checkerboardCanvas = document.getElementById('checkerboardCanvas');
    const checkerboardContext = checkerboardCanvas.getContext('2d');
    const drawCanvas = document.getElementById('drawCanvas');
    const drawContext = drawCanvas.getContext('2d');
    const hoverCanvas = document.getElementById('hoverCanvas');
    const hoverContext = hoverCanvas.getContext('2d');

    // Default Dimensions
    const defaultPortraitWidth = 640; 
    const defaultPortraitHeight = 640; 
    const defaultLandscapeWidth = 1080;
    const defaultLandscapeHeight = 720;

    // Tooltips and Background Popup
    const toolbarButtons = document.querySelectorAll('.toolbar-button, .rgb-button');
    const timeouts = new Map();
    const backgroundPopup = document.getElementById('backgroundPopup');
    const closeBackgroundPopup = document.getElementById('closeBackgroundPopup');
    const backgroundButtons = document.querySelectorAll('.background-btn');

    // Undo/Redo State
    let undoStack = [];
    let redoStack = [];
    const maxHistorySize = 50;

    // Variables for Canvas Setup and Drawing Tools
    let numCells = 64;
    let cellSize = defaultPortraitWidth / numCells;
    let width = defaultPortraitWidth;
    let height = defaultPortraitHeight;
    let selectedOrientation = 'portrait';
    let selectedSize = 64;

    // Variables for Canvas Scaling - Browser / Fullscreen
    let scaleFactor = 1; // Default scaling, 1 for portrait (no scaling), 0.80 for landscape
    let offscreenCanvas = document.createElement('canvas');
    let offscreenCtx = offscreenCanvas.getContext('2d');

    // Variables for Tools / Drawing
    let pixelSize = 1;
    let selectedTool = 'none';
    let isDrawing = false;
    let opacity = 1;

    let selectionBox = null;  // Holds the current selection box
    let isSelecting = false;  // Tracks if the user is selecting
    let isDragging = false;   // Tracks if the user is dragging the selection
    let startX, startY;       // Starting coordinates for the selection
    let selectedCells = [];   // Stores the selected cells
    let offsetX, offsetY;     // Offset for dragging
    
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
    /*                                            Section 2: Hover Layer                                                                           */
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
    /*                                            Section 3: Draw Layer                                                                            */
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

        // Undo/Redo - Save the current state before applying new changes
        saveState();

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
            drawContext.globalAlpha = opacity;
            drawContext.fillStyle = document.querySelector('.color-indicator').style.backgroundColor; // Use the selected color
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
                hoverContext.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height); // Clear selection rectangle
                
                // Clear tool info display when no tool is selected
                document.getElementById('selected-tool').textContent = 'None';
    
            } else {
                document.querySelectorAll('.toolbar-button').forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
                selectedTool = tool;
                isDrawing = tool === 'pencil' || tool === 'eraser' || tool === 'spray' || tool === 'brush' || tool === 'bucket';
                
                // Update the tool info display with the selected tool
                document.getElementById('selected-tool').textContent = tool.charAt(0).toUpperCase() + tool.slice(1);
            }
        });
    });  
    
    /* =========================================================================================================================================== */
    /*                                            Section 4: Responsiveness - Canvas Scaling and Resize Handling                                   */
    /* =========================================================================================================================================== */

    function adjustCanvasScale() {
        const width = window.innerWidth;
    
        // Set scale factors and translations based on device width for both orientations
        let scaleFactor;
        let translateX;
    
        // Define scale factors for portrait
        const portraitScaleFactors = [
            { maxWidth: 320, scale: 0.4, translateX: '-65px' },
            { maxWidth: 375, scale: 0.50, translateX: '-88px' },
            { maxWidth: 384, scale: 0.55, translateX: '-98px' },
            { maxWidth: 390, scale: 0.58, translateX: '-105px' },
            { maxWidth: 412, scale: 0.55, translateX: '-95px' },
            { maxWidth: 414, scale: 0.60, translateX: '-107px' },
            { maxWidth: 430, scale: 0.60, translateX: '-107px' },
            { maxWidth: 479, scale: 0.60, translateX: '-100px' },
            { maxWidth: 540, scale: 0.65, translateX: '-100px' },
            { maxWidth: 600, scale: 0.75, translateX: '-120px' },
            { maxWidth: 768, scale: 1.00, translateX: '-177px' },
            { maxWidth: 820, scale: 1.05, translateX: '-170px' },
            { maxWidth: 900, scale: 1.10, translateX: '-180px' },
            { maxWidth: 1024, scale: 1.40, translateX: '-240px'}
        ];
    
        // Define scale factors for landscape
        const landscapeScaleFactors = [
            { maxWidth: 320, scale: 0.30, translateX: '-88px' },
            { maxWidth: 375, scale: 0.33, translateX: '-97.5px' },
            { maxWidth: 384, scale: 0.35, translateX: '-100px' },
            { maxWidth: 390, scale: 0.35, translateX: '-100px' },
            { maxWidth: 412, scale: 0.38, translateX: '-111px' }, 
            { maxWidth: 414, scale: 0.38, translateX: '-111px' }, 
            { maxWidth: 430, scale: 0.40, translateX: '-116px' }, 
            { maxWidth: 479, scale: 0.40, translateX: '-112px' }, 
            { maxWidth: 540, scale: 0.45, translateX: '-125px' }, 
            { maxWidth: 600, scale: 0.50, translateX: '-132px' }, 
            { maxWidth: 768, scale: 0.60, translateX: '-168px' }, 
            { maxWidth: 820, scale: 0.70, translateX: '-195px' }, 
            { maxWidth: 900, scale: 0.80, translateX: '-225px' }, 
            { maxWidth: 1024, scale: 0.90, translateX: '-260px'}
        ];
    
        // Choose scale factors based on the selected orientation
        const scaleFactors = selectedOrientation === 'portrait' ? portraitScaleFactors : landscapeScaleFactors;
    
        for (const factor of scaleFactors) {
            if (width <= factor.maxWidth) {
                scaleFactor = factor.scale;
                translateX = factor.translateX;
                break;
            }
        }
    
        applyCanvasScaling(scaleFactor, translateX);
    }
    
    function applyCanvasScaling(scaleFactor, translateX) {
        const baseWidth = selectedOrientation === 'portrait' ? defaultPortraitWidth : defaultLandscapeWidth;
        const baseHeight = selectedOrientation === 'portrait' ? defaultPortraitHeight : defaultLandscapeHeight;
    
        const numCells = selectedSize; // Get the user-defined number of cells
        const cellSize = Math.floor(baseWidth / numCells); // Cell size based on user selection
    
        const widthCanvas = cellSize * numCells;
        const heightCanvas = Math.floor(baseHeight / cellSize) * cellSize; // Height to fit whole cells
    
        // Scale and resize the canvas elements based on both screen size and user preferences
        checkerboardCanvas.style.width = `${widthCanvas * scaleFactor}px`;
        checkerboardCanvas.style.height = `${heightCanvas * scaleFactor}px`;
        
        drawCanvas.style.width = `${widthCanvas * scaleFactor}px`;
        drawCanvas.style.height = `${heightCanvas * scaleFactor}px`;
        
        hoverCanvas.style.width = `${widthCanvas * scaleFactor}px`;
        hoverCanvas.style.height = `${heightCanvas * scaleFactor}px`;
    
        // Apply individual translations for each canvas
        checkerboardCanvas.style.transform = `translate(${translateX}, 0)`;
        drawCanvas.style.transform = `translate(${translateX}, 0)`;
        hoverCanvas.style.transform = `translate(${translateX}, 0)`;
    }

    /* =========================================================================================================================================== */
    /*                                            Section 5.1: Mouse Event Handling                                                                  */
    /* =========================================================================================================================================== */

    // Mouse down event to start selecting or dragging
    drawCanvas.addEventListener('mousedown', function (e) {
        const rect = drawCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scaleFactor;
        const y = (e.clientY - rect.top) / scaleFactor;
        
        if (selectedTool === 'select') {
            if (selectionBox) {
                // Check if clicking inside the selection box to start dragging
                if (x >= selectionBox.startX && x <= selectionBox.startX + selectionBox.width &&
                    y >= selectionBox.startY && y <= selectionBox.startY + selectionBox.height) {
                    isDragging = true;
                    offsetX = x - selectionBox.startX;
                    offsetY = y - selectionBox.startY;
                } else {
                    // Clicked outside the box, clear selection if not dragging
                    if (!isDragging) {
                        clearSelectionBox();
                    }
                }
            } else {
                // Start new selection
                isSelecting = true;
                startX = Math.floor(x / cellSize) * cellSize; // Snap to grid
                startY = Math.floor(y / cellSize) * cellSize; // Snap to grid
                selectionBox = null; // Reset previous selection box
            }
        } else if (selectedTool !== 'none') {
            // Apply action for the selected tool
            applyAction(x, y);
            isDrawing = true;

            const moveAction = function(e) {
                if (isDrawing) {
                    const x = (e.clientX - rect.left) / scaleFactor;
                    const y = (e.clientY - rect.top) / scaleFactor;
                    applyAction(x, y);
                }
            };

            drawCanvas.addEventListener('mousemove', moveAction);

            drawCanvas.addEventListener('mouseup', function() {
                isDrawing = false;
                drawCanvas.removeEventListener('mousemove', moveAction);
            });
        }
    });    

    // Mouse move event to update selection box, drag it, and highlight cells
    drawCanvas.addEventListener('mousemove', function (e) {
        const rect = drawCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scaleFactor;
        const y = (e.clientY - rect.top) / scaleFactor;

        // Highlight the cell and display coordinates
        highlightCellAndDisplayCoordinates(x, y);

        if (isSelecting) {
            const currentX = Math.floor(x / cellSize) * cellSize; // Snap to grid
            const currentY = Math.floor(y / cellSize) * cellSize; // Snap to grid
            const width = currentX - startX;
            const height = currentY - startY;

            // Ensure selection box does not go beyond canvas bounds
            const maxWidth = Math.min(width, hoverCanvas.width - startX);
            const maxHeight = Math.min(height, hoverCanvas.height - startY);

            drawSelectionBox(startX, startY, maxWidth, maxHeight);

            selectionBox = { startX, startY, width: maxWidth, height: maxHeight };
        } else if (isDragging) {
            // Calculate the new position of the selection box while dragging
            const newX = x - offsetX;
            const newY = y - offsetY;

            // Ensure dragging does not move the selection box out of canvas bounds
            const maxX = Math.min(newX, hoverCanvas.width - selectionBox.width);
            const maxY = Math.min(newY, hoverCanvas.height - selectionBox.height);

            drawSelectionBox(maxX, maxY, selectionBox.width, selectionBox.height); // Redraw the selection box at new position
        } else {
            // Redraw the selection box in its last position if not selecting or dragging
            if (selectionBox) {
                drawSelectionBox(selectionBox.startX, selectionBox.startY, selectionBox.width, selectionBox.height);
            }
        }
    });

    // Clear hover effect but keep the selection box visible when mouse leaves the canvas
    drawCanvas.addEventListener('mouseleave', function() {
        hoverContext.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height); // Clear hover effects

        // If a selection box exists, redraw it to keep it visible
        if (selectionBox) {
            drawSelectionBox(selectionBox.startX, selectionBox.startY, selectionBox.width, selectionBox.height);
        }

        resetCoordinates();
    });

    // Mouse up event to finalize selection or drop cells after dragging
    drawCanvas.addEventListener('mouseup', function (e) {
        const rect = drawCanvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scaleFactor;
        const y = (e.clientY - rect.top) / scaleFactor;

        if (isSelecting && selectionBox) {
            isSelecting = false;

            // Ensure selection box does not go beyond canvas bounds
            const { startX, startY, width, height } = selectionBox;
            const maxWidth = Math.min(width, hoverCanvas.width - startX);
            const maxHeight = Math.min(height, hoverCanvas.height - startY);

            captureSelectedCells({ startX, startY, width: maxWidth, height: maxHeight }); // Capture the selected cells when mouse is released
            drawSelectionBox(startX, startY, maxWidth, maxHeight); // Ensure the selection box stays visible
        } else if (isDragging) {
            isDragging = false;

            // Ensure dropped cells stay within canvas bounds
            const newX = Math.min(x - offsetX, hoverCanvas.width - selectionBox.width);
            const newY = Math.min(y - offsetY, hoverCanvas.height - selectionBox.height);

            moveAndDropSelectedCells(newX, newY); // Move and drop selected cells at new location
        }
    });

    /* =========================================================================================================================================== */
    /*                                            Section 5.2: Touch Event Handling (Mobile)                                                      */
    /* =========================================================================================================================================== */

    // Touch start event
    drawCanvas.addEventListener('touchstart', function (e) {
        e.preventDefault();
        const rect = drawCanvas.getBoundingClientRect();
        const scaleX = drawCanvas.width / rect.width;
        const scaleY = drawCanvas.height / rect.height;
        
        // Calculate the scaled coordinates
        const x = (e.touches[0].clientX - rect.left) * scaleX;
        const y = (e.touches[0].clientY - rect.top) * scaleY;

        if (selectedTool === 'select') {
            if (selectionBox) {
                // Check if clicking inside the selection box
                if (x >= selectionBox.startX && x <= selectionBox.startX + selectionBox.width &&
                    y >= selectionBox.startY && y <= selectionBox.startY + selectionBox.height) {
                    isDragging = true;
                    offsetX = x - selectionBox.startX;
                    offsetY = y - selectionBox.startY;
                } else {
                    if (!isDragging) {
                        clearSelectionBox();
                    }
                }
            } else {
                isSelecting = true;
                startX = Math.floor(x / cellSize) * cellSize;
                startY = Math.floor(y / cellSize) * cellSize;
                selectionBox = null;
            }
        } else if (selectedTool !== 'none') {
            applyAction(x, y);
            isDrawing = true;

            const moveAction = function(e) {
                if (isDrawing) {
                    const x = (e.touches[0].clientX - rect.left) * scaleX;
                    const y = (e.touches[0].clientY - rect.top) * scaleY;
                    applyAction(x, y);
                }
            };

            drawCanvas.addEventListener('touchmove', moveAction);

            drawCanvas.addEventListener('touchend', function() {
                isDrawing = false;
                drawCanvas.removeEventListener('touchmove', moveAction);
            });
        }
    });

    // Touch move event
    drawCanvas.addEventListener('touchmove', function (e) {
        const rect = drawCanvas.getBoundingClientRect();
        const scaleX = drawCanvas.width / rect.width;
        const scaleY = drawCanvas.height / rect.height;

        const x = (e.touches[0].clientX - rect.left) * scaleX;
        const y = (e.touches[0].clientY - rect.top) * scaleY;

        highlightCellAndDisplayCoordinates(x, y);

        if (isSelecting) {
            const currentX = Math.floor(x / cellSize) * cellSize;
            const currentY = Math.floor(y / cellSize) * cellSize;
            const width = currentX - startX;
            const height = currentY - startY;

            const maxWidth = Math.min(width, hoverCanvas.width - startX);
            const maxHeight = Math.min(height, hoverCanvas.height - startY);

            drawSelectionBox(startX, startY, maxWidth, maxHeight);
            selectionBox = { startX, startY, width: maxWidth, height: maxHeight };
        } else if (isDragging) {
            const newX = x - offsetX;
            const newY = y - offsetY;

            const maxX = Math.min(newX, hoverCanvas.width - selectionBox.width);
            const maxY = Math.min(newY, hoverCanvas.height - selectionBox.height);

            drawSelectionBox(maxX, maxY, selectionBox.width, selectionBox.height);
        } else {
            if (selectionBox) {
                drawSelectionBox(selectionBox.startX, selectionBox.startY, selectionBox.width, selectionBox.height);
            }
        }
    });

    // Touch end event
    drawCanvas.addEventListener('touchend', function (e) {
        const rect = drawCanvas.getBoundingClientRect();
        const scaleX = drawCanvas.width / rect.width;
        const scaleY = drawCanvas.height / rect.height;

        const x = (e.changedTouches[0].clientX - rect.left) * scaleX;
        const y = (e.changedTouches[0].clientY - rect.top) * scaleY;

        if (isSelecting && selectionBox) {
            isSelecting = false;

            const { startX, startY, width, height } = selectionBox;
            const maxWidth = Math.min(width, hoverCanvas.width - startX);
            const maxHeight = Math.min(height, hoverCanvas.height - startY);

            captureSelectedCells({ startX, startY, width: maxWidth, height: maxHeight });
            drawSelectionBox(startX, startY, maxWidth, maxHeight);
        } else if (isDragging) {
            isDragging = false;

            const newX = Math.min(x - offsetX, hoverCanvas.width - selectionBox.width);
            const newY = Math.min(y - offsetY, hoverCanvas.height - selectionBox.height);

            moveAndDropSelectedCells(newX, newY);
        }
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

    function floodFill(startX, startY) {
        // Adjust the starting coordinates to account for the scale factor
        startX = Math.floor(startX / scaleFactor);
        startY = Math.floor(startY / scaleFactor);
    
        const targetColor = getPixelColor(startX, startY);
        const fillColor = document.querySelector('.color-indicator').style.backgroundColor; // Use the selected color
        const fillColorWithAlpha = getColorWithAlpha(fillColor, drawContext.globalAlpha); // Apply the current opacity
    
        if (colorsMatch(targetColor, fillColorWithAlpha)) return;
    
        const stack = [[startX, startY]];
    
        while (stack.length > 0) {
            const [x, y] = stack.pop();
    
            // Check if the current pixel is within bounds, considering the scaling factor
            if (x < 0 || x >= numCells || y < 0 || y >= Math.floor(height / cellSize)) continue;
    
            const currentColor = getPixelColor(x, y);
            
            // If the current pixel matches the target color, we can fill it
            if (colorsMatch(currentColor, targetColor)) {
                drawContext.fillStyle = fillColorWithAlpha;
                drawContext.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    
                // Push neighboring cells onto the stack for further processing
                stack.push([x - 1, y]); // Left
                stack.push([x + 1, y]); // Right
                stack.push([x, y - 1]); // Up
                stack.push([x, y + 1]); // Down
            }
        }
    }    

    function getPixelColor(x, y) {
        // Retrieve color for a single pixel
        const imageData = drawContext.getImageData(x * cellSize, y * cellSize, 1, 1); 
        const [r, g, b, a] = imageData.data; // Extract RGBA components

        // Return color as rgba string, normalizing alpha to a 0-1 range
        return a === 0 ? 'transparent' : `rgba(${r}, ${g}, ${b}, ${a / 255})`;
    }

    function getColorWithAlpha(color, alpha) {
        const [r, g, b] = color.match(/\d+/g).map(Number); // Extract RGB values
        return `rgba(${r}, ${g}, ${b}, ${alpha})`; // Return color with adjusted alpha
    }

    function colorsMatch(color1, color2) {
        if (color1 === 'transparent' || color2 === 'transparent') {
            return color1 === color2; // Treat transparent areas as distinct
        }

        const rgba1 = color1.match(/\d+(\.\d+)?/g).map(Number);
        const rgba2 = color2.match(/\d+(\.\d+)?/g).map(Number);

        // Compare RGBA values with tolerance to handle small rounding errors
        const tolerance = 1; // You can adjust tolerance if needed
        return Math.abs(rgba1[0] - rgba2[0]) <= tolerance &&
            Math.abs(rgba1[1] - rgba2[1]) <= tolerance &&
            Math.abs(rgba1[2] - rgba2[2]) <= tolerance &&
            Math.abs(rgba1[3] - rgba2[3]) <= tolerance;
    } 

    /* =========================================================================================================================================== */
    /*                                            Section 9: Select Tool Functionality                                                             */
    /* =========================================================================================================================================== */
    
    // Function to draw the selection box, snapping to the grid
    function drawSelectionBox(x, y, width, height) {
        hoverContext.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height); // Clear previous drawing
    
        // Enforce canvas boundaries
        const maxX = Math.min(x + width, hoverCanvas.width);
        const maxY = Math.min(y + height, hoverCanvas.height);
        const clippedWidth = maxX - x;
        const clippedHeight = maxY - y;
    
        // Optional: Add a semi-transparent overlay to the selected area
        hoverContext.fillStyle = 'rgba(255, 255, 255, 0.1)';
        hoverContext.fillRect(x, y, clippedWidth, clippedHeight);  // Fill the selection area
    
        // Dashed outline
        hoverContext.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        hoverContext.lineWidth = 2;
        hoverContext.setLineDash([6]); // Dashed line
        hoverContext.strokeRect(x, y, clippedWidth, clippedHeight); // Draw the selection box
    }
    
    // Function to capture colored cells inside the selection box
    function captureSelectedCells(box) {
        selectedCells = []; // Reset selected cells
    
        const { startX, startY, width, height } = box;
        const startCellX = Math.floor(startX / cellSize);
        const startCellY = Math.floor(startY / cellSize);
        const endCellX = Math.floor((startX + width) / cellSize);
        const endCellY = Math.floor((startY + height) / cellSize);
    
        // Enforce canvas boundaries for cells
        const maxCellX = Math.floor(hoverCanvas.width / cellSize);
        const maxCellY = Math.floor(hoverCanvas.height / cellSize);
    
        for (let row = Math.max(startCellY, 0); row <= Math.min(endCellY, maxCellY - 1); row++) {
            for (let col = Math.max(startCellX, 0); col <= Math.min(endCellX, maxCellX - 1); col++) {
                const imageData = drawContext.getImageData(col * cellSize, row * cellSize, cellSize, cellSize);
                if (hasColor(imageData)) {
                    selectedCells.push({ x: col, y: row, imageData });
                }
            }
        }
    }
    
    // Function to check if a cell has color (not transparent)
    function hasColor(imageData) {
        for (let i = 0; i < imageData.data.length; i += 4) {
            if (imageData.data[i + 3] !== 0) { // Check if alpha is not 0 (non-transparent)
                return true;
            }
        }
        return false;
    }
    
    // Function to clear the selection box
    function clearSelectionBox() {
        hoverContext.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height); // Clear hover canvas
        selectionBox = null;
    }
    
    // Function to move selected cells and drop them at the new location
    function moveAndDropSelectedCells(newX, newY) {
        const startCellX = Math.floor(newX / cellSize);
        const startCellY = Math.floor(newY / cellSize);
    
        selectedCells.forEach(cell => {
            drawContext.clearRect(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize); // Clear original cell
            drawContext.putImageData(cell.imageData, (startCellX + (cell.x - selectionBox.startX / cellSize)) * cellSize, (startCellY + (cell.y - selectionBox.startY / cellSize)) * cellSize); // Draw in new location
        });
    
        // Clear selection box after dropping cells
        clearSelectionBox();
    }
        
    /* =========================================================================================================================================== */
    /*                                            Section 10.1: PixelLab - Tooltips                                                                */
    /* =========================================================================================================================================== */
    
        toolbarButtons.forEach(button => {
            timeouts.set(button, null);
    
            button.addEventListener('mouseenter', function() {
                clearTimeout(timeouts.get(button));
    
                const timeoutId = setTimeout(() => {
                    const tooltip = button.querySelector('.tooltip-down, .tooltip-right');
                    if (tooltip) {
                        tooltip.style.visibility = 'visible';
                        tooltip.style.opacity = '1';
                    }
                }, 1000);
    
                timeouts.set(button, timeoutId);
            });
    
            button.addEventListener('mouseleave', function() {
                clearTimeout(timeouts.get(button));
    
                const tooltip = button.querySelector('.tooltip-down, .tooltip-right');
                if (tooltip) {
                    tooltip.style.visibility = 'hidden';
                    tooltip.style.opacity = '0';
                }
            });
        });
        
    /* =========================================================================================================================================== */
    /*                                            Section 10.2: PixelLab - Dropdown/up Functions                                                   */
    /* =========================================================================================================================================== */

        let timeoutId = null;
        const closeDelay = 500;
    
        function closeAllMenus() {
            document.querySelectorAll('.dropdown-file, .dropdown-palettes-scroll, .dropdown-select, .dropdown-settings, .rgb-dropup').forEach(menu => {
                menu.classList.add('hidden');
            });
            closeAllPopups();
        }
    
        function closeAllPopups() {
            document.querySelectorAll('#backgroundPopup, #aboutPixelLabPopup, #resizePopup').forEach(popup => {
                popup.classList.add('hidden');
            });
        }
    
        function showMenu(menu) {
            closeAllMenus();
            menu.classList.remove('hidden');
        }
    
        function handleMenuHover(menu) {
            menu.addEventListener('mouseenter', function() {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
            });
    
            menu.addEventListener('mouseleave', function() {
                timeoutId = setTimeout(() => {
                    menu.classList.add('hidden');
                }, closeDelay);
            });
        }
    
        document.addEventListener('click', function(event) {
            const target = event.target;
    
            if (target.matches('.file-button')) {
                const dropdownMenu = document.querySelector('.dropdown-file');
                showMenu(dropdownMenu);
            } else if (target.matches('.palettes-button')) {
                const dropdownMenu = document.querySelector('.dropdown-palettes-scroll');
                showMenu(dropdownMenu);
            } else if (target.matches('.select-button')) {
                const dropdownMenu = document.querySelector('.dropdown-select');
                showMenu(dropdownMenu);
            } else if (target.matches('.settings-button')) {
                const dropdownMenu = document.querySelector('.dropdown-settings');
                showMenu(dropdownMenu);
            } else if (target.matches('.rgb-button')) {
                const dropupMenu = document.querySelector('.rgb-dropup');
                showMenu(dropupMenu);
            } else if (target.matches('#background-settings-button')) {
                const dropdownSettings = document.querySelector('.dropdown-settings');
                const backgroundPopup = document.getElementById('backgroundPopup');
                dropdownSettings.classList.add('hidden');
                showMenu(backgroundPopup);
            } else if (target.matches('#about-pixel-lab-button')) {
                const dropdownSettings = document.querySelector('.dropdown-settings');
                const aboutPopup = document.getElementById('aboutPixelLabPopup');
                dropdownSettings.classList.add('hidden');
                showMenu(aboutPopup);
            } else if (target.matches('#resizeCanvasButton')) {
                const dropdownMenu = document.querySelector('.dropdown-file');
                const resizePopup = document.getElementById('resizePopup');
                dropdownMenu.classList.add('hidden');
                showMenu(resizePopup);
            } else if (target.matches('#closeResizePopup')) {
                closeResizePopup();
            } else if (target.matches('#closeBackgroundPopup')) {
                closeBackgroundPopup();
            } else if (target.matches('#closeAboutPixelLabPopup')) {
                closeAboutPixelLabPopup();
            } else if (!target.closest('.dropdown-file') &&
                    !target.closest('.dropdown-palettes-scroll') &&
                    !target.closest('.dropdown-select') &&
                    !target.closest('.dropdown-settings') &&
                    !target.closest('.rgb-dropup') &&
                    !target.closest('.file-button') &&
                    !target.closest('.palettes-button') &&
                    !target.closest('.select-button') &&
                    !target.closest('.settings-button') &&
                    !target.closest('.rgb-button') &&
                    !target.closest('#backgroundPopup') &&
                    !target.closest('#aboutPixelLabPopup') &&
                    !target.closest('#resizePopup') &&
                    !target.closest('#background-settings-button') &&
                    !target.closest('#about-pixel-lab-button') &&
                    !target.closest('#resizeCanvasButton')) {
                closeAllMenus();
                closeAllPopups();
            }
        });
    
        document.querySelectorAll('.dropdown-file, .dropdown-palettes-scroll, .dropdown-select, .dropdown-settings, .rgb-dropup').forEach(menu => {
            handleMenuHover(menu);
        });
    
        window.closeResizePopup = function() {
            const resizePopup = document.getElementById('resizePopup');
            resizePopup.classList.add('hidden');
        };
    
        window.closeBackgroundPopup = function() {
            const backgroundPopup = document.getElementById('backgroundPopup');
            backgroundPopup.classList.add('hidden');
        };
    
        window.closeAboutPixelLabPopup = function() {
            const aboutPopup = document.getElementById('aboutPixelLabPopup');
            aboutPopup.classList.add('hidden');
        };
    
    /* =========================================================================================================================================== */
    /*                                            Section 11.1: File Dropdown - New Button                                                         */
    /* =========================================================================================================================================== */
    
    // Event listener for the new button
    document.getElementById('newButton').addEventListener('click', function(e) {
        if (e.button === 0) {
            resetToDefaults(); // Call reset function when the new button is clicked
        }
    });

    // Function to reset canvas to default settings
    function resetToDefaults() {
        // Clear the draw canvas
        drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

        // Reset to default size and orientation
        selectedSize = 64;
        selectedOrientation = 'portrait';
        resizeCanvas(); // Apply default size and orientation
    }

    /* =========================================================================================================================================== */
    /*                                            Section 11.2: File Dropdown - Clear Button                                                       */
    /* =========================================================================================================================================== */

    document.getElementById('clearButton').addEventListener('click', function(e) {
        // Ensure the click is the left mouse button (button === 0)
        if (e.button === 0) {
            resetCanvas(); // This is a placeholder for whatever action you want
        }
    });
    
    function resetCanvas() {
        // Example function to reset the canvas, if that's the desired action
        const drawCanvas = document.getElementById('drawCanvas');
        const drawContext = drawCanvas.getContext('2d');
        drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    }
    
    /* =========================================================================================================================================== */
    /*                                            Section 11.3: File Dropdown - Resizing Button                                                    */
    /* =========================================================================================================================================== */

    function resizeCanvas() {
        // Save the current drawing to the offscreen canvas before resizing
        saveDrawing();
    
        // Update number of cells based on selected size
        numCells = selectedSize;
    
        // Calculate initial cell size based on canvas width
        const baseWidth = selectedOrientation === 'portrait' ? defaultPortraitWidth : defaultLandscapeWidth;
        const baseHeight = selectedOrientation === 'portrait' ? defaultPortraitHeight : defaultLandscapeHeight;
    
        // Round the cell size down to ensure whole cells
        cellSize = Math.floor(baseWidth / numCells);
    
        // Adjust canvas width and height to fit whole cells
        width = cellSize * numCells;
        height = Math.floor(baseHeight / cellSize) * cellSize; // Ensure the height also fits whole cells
    
        // Adjust scale factor based on fullscreen status and orientation
        if (document.fullscreenElement) {
            scaleFactor = selectedOrientation === 'portrait' ? 1.20 : 1.00; // Fullscreen scaling
        } else {
            scaleFactor = selectedOrientation === 'landscape' ? 0.80 : 1.00; // Normal scaling
        }
    
        // Apply scaled dimensions to canvas element (display size, not actual resolution)
        checkerboardCanvas.style.width = `${width * scaleFactor}px`;
        checkerboardCanvas.style.height = `${height * scaleFactor}px`;
    
        drawCanvas.style.width = `${width * scaleFactor}px`;
        drawCanvas.style.height = `${height * scaleFactor}px`;
    
        hoverCanvas.style.width = `${width * scaleFactor}px`;
        hoverCanvas.style.height = `${height * scaleFactor}px`;
    
        // Center the canvases
        const translateX = selectedOrientation === 'portrait' ? 0 : -150; // Adjust based on orientation
        const translateY = selectedOrientation === 'portrait' ? 0 : 20; // Adjust based on orientation
    
        // Apply translations for centering
        checkerboardCanvas.style.transform = `translate(${translateX}px, ${translateY}px)`;
        drawCanvas.style.transform = `translate(${translateX}px, ${translateY}px)`;
        hoverCanvas.style.transform = `translate(${translateX}px, ${translateY}px)`;
    
        // Call adjustCanvasScale to ensure scaling and positioning remain effective
        adjustCanvasScale();
    
        // Redraw the checkerboard with updated cell size
        drawCheckerboard();
    
        // Restore the drawing after resizing
        restoreDrawing();
    }       

    function saveDrawing() {
        // Set offscreen canvas size to match the original canvas
        offscreenCanvas.width = drawCanvas.width;
        offscreenCanvas.height = drawCanvas.height;

        // Copy the current drawing to the offscreen canvas
        offscreenCtx.drawImage(drawCanvas, 0, 0);
    }

    function restoreDrawing() {
        // Restore the drawing from the offscreen canvas to the main canvas
        const ctx = drawCanvas.getContext('2d');
        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height); // Clear the canvas
        ctx.drawImage(offscreenCanvas, 0, 0); // Draw the saved content back
    }

    // Event listener for size buttons in the resizePopup
    document.querySelectorAll('.size-options button').forEach(button => {
        button.addEventListener('click', function() {
            selectedSize = parseInt(this.textContent);
            document.querySelectorAll('.size-options button').forEach(btn => btn.classList.remove('active-button'));
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
        // Clear the drawCanvas before resizing
        const ctx = drawCanvas.getContext('2d');
        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height); // Clear the canvas

        resizeCanvas(); // Resize canvas when apply is clicked
        closeResizePopup(); // Close the resize popup after applying changes
    });

    // Function to close the resize popup
    function closeResizePopup() {
        document.getElementById('resizePopup').classList.add('hidden');
    }

    window.addEventListener('load', function() {
        document.querySelector('input[name="orientation"][value="portrait"]').checked = true;
        selectedOrientation = 'portrait'; // Ensure initial state is correctly set
    });

    // Call adjustCanvasScale during window resize and on initial load
    window.addEventListener('resize', adjustCanvasScale);
    window.addEventListener('load', function() {
        adjustCanvasScale(); // Call this here to set initial scale
    }); 
    
    /* =========================================================================================================================================== */
    /*                                            Section 11.4: File Dropdown - Open Button                                                        */
    /* =========================================================================================================================================== */

    document.getElementById('openButton').addEventListener('click', function() {
        if ('showOpenFilePicker' in window) {
            // File System Access API is supported
            openFileFromPicker();
        } else {
            // Fallback method for browsers that don't support File System Access API
            openFileFallback();
        }
    });
    
    // For modern browsers with File System Access API
    async function openFileFromPicker() {
        try {
            // Show file picker to select a file
            const [fileHandle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: 'Images',
                        accept: {
                            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
                        }
                    }
                ],
                multiple: false // Ensure only one file is selected
            });
    
            const file = await fileHandle.getFile();
            const imageURL = URL.createObjectURL(file);
            
            // Display the image on the canvas
            drawImageOnCanvas(imageURL);
        } catch (error) {
            console.error('Error opening file:', error);
        }
    }
    
    // Fallback method using traditional input
    function openFileFallback() {
        // Create a hidden file input element
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*'; // Accept all image file types
        input.style.display = 'none';
    
        // Listen for when the user selects a file
        input.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const imageURL = URL.createObjectURL(file);
                
                // Display the image on the canvas
                drawImageOnCanvas(imageURL);
            }
        });
    
        // Trigger the file input dialog
        input.click();
    }
    
    // Function to draw the selected image onto the canvas
    function drawImageOnCanvas(imageURL) {
        const drawCanvas = document.getElementById('drawCanvas');
        const ctx = drawCanvas.getContext('2d');
        
        const image = new Image();
        image.src = imageURL;
        
        image.onload = function() {
            // Clear the canvas before drawing
            ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
            
            // Draw the image onto the canvas
            ctx.drawImage(image, 0, 0, drawCanvas.width, drawCanvas.height);
        };
    }

    /* =========================================================================================================================================== */
    /*                                            Section 11.5: File Dropdown - Save Button                                                        */
    /* =========================================================================================================================================== */
    document.getElementById('saveButton').addEventListener('click', function() {
        if ('showSaveFilePicker' in window) {
            // File System Access API is supported
            saveCanvasAsPNG();
        } else {
            // Fallback method for browsers that don't support File System Access API
            saveCanvasFallback();
        }
    });
    
    async function saveCanvasAsPNG() {
        const drawCanvas = document.getElementById('drawCanvas');
        const drawCanvasDataURL = drawCanvas.toDataURL('image/png');
        const blob = await fetch(drawCanvasDataURL).then(res => res.blob());
        
        try {
            // Prompt the user to select a file save location
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: `canvas-image.png`, // Default file name with extension
                types: [
                    { 
                        description: 'PNG Image', 
                        accept: { 'image/png': ['.png'] } 
                    },
                    { 
                        description: 'JPEG Image', 
                        accept: { 'image/jpeg': ['.jpg', '.jpeg'] } 
                    },
                    { 
                        description: 'GIF Image', 
                        accept: { 'image/gif': ['.gif'] } 
                    }
                ]
            });
        
            const writableStream = await fileHandle.createWritable();
            await writableStream.write(blob);
            await writableStream.close();
        } catch (error) {
            console.error('Error saving file:', error);
        }
    }
    
    function saveCanvasFallback() {
        const drawCanvas = document.getElementById('drawCanvas');
        const drawCanvasDataURL = drawCanvas.toDataURL('image/png');
        
        // Prompt the user for a file name
        const fileName = prompt('Enter file name (without extension):', 'canvas-image');
        
        if (fileName) {
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = drawCanvasDataURL;
            link.download = `${fileName}.png`; // Use the user-provided name with .png extension
            
            // Append the link to the body and trigger a click
            document.body.appendChild(link);
            link.click();
            
            // Remove the link from the document
            document.body.removeChild(link);
        }
    }
    
    /* =========================================================================================================================================== */
    /*                                            Section 12: Palettes Dropdown - Palette Selection                                                */
    /* =========================================================================================================================================== */

    const palettes = {
        // Default Palette: A broad range of colors with both muted and vibrant tones.
        defaultPalette: [
            '#000000', '#12173d', '#293268', '#464b8c', '#6b74b2',
            '#909edd', '#c1d9f2', '#ffffff', '#a293c4', '#7b6aa5',
            '#53427f', '#3c2c68', '#431e66', '#5d2f8c', '#854cbf',
            '#b483ef', '#8cff9b', '#42bc7f', '#22896e', '#14665b',
            '#0f4a4c', '#0a2a33', '#1d1a59', '#322d89', '#354ab2',
            '#3e83d1', '#50b9eb', '#8cdaff', '#53a1ad', '#3b768f',
            '#21526b', '#163755', '#008782', '#00aaa5', '#27d3cb',
            '#78fae6', '#cdc599', '#988f64', '#5c5d41', '#353f23',
            '#919b45', '#afd370', '#ffe091', '#ffaa6e', '#ff695a',
            '#b23c40', '#ff6675', '#dd3745', '#a52639', '#721c2f',
            '#b22e69', '#e54286', '#ff6eaf', '#ffa5d5', '#ffd3ad',
            '#cc817a', '#895654', '#61393b', '#3f1f3c', '#723352',
            '#994c69', '#c37289', '#f29faa', '#ffccd0'
        ],

        // 8-Bit Palette: A vibrant and retro color scheme inspired by classic 8-bit graphics.
        bitPalette: [
            "#000000", "#fcfcfc", "#f8f8f8", "#bcbcbc", "#7c7c7c", "#a4e4fc",
            "#3cbcfc", "#0078f8", "#0000fc", "#b8b8f8", "#6888fc", "#0058f8",
            "#0000bc", "#d8b8f8", "#9878f8", "#6844fc", "#4428bc", "#f8b8f8",
            "#f878f8", "#d800cc", "#940084", "#f8a4c0", "#f85898", "#e40058",
            "#a80020", "#f0d0b0", "#f87858", "#f83800", "#a81000", "#fce0a8",
            "#fca044", "#e45c10", "#881400", "#f8d878", "#f8b800", "#ac7c00",
            "#503000", "#d8f878", "#b8f818", "#00b800", "#007800", "#b8f8b8",
            "#58d854", "#00a800", "#006800", "#b8f8d8", "#58f898", "#00a844",
            "#005800", "#00fcfc", "#00e8d8", "#008888", "#004058", "#f8d8f8",
            "#787878"
        ],

        // Astral Palette: Soft and cosmic with a mix of muted and bright colors
        astralPalette: [
            "#000000", "#6f6776", "#9a9a97", "#c5ccb8", "#8b5580", "#c38890", "#a593a5", "#666092", "#9a4f50", "#c28d75",
            "#7ca1c0", "#416aa3", "#8d6268", "#be955c", "#68aca9", "#387080", "#6e6962", "#93a167", "#6eaa78", "#557064",
            "#9d9f7f", "#7e9e99", "#5d6872", "#433455"
        ],

        // Bitter Palette: A color scheme featuring deep, moody tones with a touch of warmth
        bitterPalette: [
        "#282328", "#545c7e", "#c56981", "#a3a29a"
        ],

        // Contrast Palette: A high-contrast color scheme featuring bold and subtle shades
        contrastPalette: [
            "#222323", "#f0f6f0"
        ],
        
        // Crimson Palette: A bold and striking color scheme with intense reds and vibrant blues
        crimsonPalette: [
            "#ff0546", "#9c173b", "#660f31", "#450327", "#270022", "#17001d",
            "#09010d", "#0ce6f2", "#0098db", "#1e579c"
        ],

        // Dream Palette: A whimsical color scheme with dreamy purples, pinks, and soft pastels
        dreamPalette: [
            "#3c42c4", "#6e51c8", "#a065cd", "#ce79d2", "#d68fb8", "#dda2a3",
            "#eac4ae", "#f4dfbe"
        ],

        // Dungeon Palette: A rich and moody color scheme with deep, earthy tones and striking accents
        dungeonPalette: [
            "#2e222f", "#45293f", "#7a3045", "#993d41", "#cd683d", "#fbb954",
            "#f2ec8b", "#b0a987", "#997f73", "#665964", "#443846", "#576069",
            "#788a87", "#a9b2a2"
        ],

        // Dusk Palette: Soft, muted colors with an evening feel
        duskPalette: [
            "#0d2b45", "#203c56", "#544e68", "#8d697a", "#d08159", "#ffaa5e", "#ffd4a3", "#ffecd6"
        ],

        // Ember Palette: A range of warm colors with bright and soft accents
        emberPalette: [
            "#be4a2f", "#d77643", "#ead4aa", "#e4a672", "#b86f50", "#733e39", "#3e2731", "#a22633", "#e43b44", "#f77622",
            "#feae34", "#fee761", "#63c74d", "#3e8948", "#265c42", "#193c3e", "#124e89", "#0099db", "#2ce8f5", "#ffffff",
            "#c0cbdc", "#8b9bb4", "#5a6988", "#3a4466", "#262b44", "#181425", "#ff0044", "#68386c", "#b55088", "#f6757a",
            "#e8b796", "#c28569"
        ],

        // Fusion Palette: Diverse and vibrant, with a mix of bright and muted tones
        fusionPalette: [
            "#ff0040", "#131313", "#1b1b1b", "#272727", "#3d3d3d", "#5d5d5d", "#858585", "#b4b4b4", "#ffffff", "#c7cfdd",
            "#92a1b9", "#657392", "#424c6e", "#2a2f4e", "#1a1932", "#0e071b", "#1c121c", "#391f21", "#5d2c28", "#8a4836",
            "#bf6f4a", "#e69c69", "#f6ca9f", "#f9e6cf", "#edab50", "#e07438", "#c64524", "#8e251d", "#ff5000", "#ed7614",
            "#ffa214", "#ffc825", "#ffeb57", "#d3fc7e", "#99e65f", "#5ac54f", "#33984b", "#1e6f50", "#134c4c", "#0c2e44",
            "#00396d", "#0069aa", "#0098dc", "#00cdf9", "#0cf1ff", "#94fdff", "#fdd2ed", "#f389f5", "#db3ffd", "#7a09fa",
            "#3003d9", "#0c0293", "#03193f", "#3b1443", "#622461", "#93388f", "#ca52c9", "#c85086", "#f68187", "#f5555d",
            "#ea323c", "#c42430", "#891e2b", "#571c27"
        ],

        // Gameboy Palette: A nostalgic color scheme inspired by classic Gameboy graphics with muted and vibrant tones.
        gameboyPalette: [
            "#eff9d6", "#ba5044", "#7a1c4b", "#1b0326"
        ],

        // Indie Palette: A color scheme with a vintage, artistic feel featuring rich, earthy tones.
        indiePalette: [
            "#d1b187", "#c77b58", "#ae5d40", "#79444a", "#4b3d44", "#ba9158",
            "#927441", "#4d4539", "#77743b", "#b3a555", "#d2c9a5", "#8caba1",
            "#4b726e", "#574852", "#847875", "#ab9b8e"
        ],

        // Indie2 Palette: A vibrant and eclectic color scheme featuring a diverse range of bright and bold tones.
        indie2Palette: [
            "#8cffde", "#45b8b3", "#839740", "#c9ec85", "#46c657", "#158968",
            "#2c5b6d", "#222a5c", "#566a89", "#8babbf", "#cce2e1", "#ffdba5",
            "#ccac68", "#a36d3e", "#683c34", "#000000", "#38002c", "#663b93",
            "#8b72de", "#9cd8fc", "#5e96dd", "#3953c0", "#800c53", "#c34b91",
            "#ff94b3", "#bd1f3f", "#ec614a", "#ffa468", "#fff6ae", "#ffda70",
            "#f4b03c", "#ffffff"
        ],

        // Mist Palette: Soft and muted with a variety of pastel and earthy tones 
        mistPalette: [
            "#10121c", "#2c1e31", "#6b2643", "#ac2847", "#ec273f", "#94493a", "#de5d3a", "#e98537", "#f3a833", "#4d3533",
            "#6e4c30", "#a26d3f", "#ce9248", "#dab163", "#e8d282", "#f7f3b7", "#1e4044", "#006554", "#26854c", "#5ab552",
            "#9de64e", "#008b8b", "#62a477", "#a6cb96", "#d3eed3", "#3e3b65", "#3859b3", "#3388de", "#36c5f4", "#6dead6",
            "#5e5b8c", "#8c78a5", "#b0a7b8", "#deceed", "#9a4d76", "#c878af", "#cc99ff", "#fa6e79", "#ffa2ac", "#ffd1d5",
            "#f6e8e0", "#ffffff"
        ],

        // Monochrome Palette: A color scheme featuring varying shades of black and gray, with subtle accents
        monochromePalette: [
            "#08141e", "#0f2a3f", "#20394f", "#f6d6bd", "#c3a38a", "#997577",
            "#816271", "#4e495f"
        ],

        // Murky Palette: A color scheme featuring deep, earthy tones with a subdued and mysterious feel
        murkyPalette: [
            "#a6884a", "#906c30", "#825337", "#83473d", "#66352e", "#562923",
            "#612638", "#46332c", "#323230", "#3e4055", "#382d35", "#323b42",
            "#1f2d36", "#141f25", "#0b1016", "#245273", "#4e7499", "#5e7e8b",
            "#798a92", "#879ea3", "#e3ddd1", "#bdbbae", "#af9e94", "#907c75",
            "#a29f7e", "#969372", "#78735d", "#696353", "#4f493b", "#212528",
            "#595c55", "#4b4e4f", "#57562a", "#675f30", "#727234", "#73804b",
            "#5f7b53", "#3b6d62", "#32534a"
        ],

        // Mystic Palette: Rich and varied hues inspired by mystical themes
        mysticPalette: [
            "#172038", "#253a5e", "#3c5e8b", "#4f8fba", "#73bed3", "#a4dddb", "#19332d", "#25562e", "#468232", "#75a743",
            "#a8ca58", "#d0da91", "#4d2b32", "#7a4841", "#ad7757", "#c09473", "#d7b594", "#e7d5b3", "#341c27", "#602c2c",
            "#884b2b", "#be772b", "#de9e41", "#e8c170", "#241527", "#411d31", "#752438", "#a53030", "#cf573c", "#da863e",
            "#1e1d39", "#402751", "#7a367b", "#a23e8c", "#c65197", "#df84a5", "#090a14", "#10141f", "#151d28", "#202e37",
            "#394a50", "#577277", "#819796", "#a8b5b2", "#c7cfcc", "#ebede9"
        ],

        // Nature Palette: A color scheme inspired by the rich and varied hues found in natural landscapes.
        naturePalette: [
            "#636663", "#87857c", "#bcad9f", "#f2b888", "#eb9661", "#b55945",
            "#734c44", "#3d3333", "#593e47", "#7a5859", "#a57855", "#de9f47",
            "#fdd179", "#fee1b8", "#d4c692", "#a6b04f", "#819447", "#44702d",
            "#2f4d2f", "#546756", "#89a477", "#a4c5af", "#cae6d9", "#f1f6f0",
            "#d5d6db", "#bbc3d0", "#96a9c1", "#6c81a1", "#405273", "#303843",
            "#14233a"
        ],

        // Nocturnal Palette: Dark and vibrant with a range of colors suitable for night-time themes
        nocturnalPalette: [
            "#060608", "#141013", "#3b1725", "#73172d", "#b4202a", "#df3e23", "#fa6a0a", "#f9a31b", "#ffd541", "#fffc40",
            "#d6f264", "#9cdb43", "#59c135", "#14a02e", "#1a7a3e", "#24523b", "#122020", "#143464", "#285cc4", "#249fde",
            "#20d6c7", "#a6fcdb", "#ffffff", "#fef3c0", "#fad6b8", "#f5a097", "#e86a73", "#bc4a9b", "#793a80", "#403353",
            "#242234", "#221c1a", "#322b28", "#71413b", "#bb7547", "#dba463", "#f4d29c", "#dae0ea", "#b3b9d1", "#8b93af",
            "#6d758d", "#4a5462", "#333941", "#422433", "#5b3138", "#8e5252", "#ba756a", "#e9b5a3", "#e3e6ff", "#b9bffb",
            "#849be4", "#588dbe", "#477d85", "#23674e", "#328464", "#5daf8d", "#92dcba", "#cdf7e2", "#e4d2aa", "#c7b08b",
            "#a08662", "#796755", "#5a4e44", "#423934"
        ],

        // Oil Palette: A refined and elegant color scheme inspired by the deep, rich hues of oil paints.
        oilPalette: [
            "#fbf5ef", "#f2d3ab", "#c69fa5", "#8b6d9c", "#494d7e", "#272744"
        ],

        // Paperback Palette: A minimal color scheme with soft, muted tones and deep accents.
        paperbackPalette: [
            "#b8c2b9", "#382b26"
        ],

        // Siren Palette: A refined and elegant color scheme inspired by the deep, rich hues of oil paints.
        sirenPalette: [
            "#e0e2e3", "#b5a4a2", "#a58d8a", "#7a4c6d", "#3f3c61", "#1d1e3a"
        ],

        // Soda Palette: A refreshing color scheme with vibrant blues, soft pinks, and a hint of pastel.
        sodaPalette: [
            "#2176cc", "#ff7d6e", "#fca6ac", "#e8e7cb"
        ],

        // Celestial Spectrum Palette: A diverse range of vibrant and muted hues inspired by cosmic phenomena.
        spectrumPalette: [
            "#000000", "#222323", "#434549", "#626871", "#828b98", "#a6aeba", "#cdd2da", "#f5f7fa",
            "#625d54", "#857565", "#9e8c79", "#aea189", "#bbafa4", "#ccc3b1", "#eadbc9", "#fff3d6",
            "#583126", "#733d3b", "#885041", "#9a624c", "#ad6e51", "#d58d6b", "#fbaa84", "#ffce7f",
            "#002735", "#003850", "#004d5e", "#0b667f", "#006f89", "#328ca7", "#24aed6", "#88d6ff",
            "#662b29", "#94363a", "#b64d46", "#cd5e46", "#e37840", "#f99b4e", "#ffbc4e", "#ffe949",
            "#282b4a", "#3a4568", "#615f84", "#7a7799", "#8690b2", "#96b2d9", "#c7d6ff", "#c6ecff",
            "#002219", "#003221", "#174a1b", "#225918", "#2f690c", "#518822", "#7da42d", "#a6cc34",
            "#181f2f", "#23324d", "#25466b", "#366b8a", "#318eb8", "#41b2e3", "#52d2ff", "#74f5fd",
            "#1a332c", "#2f3f38", "#385140", "#325c40", "#417455", "#498960", "#55b67d", "#91daa1",
            "#5e0711", "#82211d", "#b63c35", "#e45c5f", "#ff7676", "#ff9ba8", "#ffbbc7", "#ffdbff",
            "#2d3136", "#48474d", "#5b5c69", "#73737f", "#848795", "#abaebe", "#bac7db", "#ebf0f6",
            "#3b303c", "#5a3c45", "#8a5258", "#ae6b60", "#c7826c", "#d89f75", "#ecc581", "#fffaab",
            "#31222a", "#4a353c", "#5e4646", "#725a51", "#7e6c54", "#9e8a6e", "#c0a588", "#ddbf9a",
            "#2e1026", "#49283d", "#663659", "#975475", "#b96d91", "#c178aa", "#db99bf", "#f8c6da",
            "#002e49", "#004051", "#005162", "#006b6d", "#008279", "#00a087", "#00bfa3", "#00deda",
            "#453125", "#614a3c", "#7e6144", "#997951", "#b29062", "#cca96e", "#e8cb82", "#fbeaa3",
            "#5f0926", "#6e2434", "#904647", "#a76057", "#bd7d64", "#ce9770", "#edb67c", "#edd493",
            "#323558", "#4a5280", "#64659d", "#7877c1", "#8e8ce2", "#9c9bef", "#b8aeff", "#dcd4ff",
            "#431729", "#712b3b", "#9f3b52", "#d94a69", "#f85d80", "#ff7daf", "#ffa6c5", "#ffcdff",
            "#49251c", "#633432", "#7c4b47", "#98595a", "#ac6f6e", "#c17e7a", "#d28d7a", "#e59a7c",
            "#202900", "#2f4f08", "#495d00", "#617308", "#7c831e", "#969a26", "#b4aa33", "#d0cc32",
            "#622a00", "#753b09", "#854f12", "#9e6520", "#ba882e", "#d1aa39", "#e8d24b", "#fff64f",
            "#26233d", "#3b3855", "#56506f", "#75686e", "#917a7b", "#b39783", "#cfaf8e", "#fedfb1",
            "#1d2c43", "#2e3d47", "#394d3c", "#4c5f33", "#58712c", "#6b842d", "#789e24", "#7fbd39",
            "#372423", "#53393a", "#784c49", "#945d4f", "#a96d58", "#bf7e63", "#d79374", "#f4a380",
            "#2d4b47", "#47655a", "#5b7b69", "#71957d", "#87ae8e", "#8ac196", "#a9d1c1", "#e0faeb",
            "#001b40", "#03315f", "#07487c", "#105da2", "#1476c0", "#4097ea", "#55b1f1", "#6dccff",
            "#554769", "#765d73", "#977488", "#b98c93", "#d5a39a", "#ebbd9d", "#ffd59b", "#fdf786",
            "#1d1d21", "#3c3151", "#584a7f", "#7964ba", "#9585f1", "#a996ec", "#baabf7", "#d1bdfe",
            "#262450", "#28335d", "#2d3d72", "#3d5083", "#5165ae", "#5274c5", "#6c82c4", "#8393c3",
            "#492129", "#5e414a", "#77535b", "#91606a", "#ad7984", "#b58b94", "#d4aeaa", "#ffe2cf",
            "#721c03", "#9c3327", "#bf5a3e", "#e98627", "#ffb108", "#ffcf05", "#fff02b", "#f7f4bf"
        ],

        // Starlit Palette: 
        starlitPalette: [
            "#1a1c2c", "#5d275d", "#b13e53", "#ef7d57", "#ffcd75", "#a7f070", "#38b764", "#257179", "#29366f", "#3b5dc9",
            "#41a6f6", "#73eff7", "#f4f4f4", "#94b0c2", "#566c86", "#333c57"
        ],

        // Steam Palette: A color scheme inspired by the muted and atmospheric tones of steam and fog.
        steamPalette: [
            "#213b25", "#3a604a", "#4f7754", "#a19f7c", "#77744f", "#775c4f",
            "#603b3a", "#3b2137", "#170e19", "#2f213b", "#433a60", "#4f5277",
            "#65738c", "#7c94a1", "#a0b9ba", "#c0d1cc"
        ],

        // Stellar Pop Palette: A vibrant and dynamic range of colors inspired by the energetic and bright hues of the cosmos.
        stellarPopPalette: [
            "#000000", "#1D2B53", "#7E2553", "#008751", "#AB5236", "#5F574F", "#C2C3C7", "#FFF1E8", "#FF004D", "#FFA300",
            "#FFEC27", "#00E436", "#29ADFF", "#83769C", "#FF77A8", "#FFCCAA"
        ],

        // Timbertones Palette: A rugged and earthy color scheme inspired by the rich textures and hues of timber and woodlands.
        timbertonesPalette: [
            "#1f240a", "#39571c", "#a58c27", "#efac28", "#efd8a1", "#ab5c1c", "#183f39", "#ef692f", "#efb775", "#a56243",
            "#773421", "#724113", "#2a1d0d", "#392a1c", "#684c3c", "#927e6a", "#276468", "#ef3a0c", "#45230d", "#3c9f9c",
            "#9b1a0a", "#36170c", "#550f0a", "#300f0a"
        ],

        // Tritanopic Palette: A vibrant color scheme with a focus on cool, aqua-inspired tones.
        tritanopicPalette: [
            "#411d31", "#631b34", "#32535f", "#0b8a8f", "#0eaf9b", "#30e1b9"
        ],

        // Twilight Palette: 
        twilightPalette: [
            "#5e315b", "#8c3f5d", "#ba6156", "#f2a65e", "#ffe478", "#cfff70", "#8fde5d", "#3ca370", "#3d6e70", "#323e4f",
            "#322947", "#473b78", "#4b5bab", "#4da6ff", "#66ffe3", "#ffffeb", "#c2c2d1", "#7e7e8f", "#606070", "#43434f",
            "#272736", "#3e2347", "#57294b", "#964253", "#e36956", "#ffb570", "#ff9166", "#eb564b", "#b0305c", "#73275c",
            "#422445", "#5a265e", "#80366b", "#bd4882", "#ff6b97", "#ffb5b5"
        ],

        // Vivid Palette: 
        vividPalette: [
            "#2e222f", "#3e3546", "#625565", "#966c6c", "#ab947a", "#694f62", "#7f708a", "#9babb2", "#c7dcd0", "#ffffff",
            "#6e2727", "#b33831", "#ea4f36", "#f57d4a", "#ae2334", "#e83b3b", "#fb6b1d", "#f79617", "#f9c22b", "#7a3045",
            "#9e4539", "#cd683d", "#e6904e", "#fbb954", "#4c3e24", "#676633", "#a2a947", "#d5e04b", "#fbff86", "#165a4c",
            "#239063", "#1ebc73", "#91db69", "#cddf6c", "#313638", "#374e4a", "#547e64", "#92a984", "#b2ba90", "#0b5e65",
            "#0b8a8f", "#0eaf9b", "#30e1b9", "#8ff8e2", "#323353", "#484a77", "#4d65b4", "#4d9be6", "#8fd3ff", "#45293f",
            "#6b3e75", "#905ea9", "#a884f3", "#eaaded", "#753c54", "#a24b6f", "#cf657f", "#ed8099", "#831c5d", "#c32454",
            "#f04f78", "#f68181", "#fca790", "#fdcbb0"
        ]
    };

    // Function to apply a selected palette (works for both desktop and mobile)
    function applyPalette(paletteName) {
        const selectedPalette = palettes[paletteName];
        const desktopColorPalette = document.querySelector('.color-palette-container .color-palette');
        const mobileColorPalette = document.querySelector('.mobile-bar .color-palette');

        // Helper function to render colors in a given palette
        function renderPalette(colorPalette) {
            // Clear existing cells
            colorPalette.innerHTML = '';

            // Add color cells
            selectedPalette.forEach((color, index) => {
                const colorCell = document.createElement('div');
                colorCell.className = 'color-cell';
                colorCell.style.backgroundColor = color;
                colorCell.dataset.colorIndex = index;
                colorPalette.appendChild(colorCell);

                // Add event listener to update the color indicator
                colorCell.addEventListener('click', function () {
                    updateColorIndicator(color);
                });
            });

            // Adjust the number of rows in the grid to fit all cells
            const totalCells = selectedPalette.length;
            const rowsNeeded = Math.ceil(totalCells / 5);
            colorPalette.style.gridTemplateRows = `repeat(${rowsNeeded}, 22px)`;
        }

        // Apply the palette to both desktop and mobile views
        if (desktopColorPalette) renderPalette(desktopColorPalette);
        if (mobileColorPalette) renderPalette(mobileColorPalette);
    }

    // Function to update the color indicator (works for both views)
    function updateColorIndicator(color) {
        const colorIndicator = document.querySelector('.color-indicator');
        const colorText = colorIndicator.querySelector('.color-text');

        colorIndicator.style.backgroundColor = color; // Update the background color
        colorIndicator.dataset.color = color; // Save color in a dataset attribute

        if (colorText) {
            colorText.textContent = color; // Update the text content of the .color-text span
        }
    }

    // Event listener for dropdown selection (same functionality)
    document.querySelectorAll('.dropdown-palettes').forEach(item => {
        item.addEventListener('click', function () {
            const selectedPalette = this.getAttribute('data-palette');
            applyPalette(selectedPalette);
        });
    });

    /* =========================================================================================================================================== */
    /*                                            Section 13.1: Select Tool - Copy/Paste                                                            */
    /* =========================================================================================================================================== */

    let clipboard = null;  // Holds the copied selectionBox and its cells

    // Function to handle copy action
    document.getElementById('copy-button').addEventListener('click', function() {
        if (selectionBox && selectedCells.length > 0) {
            clipboard = {
                selectionBox: { ...selectionBox },  // Copy the selection box dimensions and position
                cells: selectedCells.map(cell => ({
                    x: cell.x,
                    y: cell.y,
                    imageData: drawContext.getImageData(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize)  // Save the color data for each cell
                }))
            };
            console.log("Copied selection:", clipboard);
        } else {
            console.log("No selection to copy.");
        }
    });

    // Function to handle paste action
    document.getElementById('paste-button').addEventListener('click', function() {
        if (clipboard) {
            // Clear the current selectionBox
            clearSelectionBox();

            // Restore the copied selectionBox and cells
            const { selectionBox: copiedSelectionBox, cells: copiedCells } = clipboard;

            // Set the current selection box to the pasted selection
            selectionBox = { ...copiedSelectionBox };

            // Clear any previous drawn area and redraw the pasted selection box
            drawSelectionBox(selectionBox.startX, selectionBox.startY, selectionBox.width, selectionBox.height);

            // Paste the colored cells in their original positions relative to the selectionBox
            copiedCells.forEach(cell => {
                drawContext.putImageData(cell.imageData, cell.x * cellSize, cell.y * cellSize);
            });

            // Enable dragging the pasted selection
            selectedCells = copiedCells.map(cell => ({
                ...cell,
                imageData: drawContext.getImageData(cell.x * cellSize, cell.y * cellSize, cellSize, cellSize)
            }));

            console.log("Pasted selection:", clipboard);
        } else {
            console.log("No copied selection to paste.");
        }
    });

    /* =========================================================================================================================================== */
    /*                                            Section 13.2: Select Tool - Rotate Left/Right                                                     */
    /* =========================================================================================================================================== */

    // Function to rotate the selection
    function rotateSelection(direction) {
        if (!selectionBox || selectedCells.length === 0) {
            console.log("No selection to rotate.");
            return;
        }

        const { startX, startY, width, height } = selectionBox;

        // Create an off-screen canvas
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');

        // Set the size of the temp canvas to match the selection box
        tempCanvas.width = width;
        tempCanvas.height = height;

        // Extract the selected area onto the off-screen canvas
        tempContext.drawImage(
            drawCanvas,
            startX, startY, width, height,  // Source rectangle
            0, 0, width, height             // Destination rectangle
        );

        // Clear the selected area on the main canvas (inside selection box only)
        drawContext.save();
        drawContext.globalCompositeOperation = 'destination-out';
        drawContext.fillRect(startX, startY, width, height);
        drawContext.restore();

        // Rotate the off-screen canvas
        const rotatedCanvas = document.createElement('canvas');
        const rotatedContext = rotatedCanvas.getContext('2d');

        // Determine new width and height after rotation
        const rotatedWidth = height;
        const rotatedHeight = width;

        rotatedCanvas.width = rotatedWidth;
        rotatedCanvas.height = rotatedHeight;

        // Apply rotation based on the direction
        if (direction === 'left') {
            // Rotate 90 degrees to the left (counter-clockwise)
            rotatedContext.translate(0, rotatedHeight);
            rotatedContext.rotate(-Math.PI / 2);
        } else if (direction === 'right') {
            // Rotate 90 degrees to the right (clockwise)
            rotatedContext.translate(rotatedWidth, 0);
            rotatedContext.rotate(Math.PI / 2);
        }

        // Draw the extracted selection area onto the rotated canvas
        rotatedContext.drawImage(tempCanvas, 0, 0);

        // Draw the rotated image back onto the main canvas at the original position
        drawContext.drawImage(rotatedCanvas, startX, startY, rotatedWidth, rotatedHeight);

        // Update selectionBox dimensions
        selectionBox.width = rotatedWidth;
        selectionBox.height = rotatedHeight;

        // Update selectedCells positions without expanding outside the initial selection
        updateSelectedCellsAfterRotation(direction);

        // Redraw the selection box with the updated dimensions
        drawSelectionBox(selectionBox.startX, selectionBox.startY, selectionBox.width, selectionBox.height);
    }

    // Helper function to update selectedCells after rotation
    function updateSelectedCellsAfterRotation(direction) {
        const { startX, startY, width, height } = selectionBox;

        // Create a 2D array to represent the selection grid
        const grid = [];
        for (let y = 0; y < height / cellSize; y++) {
            grid[y] = [];
            for (let x = 0; x < width / cellSize; x++) {
                grid[y][x] = null;
            }
        }

        // Populate the grid with the colors from selectedCells
        selectedCells.forEach(cell => {
            const x = (cell.x * cellSize - startX) / cellSize;
            const y = (cell.y * cellSize - startY) / cellSize;
            grid[y][x] = cell.imageData;
        });

        // Rotate the grid
        let rotatedGrid;
        if (direction === 'left') {
            rotatedGrid = rotateGridLeft(grid);
        } else if (direction === 'right') {
            rotatedGrid = rotateGridRight(grid);
        }

        // Clear selectedCells and update with new positions and imageData
        selectedCells = [];
        for (let y = 0; y < rotatedGrid.length; y++) {
            for (let x = 0; x < rotatedGrid[0].length; x++) {
                const imageData = rotatedGrid[y][x];
                if (imageData) {
                    const cellX = startX / cellSize + x;
                    const cellY = startY / cellSize + y;
                    selectedCells.push({
                        x: cellX,
                        y: cellY,
                        imageData: imageData
                    });
                }
            }
        }
    }

    // Functions to rotate the grid (unchanged)
    function rotateGridLeft(grid) {
        const rows = grid.length;
        const cols = grid[0].length;
        const newGrid = [];

        for (let x = cols - 1; x >= 0; x--) {
            const newRow = [];
            for (let y = 0; y < rows; y++) {
                newRow.push(grid[y][x]);
            }
            newGrid.push(newRow);
        }

        return newGrid;
    }

    function rotateGridRight(grid) {
        const rows = grid.length;
        const cols = grid[0].length;
        const newGrid = [];

        for (let x = 0; x < cols; x++) {
            const newRow = [];
            for (let y = rows - 1; y >= 0; y--) {
                newRow.push(grid[y][x]);
            }
            newGrid.push(newRow);
        }

        return newGrid;
    }

    // Event listeners for Rotate Left and Right buttons (unchanged)
    document.getElementById('rotateLeft-button').addEventListener('click', function () {
        rotateSelection('left');
    });

    document.getElementById('rotateRight-button').addEventListener('click', function () {
        rotateSelection('right');
    });

    /* =========================================================================================================================================== */
    /*                                            Section 13.3: Select Tool - Flip Horizontal/Vertical                                              */
    /* =========================================================================================================================================== */

    // Function to flip the selection
    function flipSelection(direction) {
        if (!selectionBox || selectedCells.length === 0) {
            console.log("No selection to flip.");
            return;
        }

        const { startX, startY, width, height } = selectionBox;

        // Create an off-screen canvas
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');

        // Set the size of the temp canvas to match the selection box
        tempCanvas.width = width;
        tempCanvas.height = height;

        // Extract the selected area onto the off-screen canvas
        tempContext.drawImage(
            drawCanvas,
            startX, startY, width, height,  // Source rectangle
            0, 0, width, height             // Destination rectangle
        );

        // Clear the selected area on the main canvas (inside selection box only)
        drawContext.save();
        drawContext.globalCompositeOperation = 'destination-out';
        drawContext.fillRect(startX, startY, width, height);
        drawContext.restore();

        // Flip the off-screen canvas
        const flippedCanvas = document.createElement('canvas');
        const flippedContext = flippedCanvas.getContext('2d');

        // Set canvas size for flipping
        flippedCanvas.width = width;
        flippedCanvas.height = height;

        // Apply flip based on the direction
        if (direction === 'horizontal') {
            // Flip horizontally
            flippedContext.translate(width, 0);
            flippedContext.scale(-1, 1);
        } else if (direction === 'vertical') {
            // Flip vertically
            flippedContext.translate(0, height);
            flippedContext.scale(1, -1);
        }

        // Draw the extracted selection area onto the flipped canvas
        flippedContext.drawImage(tempCanvas, 0, 0);

        // Draw the flipped image back onto the main canvas at the original position
        drawContext.drawImage(flippedCanvas, startX, startY, width, height);

        // Update selectedCells positions without expanding outside the initial selection
        updateSelectedCellsAfterFlip(direction);

        // Redraw the selection box with the same dimensions
        drawSelectionBox(selectionBox.startX, selectionBox.startY, selectionBox.width, selectionBox.height);
    }

    // Helper function to update selectedCells after flipping
    function updateSelectedCellsAfterFlip(direction) {
        const { startX, startY, width, height } = selectionBox;

        // Create a 2D array to represent the selection grid
        const grid = [];
        for (let y = 0; y < height / cellSize; y++) {
            grid[y] = [];
            for (let x = 0; x < width / cellSize; x++) {
                grid[y][x] = null;
            }
        }

        // Populate the grid with the colors from selectedCells
        selectedCells.forEach(cell => {
            const x = (cell.x * cellSize - startX) / cellSize;
            const y = (cell.y * cellSize - startY) / cellSize;
            grid[y][x] = cell.imageData;
        });

        // Flip the grid horizontally or vertically
        let flippedGrid;
        if (direction === 'horizontal') {
            flippedGrid = flipGridHorizontal(grid);
        } else if (direction === 'vertical') {
            flippedGrid = flipGridVertical(grid);
        }

        // Clear selectedCells and update with new positions and imageData
        selectedCells = [];
        for (let y = 0; y < flippedGrid.length; y++) {
            for (let x = 0; x < flippedGrid[0].length; x++) {
                const imageData = flippedGrid[y][x];
                if (imageData) {
                    const cellX = startX / cellSize + x;
                    const cellY = startY / cellSize + y;
                    selectedCells.push({
                        x: cellX,
                        y: cellY,
                        imageData: imageData
                    });
                }
            }
        }
    }

    // Function to flip the grid horizontally
    function flipGridHorizontal(grid) {
        const rows = grid.length;
        const cols = grid[0].length;
        const newGrid = [];

        for (let y = 0; y < rows; y++) {
            const newRow = [];
            for (let x = cols - 1; x >= 0; x--) {
                newRow.push(grid[y][x]);
            }
            newGrid.push(newRow);
        }

        return newGrid;
    }

    // Function to flip the grid vertically
    function flipGridVertical(grid) {
        const rows = grid.length;
        const cols = grid[0].length;
        const newGrid = [];

        for (let y = rows - 1; y >= 0; y--) {
            newGrid.push([...grid[y]]);
        }

        return newGrid;
    }

    // Event listener for Flip Horizontal button
    document.getElementById('flipHorizontal-button').addEventListener('click', function () {
        flipSelection('horizontal');
    });

    // Event listener for Flip Vertical button
    document.getElementById('flipVertical-button').addEventListener('click', function () {
        flipSelection('vertical');
    });

    /* =========================================================================================================================================== */
    /*                                            Section 14.1: Settings Dropdown - Fullscreen Button                                              */
    /* =========================================================================================================================================== */

    // Add event listener for fullscreen change
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange); // Firefox
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange); // Chrome, Safari, Opera
    document.addEventListener('msfullscreenchange', handleFullscreenChange); // IE/Edge

    function handleFullscreenChange() {
        if (!document.fullscreenElement) {
            // Call resetScaling when exiting fullscreen
            resetScaling();
        } else {
            // Optionally, you can call applyFullscreenScaling if needed
            applyFullscreenScaling();
        }
    }

    document.getElementById('fullscreen-toggle').addEventListener('click', toggleFullscreen);

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            // Request fullscreen mode
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().then(applyFullscreenScaling);
            } else if (document.documentElement.mozRequestFullScreen) { // Firefox
                document.documentElement.mozRequestFullScreen().then(applyFullscreenScaling);
            } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
                document.documentElement.webkitRequestFullscreen().then(applyFullscreenScaling);
            } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
                document.documentElement.msRequestFullscreen().then(applyFullscreenScaling);
            }
        } else {
            // Exit fullscreen mode
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { // Firefox
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { // IE/Edge
                document.msExitFullscreen();
            }
        }
    }

    // Function to apply scaling for fullscreen mode
    function applyFullscreenScaling() {
        if (selectedOrientation === 'portrait') {
            scaleFactor = 1.20; // Scale portrait to 1.20 in fullscreen
        } else {
            scaleFactor = 1.00; // Scale landscape to 1.00 in fullscreen
        }
        resizeCanvas(); // Apply scaling when entering fullscreen
    }

    // Function to reset scaling when exiting fullscreen mode
    function resetScaling() {
        if (selectedOrientation === 'portrait') {
            scaleFactor = 1.00; // Reset portrait to 1.00 when exiting fullscreen
        } else {
            scaleFactor = 0.80; // Reset landscape to 0.80 when exiting fullscreen
        }
        resizeCanvas(); // Reset scaling after exiting fullscreen
    }

    /* =========================================================================================================================================== */
    /*                                            Section 14.2: Settings Dropdown - Background Button                                              */
    /* =========================================================================================================================================== */

        const backgroundColors = {
            default: `
                radial-gradient(circle at top left, 
                    rgba(255, 0, 55, 0.8) 0%,
                    rgba(26, 0, 58, 0.4) 40%
                ),
                radial-gradient(circle at bottom right, 
                    rgba(255, 69, 0, 0.7) 15%,
                    rgba(26, 0, 58, 0.1) 50%
                ),
                linear-gradient(290deg, 
                    #06000a 5%,
                    #190724 35%,
                    #190724 65%,
                    #06000a 100%
                )
            `,
            bluedreams: `
                rgba(3, 50, 70, 0.75)
            `,
            sprucetrail: `
                rgba(35, 51, 36, 0.85)
            `,
            autumnumber: `
                rgba(85, 75, 60, 0.85)
            `,
            darkmode: `
                black
            `
        };

        // Function to change the background color
        function changeBackground(colorKey) {
            document.body.style.background = backgroundColors[colorKey];
        }

        // Event listener for buttons
        backgroundButtons.forEach(button => {
            button.addEventListener('click', () => {
                const colorKey = button.getAttribute('data-color');
                changeBackground(colorKey);
            });
        });

        // Close popup event
        closeBackgroundPopup.addEventListener('click', () => {
            backgroundPopup.classList.add('hidden');
        });

    /* =========================================================================================================================================== */
    /*                                            Section 15: Undo - Redo Buttons                                                                  */
    /* =========================================================================================================================================== */

    function saveState() {
        // Ensure canvas dimensions are correct
        if (drawCanvas.width === 0 || drawCanvas.height === 0) {
            console.error("Canvas dimensions are invalid.");
            return;
        }
        
        if (undoStack.length >= maxHistorySize) {
            undoStack.shift(); // Remove oldest state if limit is reached
        }
        const state = drawContext.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
        undoStack.push(state);
        redoStack.length = 0; // Clear redo stack when a new action is performed
        console.log("State saved.");
    }

    function undo() {
        if (undoStack.length > 0) {
            redoStack.push(drawContext.getImageData(0, 0, drawCanvas.width, drawCanvas.height));
            const previousState = undoStack.pop();
            drawContext.putImageData(previousState, 0, 0);
            console.log("Undo performed.");
        } else {
            console.log("No states to undo.");
        }
    }

    function redo() {
        if (redoStack.length > 0) {
            undoStack.push(drawContext.getImageData(0, 0, drawCanvas.width, drawCanvas.height));
            const nextState = redoStack.pop();
            drawContext.putImageData(nextState, 0, 0);
            console.log("Redo performed.");
        } else {
            console.log("No states to redo.");
        }
    }

    // Add event listeners to the buttons
    document.querySelector('.undo-button').addEventListener('click', function() {
        undo();
    });

    document.querySelector('.redo-button').addEventListener('click', function() {
        redo();
    });

    /* =========================================================================================================================================== */
    /*                                            Section 16: RGB Color Picker                                                                     */
    /* =========================================================================================================================================== */
        const colorBox = document.querySelector('.color-box');
        const colorCircle = document.querySelector('.color-circle');
        const colorSpectrum = document.querySelector('.color-spectrum');
        const spectrumThumb = document.querySelector('.spectrum-thumb');
        const colorDisplay = document.getElementById('colorDisplay');
        const hexValue = document.getElementById('hexValue');
        const rgbValue = document.getElementById('rgbValue');
        const hslValue = document.getElementById('hslValue');
        const hexInput = document.getElementById('hexInput');
        const colorIndicator = document.querySelector('.color-indicator');
        const colorText = colorIndicator.querySelector('.color-text');
        const rgbButton = document.querySelector('.rgb-button');
        const colorCells = document.querySelectorAll('.rgb-cell'); // Color cells

        // Color Values
        let currentHue = 0;
        let currentSaturation = 100;
        let currentBrightness = 50;
        let mouseIsDown = false;
        let colorHistory = [];

        function updateColorDisplay(rgb) {
            colorDisplay.style.backgroundColor = rgb;
        }

        function updateColorFromPosition(x, y, shouldUpdateHistory = false) {
            const saturation = (x / colorBox.clientWidth) * 100;
            const brightness = 100 - (y / colorBox.clientHeight) * 100;
            currentSaturation = Math.max(0, Math.min(100, saturation));
            currentBrightness = Math.max(0, Math.min(100, brightness));

            const rgb = hsbToRgb(currentHue, currentSaturation, currentBrightness);
            const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
            const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

            hexValue.textContent = hex;
            rgbValue.textContent = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
            hslValue.textContent = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;

            updateColorDisplay(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
            updateColorIndicator(hex); // Update the color indicator

            colorCircle.style.left = `${x}px`;
            colorCircle.style.top = `${y}px`;

            if (shouldUpdateHistory) {
                addColorToHistory(hex);
            }
        }

        function updateColorIndicator(color) {
            colorIndicator.style.backgroundColor = color;
            colorIndicator.dataset.color = color; // Save color in a dataset attribute

            // Update the text content of the .color-text span
            if (colorText) {
                colorText.textContent = color; // Display the hex value in the .color-text span
            }
        }

        function updateColorHistoryDisplay() {
            colorCells.forEach((cell, index) => {
                const color = colorHistory[index] || 'transparent'; // Default to transparent if no color
                cell.style.backgroundColor = color;
            });
        }

        function addColorToHistory(hex) {
            // Remove the color if it already exists
            const index = colorHistory.indexOf(hex);
            if (index !== -1) {
                colorHistory.splice(index, 1);
            }

            // Add the color to the front of the history
            colorHistory.unshift(hex);

            // Ensure history doesn't exceed 5 colors
            if (colorHistory.length > 5) {
                colorHistory.length = 5; // Trim to the latest 5 colors
            }

            // Update the color history display
            updateColorHistoryDisplay();
        }

        function hsbToRgb(h, s, v) {
            s /= 100;
            v /= 100;
            let k = (n) => (n + h / 60) % 6;
            let f = (n) => v - v * s * Math.max(Math.min(k(n), 4 - k(n), 1), 0);
            return {
                r: Math.round(f(5) * 255),
                g: Math.round(f(3) * 255),
                b: Math.round(f(1) * 255)
            };
        }

        function rgbToHex(r, g, b) {
            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
        }

        function rgbToHsl(r, g, b) {
            r /= 255, g /= 255, b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }

            return {
                h: Math.round(h * 360),
                s: Math.round(s * 100),
                l: Math.round(l * 100)
            };
        }

        function hexToRgb(hex) {
            let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });
        
            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }

        function updateHueFromPosition(y) {
            const spectrumRect = colorSpectrum.getBoundingClientRect();
            const thumbHeight = spectrumThumb.offsetHeight;
            
            // Clamp the position of the thumb
            const clampedY = Math.max(0, Math.min(y, spectrumRect.height));

            currentHue = (clampedY / spectrumRect.height) * 360;
            const hslColor = `hsl(${currentHue}, 100%, 50%)`;
            colorBox.style.background = `linear-gradient(to top, black, rgba(0, 0, 0, 0)), 
                                        linear-gradient(to right, white, ${hslColor})`;
            spectrumThumb.style.top = `${clampedY}px`;
        }

        colorBox.addEventListener('mousedown', function(e) {
            mouseIsDown = true;
            const rect = colorBox.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            updateColorFromPosition(x, y, false);

            function mouseMoveHandler(e) {
                if (mouseIsDown) {
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    updateColorFromPosition(x, y, false);
                }
            }

            function mouseUpHandler() {
                if (mouseIsDown) {
                    updateColorFromPosition(colorCircle.offsetLeft, colorCircle.offsetTop, true); // Update history
                    mouseIsDown = false;
                }
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            }

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });

        colorSpectrum.addEventListener('mousedown', function(e) {
            mouseIsDown = true;
            const rect = colorSpectrum.getBoundingClientRect();
            const y = e.clientY - rect.top;
            updateHueFromPosition(y);
            updateColorFromPosition(colorCircle.offsetLeft, colorCircle.offsetTop, false); // Update based on hue change

            function mouseMoveHandler(e) {
                if (mouseIsDown) {
                    const y = e.clientY - rect.top;
                    updateHueFromPosition(y);
                    updateColorFromPosition(colorCircle.offsetLeft, colorCircle.offsetTop, false);
                }
            }

            function mouseUpHandler() {
                mouseIsDown = false;
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            }

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });

        rgbButton.addEventListener('click', function() {
            if (colorHistory.length > 0) {
                const lastColor = colorHistory[0]; // Get the last selected color
                if (lastColor) {
                    updateColorIndicator(lastColor);
                }
            }
        });

        // Add event listeners for rgb-cells to update the selected color
        colorCells.forEach((cell, index) => {
            cell.addEventListener('click', function() {
                const color = colorHistory[index];
                if (color) {
                    updateColorIndicator(color);
                    addColorToHistory(color); // Move selected color to the front
                }
            });
        });

    /* =========================================================================================================================================== */
    /*                                            Section 0.1: Initialization Apply                                                                */
    /* =========================================================================================================================================== */

    drawCheckerboard();
    applyPalette('defaultPalette');
};