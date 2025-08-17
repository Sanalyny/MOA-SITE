document.addEventListener('DOMContentLoaded', function () {
    const minSlider = document.getElementById('minSlider');
    const maxSlider = document.getElementById('maxSlider');
    const minTooltip = document.getElementById('minTooltip');
    const maxTooltip = document.getElementById('maxTooltip');
    const sliderTrack = document.getElementById('sliderTrack');
    const selectedRange = document.getElementById('selectedRange');

    function formatTime(hours) {
        return `${hours}`;
    }

    function getTimeWord(hours) {
        return hours <= 4 ? 'часа' : 'часов';
    }

    function updateSliders() {
        const minValue = parseInt(minSlider.value);
        const maxValue = parseInt(maxSlider.value);

        // Ensure min doesn't exceed max and vice versa
        if (minValue > maxValue) {
            if (this === minSlider) {
                minSlider.value = maxValue;
            } else {
                maxSlider.value = minValue;
            }
            return updateSliders();
        }

        // Update tooltips
        // minTooltip.textContent = formatTime(minSlider.value);
        // maxTooltip.textContent = formatTime(maxSlider.value);

        // Position tooltips
        const minPercent = ((minValue - 4) / 8) * 100;
        const maxPercent = ((maxValue - 4) / 8) * 100;

        // minTooltip.style.left = `${minPercent}%`;
        // maxTooltip.style.left = `${maxPercent}%`;

        // Update track highlight
        sliderTrack.style.left = `${minPercent}%`;
        sliderTrack.style.width = `${maxPercent - minPercent}%`;

        // Update selected range text
        if (minValue === maxValue) {
            const timeWord = getTimeWord(minValue);
            selectedRange.textContent = `${minValue} ${timeWord}`;
        } else {
            selectedRange.textContent = `от ${formatTime(minValue)} до ${formatTime(maxValue)} часов`;
        }
    }

    minSlider.addEventListener('input', updateSliders);
    maxSlider.addEventListener('input', updateSliders);

    updateSliders();
});