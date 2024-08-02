// Dungeon Palette: A rich and moody color scheme with deep, earthy tones and striking accents.

const dungeonPalette = [
    "#2e222f", "#45293f", "#7a3045", "#993d41", "#cd683d", "#fbb954",
    "#f2ec8b", "#b0a987", "#997f73", "#665964", "#443846", "#576069",
    "#788a87", "#a9b2a2"
];

// Function to apply the Dungeon palette colors to the grid
function applyDungeonPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = dungeonPalette[index];
    });
}
