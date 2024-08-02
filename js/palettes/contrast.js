// Contrast Palette: A high-contrast color scheme featuring bold and subtle shades.

const contrastPalette = [
    "#222323", "#f0f6f0"
];

// Function to apply the Contrast palette colors to the grid
function applyContrastPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = contrastPalette[index];
    });
}
