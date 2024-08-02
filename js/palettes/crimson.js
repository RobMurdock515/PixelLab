// Crimson Palette: A bold and striking color scheme with intense reds and vibrant blues.

const crimsonPalette = [
    "#ff0546", "#9c173b", "#660f31", "#450327", "#270022", "#17001d",
    "#09010d", "#0ce6f2", "#0098db", "#1e579c"
];

// Function to apply the Crimson palette colors to the grid
function applyCrimsonPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = crimsonPalette[index];
    });
}
