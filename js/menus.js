/* =========================================================================================================================================== */
/*                                                Section 1: File Buttons                                                                      */
/* =========================================================================================================================================== */

// Resize Canvas Button - Functionality
function showResizePopup() {
    const existingPopup = document.querySelector('.resize-popup');
    if (!existingPopup) {
        createResizePopup(); // Create the popup if it does not already exist
    }
    const popup = document.querySelector('.resize-popup');
    popup.style.display = 'block';
}

// Function to close the resize pop-up box
function closeResizePopup() {
    const popup = document.querySelector('.resize-popup');
    if (popup) {
        popup.style.display = 'none';
    }
}

// Function to create the resize pop-up box HTML structure
function createResizePopup() {
    const popup = document.createElement('div');
    popup.className = 'resize-popup';
    popup.style.display = 'none'; // Ensure it's hidden initially
    popup.style.position = 'absolute'; // Ensure it's positioned relative to the page
    popup.style.backgroundColor = 'white'; // Set a background color for visibility
    popup.style.border = '1px solid black'; // Optional: Add a border for visibility
    popup.style.padding = '10px'; // Optional: Add padding for spacing
    popup.style.zIndex = '1000'; // Ensure it appears above other content

    // Grid size buttons
    const sizes = [16, 32, 64, 128];
    sizes.forEach(size => {
        const button = document.createElement('button');
        button.textContent = `${size}x${size}`;
        button.addEventListener('click', () => resizeCanvas(size, size));
        popup.appendChild(button);
    });

    // Portrait/Landscape options
    const orientationLabel = document.createElement('label');
    orientationLabel.textContent = 'Orientation: ';
    popup.appendChild(orientationLabel);

    const portraitOption = document.createElement('input');
    portraitOption.type = 'radio';
    portraitOption.name = 'orientation';
    portraitOption.value = 'portrait';
    portraitOption.checked = true;
    portraitOption.addEventListener('change', updateOrientation);
    popup.appendChild(portraitOption);
    popup.appendChild(document.createTextNode('Portrait'));

    const landscapeOption = document.createElement('input');
    landscapeOption.type = 'radio';
    landscapeOption.name = 'orientation';
    landscapeOption.value = 'landscape';
    landscapeOption.addEventListener('change', updateOrientation);
    popup.appendChild(landscapeOption);
    popup.appendChild(document.createTextNode('Landscape'));

    document.body.appendChild(popup);
}

// Handle "Resize Canvas" selection
function setupResizeCanvasMenu() {
    const resizeCanvasButton = document.querySelector('.dropdown-file .dropdown-item:nth-child(3)'); // Adjust selector if needed
    resizeCanvasButton.addEventListener('click', function(event) {
        event.stopPropagation();
        showResizePopup();
    });
}

// Close pop-up if clicking outside of it
window.addEventListener('click', function(event) {
    if (!event.target.matches('.dropdown-file .dropdown-item:nth-child(3)') &&
        !event.target.closest('.resize-popup')) {
        closeResizePopup();
    }
});

// Initialize setup
setupResizeCanvasMenu();
