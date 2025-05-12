const saturationSlider = document.getElementById('saturation-slider');
saturationSlider.addEventListener('input', function() {
    document.documentElement.style.filter = `saturate(${this.value}%)`;
});