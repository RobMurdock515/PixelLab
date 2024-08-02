// Siren Palette: A refined and elegant color scheme inspired by the deep, rich hues of oil paints.

const sirenPalette = [
    "#e0e2e3", "#b5a4a2", "#a58d8a", "#7a4c6d", "#3f3c61", "#1d1e3a"
];

// Function to apply the Siren palette colors to the grid
function applySirenPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = sirenPalette[index];
    });
}
