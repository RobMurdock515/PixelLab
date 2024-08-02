// Timbertones Palette: A rugged and earthy color scheme inspired by the rich textures and hues of timber and woodlands.

const timbertonesPalette = [
    "#1f240a", "#39571c", "#a58c27", "#efac28", "#efd8a1", "#ab5c1c", "#183f39", "#ef692f", "#efb775", "#a56243",
    "#773421", "#724113", "#2a1d0d", "#392a1c", "#684c3c", "#927e6a", "#276468", "#ef3a0c", "#45230d", "#3c9f9c",
    "#9b1a0a", "#36170c", "#550f0a", "#300f0a"
];

// Function to apply the Timbertones palette colors to the grid
function applyTimbertonesPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = timbertonesPalette[index];
    });
}
