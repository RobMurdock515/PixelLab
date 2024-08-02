// Oil Palette: A refined and elegant color scheme inspired by the deep, rich hues of oil paints.

const oilPalette = [
    "#fbf5ef", "#f2d3ab", "#c69fa5", "#8b6d9c", "#494d7e", "#272744"
];

// Function to apply the Oil palette colors to the grid
function applyOilPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = oilPalette[index];
    });
}
