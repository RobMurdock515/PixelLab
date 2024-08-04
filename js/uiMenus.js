document.addEventListener('DOMContentLoaded', function() {
    // Elements
    var dropdownButtons = document.querySelectorAll('.file-button, .palettes-button, .select-button, .settings-button');
    var rgbButton = document.querySelector('.rgb-button');
    var dropupRgb = document.querySelector('.dropup-rgb');
    var hexInput = document.getElementById('hexInput');
    var rInput = document.getElementById('rInput');
    var gInput = document.getElementById('gInput');
    var bInput = document.getElementById('bInput');

    // State tracking
    var closeTimeout;
    var openDropdown = null;

    // Function to update displayed color information
    function updateColorDisplay(r, g, b) {
        var hex = rgbToHex(r, g, b);  
        var hsl = rgbToHsl(r, g, b); 
        hexValue.textContent = hex;
        rgbValue.textContent = `${r}, ${g}, ${b}`;
        hslValue.textContent = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
        colorDisplay.style.backgroundColor = hex;
        hexInput.value = hex;
        rInput.value = r;
        gInput.value = g;
        bInput.value = b;
    }

    // Handle color input changes
    hexInput.addEventListener('input', function() {
        var hex = hexInput.value;
        var rgb = hexToRgb(hex); 
        if (rgb) updateColorDisplay(rgb.r, rgb.g, rgb.b);
    });

    rInput.addEventListener('input', function() {
        var r = parseInt(rInput.value, 10);
        var g = parseInt(gInput.value, 10);
        var b = parseInt(bInput.value, 10);
        updateColorDisplay(r, g, b);
    });

    gInput.addEventListener('input', function() {
        var r = parseInt(rInput.value, 10);
        var g = parseInt(gInput.value, 10);
        var b = parseInt(bInput.value, 10);
        updateColorDisplay(r, g, b);
    });

    bInput.addEventListener('input', function() {
        var r = parseInt(rInput.value, 10);
        var g = parseInt(gInput.value, 10);
        var b = parseInt(bInput.value, 10);
        updateColorDisplay(r, g, b);
    });

    // Close dropdown function
    function closeDropdown() {
        if (openDropdown) {
            openDropdown.style.display = 'none';
            openDropdown.style.opacity = '0';
            openDropdown = null;
        }
    }

    // Toggle dropdown visibility
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

    // Handle button click and hover events
    function handleButtonClick(button, dropdownContent) {
        button.addEventListener('click', function(event) {
            event.stopPropagation();
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
                closeTimeout = setTimeout(closeDropdown, 450);
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
            closeTimeout = setTimeout(closeDropdown, 450);
        }
    });
});
