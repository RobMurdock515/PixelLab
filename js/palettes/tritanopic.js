// Tritanopic Palette: A vibrant color scheme with a focus on cool, aqua-inspired tones.

const tritanopicPalette = [
    "#411d31", "#631b34", "#32535f", "#0b8a8f", "#0eaf9b", "#30e1b9"
];

// Function to apply the Tritanopic palette colors to the grid
function applyTritanopicPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = tritanopicPalette[index];
    });
}
