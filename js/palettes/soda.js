// Soda Palette: A refreshing color scheme with vibrant blues, soft pinks, and a hint of pastel.

const sodaPalette = [
    "#2176cc", "#ff7d6e", "#fca6ac", "#e8e7cb"
];

// Function to apply the Soda palette colors to the grid
function applySodaPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = sodaPalette[index];
    });
}
