// defaultPalette.js

// Array holding the color values for the default palette
const defaultColors = [
    '#000000', '#12173d', '#293268', '#464b8c', '#6b74b2',
    '#909edd', '#c1d9f2', '#ffffff', '#a293c4', '#7b6aa5',
    '#53427f', '#3c2c68', '#431e66', '#5d2f8c', '#854cbf',
    '#b483ef', '#8cff9b', '#42bc7f', '#22896e', '#14665b',
    '#0f4a4c', '#0a2a33', '#1d1a59', '#322d89', '#354ab2',
    '#3e83d1', '#50b9eb', '#8cdaff', '#53a1ad', '#3b768f',
    '#21526b', '#163755', '#008782', '#00aaa5', '#27d3cb',
    '#78fae6', '#cdc599', '#988f64', '#5c5d41', '#353f23',
    '#919b45', '#afd370', '#ffe091', '#ffaa6e', '#ff695a',
    '#b23c40', '#ff6675', '#dd3745', '#a52639', '#721c2f',
    '#b22e69', '#e54286', '#ff6eaf', '#ffa5d5', '#ffd3ad',
    '#cc817a', '#895654', '#61393b', '#3f1f3c', '#723352',
    '#994c69', '#c37289', '#f29faa', '#ffccd0'
];

// Function to apply the default palette to the color cells
function applyDefaultPalette() {
    const colorCells = document.querySelectorAll('.color-cell');
    colorCells.forEach((cell, index) => {
        cell.style.backgroundColor = defaultColors[index];
    });
}

// Call the function to set the default palette on page load
window.onload = function() {
    applyDefaultPalette();
};
