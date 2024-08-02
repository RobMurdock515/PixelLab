// Paperback Palette: A minimal color scheme with soft, muted tones and deep accents.

const paperbackPalette = [
    "#b8c2b9", "#382b26"
];

// Function to apply the Paperback palette colors to the grid
function applyPaperbackPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = paperbackPalette[index];
    });
}
