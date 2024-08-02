// Indie2 Palette: A vibrant and eclectic color scheme featuring a diverse range of bright and bold tones.

const indie2Palette = [
    "#8cffde", "#45b8b3", "#839740", "#c9ec85", "#46c657", "#158968",
    "#2c5b6d", "#222a5c", "#566a89", "#8babbf", "#cce2e1", "#ffdba5",
    "#ccac68", "#a36d3e", "#683c34", "#000000", "#38002c", "#663b93",
    "#8b72de", "#9cd8fc", "#5e96dd", "#3953c0", "#800c53", "#c34b91",
    "#ff94b3", "#bd1f3f", "#ec614a", "#ffa468", "#fff6ae", "#ffda70",
    "#f4b03c", "#ffffff"
];

// Function to apply the Indie2 palette colors to the grid
function applyIndie2Palette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = indie2Palette[index];
    });
}
