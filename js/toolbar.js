/* =========================================================================================================================================== */
/*                                                  Toolbar Button - Activation/Toggle                                                         */
/* =========================================================================================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const toolbarButtons = document.querySelectorAll('.toolbar-button');
    
    toolbarButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'selected' class from all buttons
            toolbarButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add 'selected' class to the clicked button
            button.classList.add('selected');
            
            // Optional: Handle tool activation logic here
            const tool = button.getAttribute('data-tool');
            activateTool(tool);
        });
    });
    
    function activateTool(tool) {
        // Your tool activation logic here (e.g., setting the current tool)
        console.log(`Tool activated: ${tool}`);
    }
});


/* =========================================================================================================================================== */
/*                                                  Tool Settings Bar - Show Selected Tool                                                     */
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
            
            // Optional: Handle tool activation logic here
            activateTool(tool);
        });
    });

    function activateTool(tool) {
        console.log(`Tool activated: ${tool}`);
    }
});

/* =========================================================================================================================================== */
/*                                                  Tool Settings Bar - Pixel Size/Strength                                                    */
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
