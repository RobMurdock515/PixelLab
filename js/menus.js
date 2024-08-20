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

// Track selected size and orientation
let selectedSize = null;
let selectedOrientation = '1:1';

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
        }
    });
});

// Event listener for orientation radio buttons
document.querySelectorAll('input[name="orientation"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        selectedOrientation = this.value;
    });
});

// Apply the selected size and orientation
function applyResize() {
    if (selectedOrientation === 'portrait') {
        window.setCanvasSize(640, 640);
    } else if (selectedOrientation === 'landscape') {
        window.setCanvasSize(1080, 720);
    }

    if (selectedSize) {
        window.resizeCanvas(selectedSize);
    }
    
    closeResizePopup();
    selectedSize = null; // Reset selected size
}

// Event listener for the Apply button
document.querySelector('.popup-footer .apply-btn').addEventListener('click', function() {
    applyResize();
});

// Expose the applyResize function to other scripts
window.applyResize = applyResize;
