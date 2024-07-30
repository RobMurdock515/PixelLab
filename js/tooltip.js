/* Javascript Tooltip Delay */

document.addEventListener('DOMContentLoaded', function() {
    const toolbarButtons = document.querySelectorAll('.toolbar-button, .color-button');
    const timeouts = new Map(); // Map to store timeouts for each button

    toolbarButtons.forEach(button => {
        // Create a new entry in the map for each button
        timeouts.set(button, null);

        button.addEventListener('mouseenter', function() {
            // Clear the existing timeout for this button
            clearTimeout(timeouts.get(button));

            const timeoutId = setTimeout(() => {
                const tooltip = button.querySelector('.tooltip, .tooltip-color');
                if (tooltip) {
                    tooltip.style.visibility = 'visible';
                    tooltip.style.opacity = '1';
                }
            }, 1000); // Delay in milliseconds (1000ms = 1s)

            // Store the new timeout ID in the map
            timeouts.set(button, timeoutId);
        });

        button.addEventListener('mouseleave', function() {
            // Clear the timeout for this button
            clearTimeout(timeouts.get(button));

            const tooltip = button.querySelector('.tooltip, .tooltip-color');
            if (tooltip) {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
            }
        });
    });
});
