const slider = document.getElementById('levelSlider');
const tooltip = document.getElementById('tooltip');
const selectedLevel = document.getElementById('selectedLevel');

const levels = [
  { code: 'A1', name: 'Beginner' },
  { code: 'A2', name: 'Elementary' },
  { code: 'B1', name: 'Intermediate' },
  { code: 'B2', name: 'Upper-Intermediate' },
  { code: 'C1', name: 'Advanced' },
  { code: 'C2', name: 'Proficient' }
];

function updateTooltip(value) {
  const level = levels[value];
  tooltip.textContent = `${level.code} – ${level.name}`;
  selectedLevel.textContent = `Вы выбрали: ${level.code} – ${level.name}`;
  
  // Позиционирование tooltip
  const percent = (value / (levels.length - 1)) * 100;
  tooltip.style.left = `calc(${percent}% + (${8 - percent * 0.15}px))`;
}

slider.addEventListener('input', (e) => {
  updateTooltip(e.target.value);
});

updateTooltip(slider.value);
