// Bitter Palette: A color scheme featuring deep, moody tones with a touch of warmth.

const bitterPalette = [
    "#282328", "#545c7e", "#c56981", "#a3a29a"
];

// Function to apply the Bitter palette colors to the grid
function applyBitterPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = bitterPalette[index];
    });
}
