document.addEventListener('DOMContentLoaded', () => {
    // Привязка полей ввода к элементам предпросмотра
    const bindings = {
        '#full-name': '#preview-name',
        '#experience-description': '#preview-experience',
    };

    for (const inputSelector in bindings) {
        const outputSelector = bindings[inputSelector];
        const input = document.querySelector(inputSelector);
        const output = document.querySelector(outputSelector);
        if (input && output) {
            input.addEventListener('input', () => {
                output.textContent = input.value || output.dataset.default;
            });
            // Устанавливаем значение по умолчанию для предпросмотра
            output.dataset.default = output.textContent;
        }
    }

    // Обработка выбора должности
    const roleSelection = document.querySelectorAll('.selection-grid[data-multi="false"] .selection-item');
    const previewRole = document.querySelector('#preview-role');

    roleSelection.forEach(item => {
        item.addEventListener('click', () => {
            roleSelection.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            previewRole.textContent = item.textContent;
        });
    });

    // Обработка загрузки фото
    const photoInput = document.querySelector('#user-photo');
    const photoPreview = document.querySelector('.preview-photo');

    if (photoInput && photoPreview) {
        photoInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    photoPreview.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;" alt="User Photo">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});