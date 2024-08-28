/* =========================================================================================================================================== */
/*                                             Section 0: Activating/Selecting a Button                                                        */
/* =========================================================================================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const toolbarButtons = document.querySelectorAll('.toolbar-button');
    const selectedToolDisplay = document.getElementById('selected-tool');

    toolbarButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Check if the clicked button is already selected
            const isSelected = button.classList.contains('selected');

            // Remove 'selected' class from all buttons
            toolbarButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Update the selected tool display only if the button is not being deselected
            if (!isSelected) {
                button.classList.add('selected');
                const tool = button.getAttribute('data-tool');
                selectedToolDisplay.textContent = tool.charAt(0).toUpperCase() + tool.slice(1);
            } else {
                // Clear the tool display if deselected
                selectedToolDisplay.textContent = '';
            }
        });
    });
});

/* =========================================================================================================================================== */
/*                                              Section 1: Pixel Size and Strength Settings                                                    */
/* =========================================================================================================================================== */

// Section 1: Pixel Size and Strength Settings
const pixelSizeInput = document.getElementById('pixel-size');
const pixelSizeValue = document.getElementById('pixel-size-value');
const pixelStrengthInput = document.getElementById('pixel-strength');
const pixelStrengthValue = document.getElementById('pixel-strength-value');

// Set default values
pixelSizeValue.textContent = pixelSizeInput.value;
pixelStrengthValue.textContent = pixelStrengthInput.value;

// Update pixel size
pixelSizeInput.addEventListener('input', () => {
    pixelSizeValue.textContent = pixelSizeInput.value;
    handlePixelSizeChange(Number(pixelSizeInput.value));
});

// Update pixel strength
pixelStrengthInput.addEventListener('input', () => {
    pixelStrengthValue.textContent = pixelStrengthInput.value;
    updatePixelStrength(Number(pixelStrengthInput.value));
});

function handlePixelSizeChange(size) {
    // Ensure pencil size is within valid range
    if (size > maxPencilSize) {
        size = maxPencilSize;
    }
    pencilSize = size;
    brushSize = pencilSize;
    // Update the canvas or brush size if needed
}

function updatePixelStrength(strength) {
    // Normalize strength to a value between 0 and 1
    const opacity = 1 - strength; // Inverse relationship for opacity
    // Update the pencil or brush opacity if needed
    // For example, update a CSS class or inline style for the brush
}

/* =========================================================================================================================================== */
/*                                              Section 2: Pencil Tool                                                                         */
/* =========================================================================================================================================== */

const pencilToolButton = document.querySelector('[data-tool="pencil"]');
const maxPencilSize = 12;
const defaultPencilSize = 1;

// Set default size for pencil tool
let pencilSize = defaultPencilSize;

// Event listener to update the tool and size
pencilToolButton.addEventListener('click', () => {
    currentTool = 'pencil';
    brushSize = pencilSize;
    toolDisplay.textContent = 'Pencil Tool';
});

// Function to update pencil size
function updatePencilSize(size) {
    if (size > maxPencilSize) {
        size = maxPencilSize;
    }
    pencilSize = size;
    brushSize = pencilSize;
}

// Example function to handle pixel size changes
function handlePixelSizeChange(newSize) {
    updatePencilSize(newSize);
    // Update the canvas or brush size if needed
}
