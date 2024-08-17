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
/*                                                Section 3: Pencil Tool                                                                       */
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
/*                                                Section 4: Line Tool                                                                        */
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