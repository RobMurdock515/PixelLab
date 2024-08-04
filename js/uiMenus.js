document.addEventListener('DOMContentLoaded', function() {
    // Elements
    var dropdownButtons = document.querySelectorAll('.file-button, .palettes-button, .select-button, .settings-button');
    var rgbButton = document.querySelector('.rgb-button');
    var dropupRgb = document.querySelector('.dropup-rgb');

    // State tracking
    var closeTimeout;
    var openDropdown = null;

    function closeDropdown() {
        if (openDropdown) {
            openDropdown.style.display = 'none';
            openDropdown.style.opacity = '0';
            openDropdown = null;
        }
    }

    function toggleDropdown(dropdownContent) {
        if (dropdownContent.style.display === 'block') {
            closeDropdown();
        } else {
            closeDropdown();
            dropdownContent.style.display = 'block';
            dropdownContent.style.opacity = '1';
            openDropdown = dropdownContent;
        }
    }

    function handleButtonClick(button, dropdownContent) {
        button.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevents click event from closing the dropdown immediately
            toggleDropdown(dropdownContent);
        });
    }

    function handleMouseEnter(button, dropdownContent) {
        button.addEventListener('mouseenter', function() {
            clearTimeout(closeTimeout);
        });

        if (dropdownContent) {
            dropdownContent.addEventListener('mouseenter', function() {
                clearTimeout(closeTimeout);
            });

            dropdownContent.addEventListener('mouseleave', function() {
                closeTimeout = setTimeout(closeDropdown, 450); // Delay in milliseconds
            });
        }
    }

    function setupHoverHandlers() {
        dropdownButtons.forEach(function(button) {
            var dropdownContent = button.nextElementSibling;
            if (dropdownContent) {
                handleButtonClick(button, dropdownContent);
                handleMouseEnter(button, dropdownContent);
            }
        });

        handleButtonClick(rgbButton, dropupRgb);
        handleMouseEnter(rgbButton, dropupRgb);
    }

    setupHoverHandlers();

    // Close dropdown/dropup if user clicks outside
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.file-button, .palettes-button, .select-button, .settings-button, .rgb-button') &&
            !event.target.closest('.dropdown-file, .dropdown-select, .dropdown-settings, .dropup-rgb, .dropdown-palettes-scroll')) {
            closeDropdown();
        }
    });

    // Handle hover over buttons and dropdown/palettes scroll
    document.addEventListener('mousemove', function(event) {
        var isHoveringAnyButton = event.target.matches('.file-button, .palettes-button, .select-button, .settings-button, .rgb-button') ||
                                  event.target.closest('.dropdown-file, .dropdown-select, .dropdown-settings, .dropup-rgb, .dropdown-palettes-scroll');
        
        if (!isHoveringAnyButton) {
            clearTimeout(closeTimeout);
            closeTimeout = setTimeout(closeDropdown, 450); // Delay in milliseconds
        }
    });
});
