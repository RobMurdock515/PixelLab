/* Dusk Palette */

const duskPalette = [
    "#0d2b45", "#203c56", "#544e68", "#8d697a", "#d08159", "#ffaa5e", "#ffd4a3", "#ffecd6"
];

// Function to apply the dusk palette colors to the grid
function applyDuskPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = duskPalette[index];
    });
}
