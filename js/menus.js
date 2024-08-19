/* =========================================================================================================================================== */
/*                                                Section 1: File Buttons                                                                      */
/* =========================================================================================================================================== */

// Show resize pop-up
function showResizePopup() {
    document.getElementById('resizePopup').style.display = 'block';
}

// Close resize pop-up
function closeResizePopup() {
    document.getElementById('resizePopup').style.display = 'none';
}

// Event listener for "Resize Canvas" button
document.getElementById('resizeCanvasButton').addEventListener('click', function(event) {
    event.stopPropagation();
    showResizePopup();
});

// Close resize popup when clicking outside
document.addEventListener('click', function(event) {
    if (!document.getElementById('resizePopup').contains(event.target) &&
        !document.getElementById('resizeCanvasButton').contains(event.target)) {
        closeResizePopup();
    }
});

// Track selected size and previous size
let selectedSize = null;
let previousSize = null;

// Event listeners for grid size buttons
document.querySelectorAll('.size-options button').forEach(function(button) {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.size-options button').forEach(btn => btn.classList.remove('active-button'));

        // Add active class to the clicked button
        this.classList.add('active-button');
        
        // Handle grid size selection
        const newSize = parseInt(this.textContent); // Assuming the button text is the new size
        if ([16, 32, 64, 128].includes(newSize)) {
            selectedSize = newSize;
            previousSize = window.cellSize; // Save the current size
        }
    });
});

// Apply the selected size
function applyResize() {
    if (selectedSize) {
        window.resizeCanvas(selectedSize);
        closeResizePopup();
        selectedSize = null; // Reset selected size
    }
}

// Event listener for the Apply button
document.querySelector('.popup-footer button').addEventListener('click', function() {
    applyResize();
});

// Expose the applyResize function to other scripts
window.applyResize = applyResize;
