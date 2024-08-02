// Nature Palette: A color scheme inspired by the rich and varied hues found in natural landscapes.

const naturePalette = [
    "#636663", "#87857c", "#bcad9f", "#f2b888", "#eb9661", "#b55945",
    "#734c44", "#3d3333", "#593e47", "#7a5859", "#a57855", "#de9f47",
    "#fdd179", "#fee1b8", "#d4c692", "#a6b04f", "#819447", "#44702d",
    "#2f4d2f", "#546756", "#89a477", "#a4c5af", "#cae6d9", "#f1f6f0",
    "#d5d6db", "#bbc3d0", "#96a9c1", "#6c81a1", "#405273", "#303843",
    "#14233a"
];

// Function to apply the Nature palette colors to the grid
function applyNaturePalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = naturePalette[index];
    });
}
