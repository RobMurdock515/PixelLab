

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

  // Function to get the current color from the .color-indicator
function getCurrentColor() {
    const colorIndicator = document.querySelector('.color-indicator');
    return colorIndicator ? colorIndicator.style.backgroundColor : null; // Return null if no color is set
  }
  
  // Function to draw on the canvas
  function drawOnCanvas(row, col) {
    if (ctx) {
      ctx.fillStyle = getCurrentColor(); // Function to get the current color from the .color-indicator
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  }
  