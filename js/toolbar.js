/* =========================================================================================================================================== */
/*                                             Section 0: Activating/Selecting a Button                                                        */
/* =========================================================================================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const toolbarButtons = document.querySelectorAll('.toolbar-button');
    const selectedToolDisplay = document.getElementById('selected-tool');

    toolbarButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Check if the clicked button is already selected
            const isSelected = button.classList.contains('selected');

            // Remove 'selected' class from all buttons
            toolbarButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Update the selected tool display only if the button is not being deselected
            if (!isSelected) {
                button.classList.add('selected');
                const tool = button.getAttribute('data-tool');
                selectedToolDisplay.textContent = tool.charAt(0).toUpperCase() + tool.slice(1);
            } else {
                // Clear the tool display if deselected
                selectedToolDisplay.textContent = '';
            }
        });
    });
});

/* =========================================================================================================================================== */
/*                                              Section 1: Pixel Size and Strength Settings                                                    */
/* =========================================================================================================================================== */


/* =========================================================================================================================================== */
/*                                              Section 2: Pencil Tool                                                                         */
/* =========================================================================================================================================== */

