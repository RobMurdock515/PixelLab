// Steam Palette: A color scheme inspired by the muted and atmospheric tones of steam and fog.

const steamPalette = [
    "#213b25", "#3a604a", "#4f7754", "#a19f7c", "#77744f", "#775c4f",
    "#603b3a", "#3b2137", "#170e19", "#2f213b", "#433a60", "#4f5277",
    "#65738c", "#7c94a1", "#a0b9ba", "#c0d1cc"
];

// Function to apply the Steam palette colors to the grid
function applySteamPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = steamPalette[index];
    });
}
