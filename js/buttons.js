document.addEventListener('DOMContentLoaded', function() {
    var buttons = document.querySelectorAll('.file-button, .colors-button');
    var closeTimeout;

    buttons.forEach(function(button) {
        var dropdownContent = button.nextElementSibling;

        button.addEventListener('click', function() {
            if (dropdownContent.style.display === 'block') {
                dropdownContent.style.display = 'none';
            } else {
                dropdownContent.style.display = 'block';
            }
        });

        // Close the dropdown if the user clicks outside of it
        window.onclick = function(event) {
            if (!event.target.matches('.file-button, .colors-button') && !event.target.closest('.dropdown-content')) {
                var dropdowns = document.getElementsByClassName("dropdown-content");
                for (var i = 0; i < dropdowns.length; i++) {
                    var openDropdown = dropdowns[i];
                    if (openDropdown.style.display === 'block') {
                        openDropdown.style.display = 'none';
                    }
                }
            }
        };

        // Set a timeout to close the dropdown if the user hovers outside
        document.addEventListener('mousemove', function(event) {
            if (!event.target.matches('.file-button, .colors-button') && !event.target.closest('.dropdown-content')) {
                clearTimeout(closeTimeout);
                closeTimeout = setTimeout(function() {
                    dropdownContent.style.display = 'none';
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
            }, 300); // Delay in milliseconds
        });
    });
});
