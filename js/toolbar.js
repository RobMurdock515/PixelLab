/* =========================================================================================================================================== */
/*                                             Toolbar Button - Activation/Toggle                                                             */
/* =========================================================================================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const toolbarButtons = document.querySelectorAll('.toolbar-button');
    const selectedToolDisplay = document.getElementById('selected-tool');

    let currentTool = 'pencil'; // Default tool
    let currentColor = '#000000'; // Default color

    toolbarButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'selected' class from all buttons
            toolbarButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add 'selected' class to the clicked button
            button.classList.add('selected');
            
            // Update the selected tool display
            const tool = button.getAttribute('data-tool');
            selectedToolDisplay.textContent = tool.charAt(0).toUpperCase() + tool.slice(1);
            
            // Set the current tool
            currentTool = tool;
            
            // Optional: Handle tool activation logic here
            activateTool(tool);
        });
    });

    function activateTool(tool) {
        console.log(`Tool activated: ${tool}`);
    }

    // Function to get the current color from the color-indicator
    function getCurrentColor() {
        return currentColor;
    }

    // Event listener for color changes
    document.querySelector('.color-indicator').addEventListener('change', (event) => {
        currentColor = event.target.value; // Assuming the color value is directly accessible
    });

    // Make sure the current tool and color are accessible
    window.getCurrentTool = () => currentTool;
    window.getCurrentColor = () => currentColor;
});

/* =========================================================================================================================================== */
/*                                            Tool Settings Bar - Pixel Size/Strength Slider                                                */
/* =========================================================================================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const pixelSizeInput = document.getElementById('pixel-size');
    const pixelSizeValue = document.getElementById('pixel-size-value');
    const pixelStrengthInput = document.getElementById('pixel-strength');
    const pixelStrengthValue = document.getElementById('pixel-strength-value');

    pixelSizeInput.addEventListener('input', () => {
        pixelSizeValue.textContent = pixelSizeInput.value;
        // Optional: Update pixel size in your application
        console.log(`Pixel size: ${pixelSizeInput.value}`);
    });

    pixelStrengthInput.addEventListener('input', () => {
        pixelStrengthValue.textContent = pixelStrengthInput.value;
        // Optional: Update pixel strength in your application
        console.log(`Pixel strength: ${pixelStrengthInput.value}`);
    });
});

/* =========================================================================================================================================== */
/*                                                        Toolbar Tool - Pencil                                                                */
/* =========================================================================================================================================== */

// Assuming you have the canvas drawing functionality in another script (canvas.js)
// Make sure to integrate the drawing logic properly with the pencil tool
