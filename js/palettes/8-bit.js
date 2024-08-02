// 8-Bit Palette: A vibrant and retro color scheme inspired by classic 8-bit graphics.

const bitPalette = [
    "#000000", "#fcfcfc", "#f8f8f8", "#bcbcbc", "#7c7c7c", "#a4e4fc",
    "#3cbcfc", "#0078f8", "#0000fc", "#b8b8f8", "#6888fc", "#0058f8",
    "#0000bc", "#d8b8f8", "#9878f8", "#6844fc", "#4428bc", "#f8b8f8",
    "#f878f8", "#d800cc", "#940084", "#f8a4c0", "#f85898", "#e40058",
    "#a80020", "#f0d0b0", "#f87858", "#f83800", "#a81000", "#fce0a8",
    "#fca044", "#e45c10", "#881400", "#f8d878", "#f8b800", "#ac7c00",
    "#503000", "#d8f878", "#b8f818", "#00b800", "#007800", "#b8f8b8",
    "#58d854", "#00a800", "#006800", "#b8f8d8", "#58f898", "#00a844",
    "#005800", "#00fcfc", "#00e8d8", "#008888", "#004058", "#f8d8f8",
    "#787878"
];

// Function to apply the 8-Bit palette colors to the grid
function applyBitPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = bitPalette[index];
    });
}
