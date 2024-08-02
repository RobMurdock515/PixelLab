// Monochrome Palette: A color scheme featuring varying shades of black and gray, with subtle accents.

const monochromePalette = [
    "#08141e", "#0f2a3f", "#20394f", "#f6d6bd", "#c3a38a", "#997577",
    "#816271", "#4e495f"
];

// Function to apply the Monochrome palette colors to the grid
function applyMonochromePalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = monochromePalette[index];
    });
}
