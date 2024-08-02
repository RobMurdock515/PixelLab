// Mist

const mistPalette = [
    "#10121c", "#2c1e31", "#6b2643", "#ac2847", "#ec273f", "#94493a", "#de5d3a", "#e98537", "#f3a833", "#4d3533",
    "#6e4c30", "#a26d3f", "#ce9248", "#dab163", "#e8d282", "#f7f3b7", "#1e4044", "#006554", "#26854c", "#5ab552",
    "#9de64e", "#008b8b", "#62a477", "#a6cb96", "#d3eed3", "#3e3b65", "#3859b3", "#3388de", "#36c5f4", "#6dead6",
    "#5e5b8c", "#8c78a5", "#b0a7b8", "#deceed", "#9a4d76", "#c878af", "#cc99ff", "#fa6e79", "#ffa2ac", "#ffd1d5",
    "#f6e8e0", "#ffffff"
];

// Function to apply the vivid palette colors to the grid
function applyMistPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = mistPalette[index];
    });
}
