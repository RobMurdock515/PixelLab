// Astral Palette

const astralPalette = [
    "#000000", "#6f6776", "#9a9a97", "#c5ccb8", "#8b5580", "#c38890", "#a593a5", "#666092", "#9a4f50", "#c28d75",
    "#7ca1c0", "#416aa3", "#8d6268", "#be955c", "#68aca9", "#387080", "#6e6962", "#93a167", "#6eaa78", "#557064",
    "#9d9f7f", "#7e9e99", "#5d6872", "#433455"
];

// Function to apply the Astral palette colors to the grid
function applyAstralPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = astralPalette[index];
    });
}