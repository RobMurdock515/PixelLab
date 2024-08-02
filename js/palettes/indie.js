// Indie Palette: A color scheme with a vintage, artistic feel featuring rich, earthy tones.

const indiePalette = [
    "#d1b187", "#c77b58", "#ae5d40", "#79444a", "#4b3d44", "#ba9158",
    "#927441", "#4d4539", "#77743b", "#b3a555", "#d2c9a5", "#8caba1",
    "#4b726e", "#574852", "#847875", "#ab9b8e"
];

// Function to apply the Indie palette colors to the grid
function applyIndiePalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = indiePalette[index];
    });
}
