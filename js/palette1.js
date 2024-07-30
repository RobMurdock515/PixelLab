// palette1.js

// Define the color palette
const colorPalette = [
    '#FF5733', '#33FF57', '#3357FF', '#F4C300', '#9900FF',
    '#00FFFF', '#FF00FF', '#FFC0CB', '#00FF00', '#0000FF',
    '#8A2BE2', '#7FFF00', '#D2691E', '#FF7F50', '#6495ED',
    '#DC143C', '#00FFFF', '#00008B', '#008B8B', '#B8860B',
    '#A9A9A9', '#006400', '#BDB76B', '#8B008B', '#556B2F'
];

// Function to initialize the color palette
function initializeColorPalette() {
    // Get all color cells
    const colorCells = document.querySelectorAll('.color-cell');
    
    // Iterate over the color cells and set background color
    colorCells.forEach((cell, index) => {
        if (index < colorPalette.length) {
            cell.style.backgroundColor = colorPalette[index];
            cell.dataset.color = colorPalette[index]; // Set color data attribute
        }
    });
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', initializeColorPalette);
