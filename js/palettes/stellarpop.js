// Stellar Pop Palette: A vibrant and dynamic range of colors inspired by the energetic and bright hues of the cosmos.

const stellarPopPalette = [
    "#000000", "#1D2B53", "#7E2553", "#008751", "#AB5236", "#5F574F", "#C2C3C7", "#FFF1E8", "#FF004D", "#FFA300",
    "#FFEC27", "#00E436", "#29ADFF", "#83769C", "#FF77A8", "#FFCCAA"
];

// Function to apply the Stellar Pop palette colors to the grid
function applyStellarPopPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = stellarPopPalette[index];
    });
}
