document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const colorBox = document.querySelector('.color-box');
    const colorCircle = document.querySelector('.color-circle');
    const colorSpectrum = document.querySelector('.color-spectrum');
    const spectrumThumb = document.querySelector('.spectrum-thumb');
    const colorDisplay = document.getElementById('colorDisplay');
    const hexValue = document.getElementById('hexValue');
    const rgbValue = document.getElementById('rgbValue');
    const hslValue = document.getElementById('hslValue');

    // Color Values
    let currentHue = 0;
    let currentSaturation = 100;
    let currentBrightness = 50;

    function updateColorDisplay() {
        const rgb = `rgb(${rgbValue.textContent})`;
        colorDisplay.style.backgroundColor = rgb;
    }

    function updateColorFromPosition(x, y) {
        const saturation = (x / colorBox.clientWidth) * 100;
        const brightness = 100 - (y / colorBox.clientHeight) * 100;
        currentSaturation = Math.max(0, Math.min(100, saturation));
        currentBrightness = Math.max(0, Math.min(100, brightness));

        const rgb = hsbToRgb(currentHue, currentSaturation, currentBrightness);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

        hexValue.textContent = hex;
        rgbValue.textContent = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
        hslValue.textContent = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;

        updateColorDisplay();

        colorCircle.style.left = `${x}px`;
        colorCircle.style.top = `${y}px`;
    }

    function hsbToRgb(h, s, v) {
        s /= 100;
        v /= 100;
        let k = (n) => (n + h / 60) % 6;
        let f = (n) => v - v * s * Math.max(Math.min(k(n), 4 - k(n), 1), 0);
        return {
            r: Math.round(f(5) * 255),
            g: Math.round(f(3) * 255),
            b: Math.round(f(1) * 255)
        };
    }

    function rgbToHex(r, g, b) {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }

    function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    function updateHueFromPosition(y) {
        const spectrumRect = colorSpectrum.getBoundingClientRect();
        const thumbHeight = spectrumThumb.offsetHeight;
        
        // Clamp the position of the thumb
        const clampedY = Math.max(0, Math.min(y, spectrumRect.height));

        currentHue = (clampedY / spectrumRect.height) * 360;
        const hslColor = `hsl(${currentHue}, 100%, 50%)`;
        colorBox.style.background = `linear-gradient(to top, black, rgba(0, 0, 0, 0)), linear-gradient(to right, white, ${hslColor})`;
        spectrumThumb.style.top = `${clampedY}px`;
    }

    colorBox.addEventListener('mousedown', function(e) {
        const rect = colorBox.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        updateColorFromPosition(x, y);

        function mouseMoveHandler(e) {
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            updateColorFromPosition(x, y);
        }

        function mouseUpHandler() {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        }

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    });

    colorSpectrum.addEventListener('mousedown', function(e) {
        const rect = colorSpectrum.getBoundingClientRect();
        const y = e.clientY - rect.top;
        updateHueFromPosition(y);

        function mouseMoveHandler(e) {
            const y = e.clientY - rect.top;
            updateHueFromPosition(y);
        }

        function mouseUpHandler() {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        }

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    });
});
