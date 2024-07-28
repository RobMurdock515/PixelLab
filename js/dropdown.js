document.addEventListener('DOMContentLoaded', function() {
    var buttons = document.querySelectorAll('.file-button, .colors-button, .select-button, .settings-button');
    var closeTimeout;
    var openDropdown = null;

    buttons.forEach(function(button) {
        var dropdownContent = button.nextElementSibling;

        button.addEventListener('click', function() {
            if (dropdownContent.style.display === 'block') {
                dropdownContent.style.display = 'none';
                openDropdown = null;
            } else {
                if (openDropdown) {
                    openDropdown.style.display = 'none';
                }
                dropdownContent.style.display = 'block';
                openDropdown = dropdownContent;
            }
        });

        // Close the dropdown if the user clicks outside of it
        window.onclick = function(event) {
            if (!event.target.matches('.file-button, .colors-button, .select-button, .settings-button') && !event.target.closest('.dropdown-content')) {
                if (openDropdown) {
                    openDropdown.style.display = 'none';
                    openDropdown = null;
                }
            }
        };

        // Set a timeout to close the dropdown if the user hovers outside
        document.addEventListener('mousemove', function(event) {
            if (!event.target.matches('.file-button, .colors-button, .select-button, .settings-button') && !event.target.closest('.dropdown-content')) {
                clearTimeout(closeTimeout);
                closeTimeout = setTimeout(function() {
                    if (openDropdown) {
                        openDropdown.style.display = 'none';
                        openDropdown = null;
                    }
                }, 300); // Delay in milliseconds
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
            closeTimeout = setTimeout(function() {
                dropdownContent.style.display = 'none';
                openDropdown = null;
            }, 300); // Delay in milliseconds
        });
    });
});
