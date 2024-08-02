/* dropdown js */

document.addEventListener('DOMContentLoaded', function() {
    var buttons = document.querySelectorAll('.file-button, .colors-button, .select-button, .settings-button');
    var closeTimeout;
    var openDropdown = null;

    function closeDropdown() {
        if (openDropdown) {
            openDropdown.style.display = 'none';
            openDropdown = null;
        }
    }

    buttons.forEach(function(button) {
        var dropdownContent = button.nextElementSibling;

        button.addEventListener('click', function() {
            if (dropdownContent && dropdownContent.style.display === 'block') {
                closeDropdown();
            } else {
                closeDropdown();
                if (dropdownContent) {
                    dropdownContent.style.display = 'block';
                    openDropdown = dropdownContent;
                }
            }
        });

        // Close the dropdown if the user clicks outside of it
        window.addEventListener('click', function(event) {
            if (!event.target.matches('.file-button, .colors-button, .select-button, .settings-button') &&
                !event.target.closest('.dropdown-content')) {
                closeDropdown();
            }
        });

        // Set a timeout to close the dropdown if the user hovers outside
        document.addEventListener('mousemove', function(event) {
            if (!event.target.matches('.file-button, .colors-button, .select-button, .settings-button') &&
                !event.target.closest('.dropdown-content, .dropdown-content-scroll')) {
                clearTimeout(closeTimeout);
                closeTimeout = setTimeout(closeDropdown, 450); // Delay in milliseconds
            } else {
                clearTimeout(closeTimeout);
            }
        });

        // Clear the timeout if the mouse enters the button/dropdown again
        button.addEventListener('mouseenter', function() {
            clearTimeout(closeTimeout);
        });

        dropdownContent.addEventListener('mouseenter', function() {
            clearTimeout(closeTimeout);
        });

        dropdownContent.addEventListener('mouseleave', function() {
            closeTimeout = setTimeout(closeDropdown, 450); // Delay in milliseconds
        });
    });
});
