// Gameboy Palette: A nostalgic color scheme inspired by classic Gameboy graphics with muted and vibrant tones.

const gameboyPalette = [
    "#eff9d6", "#ba5044", "#7a1c4b", "#1b0326"
];

// Function to apply the Gameboy palette colors to the grid
function applyGameboyPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = gameboyPalette[index];
    });
}
