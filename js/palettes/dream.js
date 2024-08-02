// Dream Palette: A whimsical color scheme with dreamy purples, pinks, and soft pastels.

const dreamPalette = [
    "#3c42c4", "#6e51c8", "#a065cd", "#ce79d2", "#d68fb8", "#dda2a3",
    "#eac4ae", "#f4dfbe"
];

// Function to apply the Dream palette colors to the grid
function applyDreamPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = dreamPalette[index];
    });
}
