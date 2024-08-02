// Murky Palette: A color scheme featuring deep, earthy tones with a subdued and mysterious feel.

const murkyPalette = [
    "#a6884a", "#906c30", "#825337", "#83473d", "#66352e", "#562923",
    "#612638", "#46332c", "#323230", "#3e4055", "#382d35", "#323b42",
    "#1f2d36", "#141f25", "#0b1016", "#245273", "#4e7499", "#5e7e8b",
    "#798a92", "#879ea3", "#e3ddd1", "#bdbbae", "#af9e94", "#907c75",
    "#a29f7e", "#969372", "#78735d", "#696353", "#4f493b", "#212528",
    "#595c55", "#4b4e4f", "#57562a", "#675f30", "#727234", "#73804b",
    "#5f7b53", "#3b6d62", "#32534a"
];

// Function to apply the Murky palette colors to the grid
function applyMurkyPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = murkyPalette[index];
    });
}