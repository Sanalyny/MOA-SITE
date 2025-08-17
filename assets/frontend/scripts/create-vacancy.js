document.addEventListener('DOMContentLoaded', () => {
    const vacancyTypes = document.querySelectorAll('.selection-item[data-title]');
    vacancyTypes.forEach(item => {
        item.addEventListener('click', () => {
            vacancyTypes.forEach(type => type.classList.remove('selected'));
            item.classList.add('selected');

            const selectedType = item.getAttribute('data-value');
            document.querySelectorAll('.specific-section').forEach(section => {
                section.style.display = section.getAttribute('data-for') === selectedType ? 'block' : 'none';
            });

            updatePreview();
        });
    });

    const selectionItems = document.querySelectorAll('.selection-item');
    selectionItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.hasAttribute('data-title')) return; // vacancy type handled above

            const parent = item.parentElement;
            const multi = parent.getAttribute('data-multi') === 'true';

            if (multi) {
                item.classList.toggle('selected');
            } else {
                parent.querySelectorAll('.selection-item').forEach(sib => sib.classList.remove('selected'));
                item.classList.add('selected');
            }
            updatePreview();
        });
    });

    // Добавляем кнопку "Не требуется" в английский
    // Нужно добавить в HTML: 
    // <div class="selection-item" data-value="not-required">Не требуется</div>
    // в блок английского, а здесь обеспечиваем её правильную работу.

    const fileInput = document.getElementById('agency-logo');
    const uploadPreview = document.querySelector('.upload-placeholder');
    if (fileInput && uploadPreview) {
        fileInput.addEventListener('change', e => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = e => {
                    uploadPreview.innerHTML = `<img src="${e.target.result}" alt="Logo preview" style="max-width:100px;max-height:60px;border-radius:8px;">
                                               <small>Файл загружен: ${file.name}</small>`;
                    updatePreview();
                };
                reader.readAsDataURL(file);
            }
        });
    }

    document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('change', updatePreview);
    });

    function updatePreview() {
        const previewCard = document.querySelector('.preview-card');
        if (!previewCard) return;

        // Заголовок вакансии и агентства
        const selectedVacType = document.querySelector('.selection-item[data-title].selected');
        const vacTitleDefault = selectedVacType ? selectedVacType.getAttribute('data-title') : 'Вакансия';

        const agencyNameInput = document.getElementById('agency-name');
        const vacancyTitleInput = document.getElementById('vacancy-title');
        const previewAgencyName = previewCard.querySelector('.item-subtitle');
        const previewTitle = previewCard.querySelector('.item-title');

        if (previewAgencyName) previewAgencyName.textContent = agencyNameInput?.value.trim() || 'Название агентства';
        if (previewTitle) previewTitle.textContent = vacancyTitleInput?.value.trim() || vacTitleDefault;

        // Атрибуты
        const attributesHolder = previewCard.querySelector('.item-attributes-holder');
        if (!attributesHolder) return;

        attributesHolder.innerHTML = '';

        // Английский уровень — с учетом "Не требуется"
        const selectedEnglish = Array.from(document.querySelectorAll('.selection-grid'))
            .find(grid => grid.previousElementSibling?.textContent.includes('английского'));
        const selectedEnglishItem = selectedEnglish ? selectedEnglish.querySelector('.selection-item.selected') : null;
        if (selectedEnglishItem) {
            addAttributeTag(selectedEnglishItem.getAttribute('data-value') === 'not-required' ? 'Английский не требуется' : selectedEnglishItem.textContent.trim());
        }

        // Опыт работы (выбираем из selection-item.selected)
        const selectedExperience = Array.from(document.querySelectorAll('.selection-grid'))
            .find(grid => grid.previousElementSibling?.textContent.includes('Опыт работы'))
            .querySelector('.selection-item.selected');
        if (selectedExperience) addAttributeTag(selectedExperience.textContent.trim());

        // Зарплата
        const salaryFrom = document.getElementById('salary-from')?.value.trim();
        const salaryTo = document.getElementById('salary-to')?.value.trim();
        if (salaryFrom && salaryTo) addAttributeTag(`${salaryFrom}$ - ${salaryTo}$`);
        else if (salaryFrom) addAttributeTag(`от ${salaryFrom}$`);

        // Часов в день
        const workHours = document.getElementById('work-hours')?.value;
        if (workHours) addAttributeTag(`${workHours} часов`);

        // Тип оплаты
        const paymentType = document.getElementById('payment-type')?.value.trim();
        if (paymentType) addAttributeTag(paymentType);

        // Навыки из skill-tag
        document.querySelectorAll('.skill-tag').forEach(skill => {
            const txt = skill.textContent.replace('×', '').trim();
            if (txt) addAttributeTag(txt);
        });

        // Технические навыки из selection-item.selected в .skills-selection
        document.querySelectorAll('.skills-selection .selection-item.selected').forEach(skill => {
            addAttributeTag(skill.textContent.trim());
        });

        // Soft skills, максимум 2
        let softCount = 0;
        document.querySelectorAll('.selection-grid[data-multi="true"]').forEach(grid => {
            if (grid.previousElementSibling?.textContent.toLowerCase().includes('soft skills')) {
                grid.querySelectorAll('.selection-item.selected').forEach(skill => {
                    if (softCount < 2) {
                        addAttributeTag(skill.textContent.trim());
                        softCount++;
                    }
                });
            }
        });

        addAttributeTag('Подробнее...');

        function addAttributeTag(text) {
            const li = document.createElement('li');
            li.className = 'unselected-switcher item-attributes';
            li.textContent = text;
            attributesHolder.appendChild(li);
        }
    }

    function validateForm() {
        // let valid = true;
        // // Проверяем только обязательные поля — основная информация + контакты
        // const requiredFields = [
        //     'vacancy-title',
        //     'agency-name',
        //     'vacancy-description',
        //     'contact-person',
        //     'contact-telegram',
        //     'contact-email',
        //     'contact-phone'
        // ];
        // requiredFields.forEach(id => {
        //     const el = document.getElementById(id);
        //     if (!el || !el.value.trim()) {
        //         el?.classList.add('error');
        //         valid = false;
        //     } else {
        //         el?.classList.remove('error');
        //         el?.classList.add('success');
        //     }
        // });
        // return valid;
        return true;
    }

    function collectFormData() {
        const data = {
            vacancyTitle: document.getElementById('vacancy-title')?.value.trim() || '',
            agencyName: document.getElementById('agency-name')?.value.trim() || '',
            description: document.getElementById('vacancy-description')?.value.trim() || '',

            // Английский с поддержкой "не требуется"
            englishLevel: (() => {
                const el = Array.from(document.querySelectorAll('.selection-grid'))
                    .find(grid => grid.previousElementSibling?.textContent.includes('английского'))
                    ?.querySelector('.selection-item.selected');
                if (!el) return '';
                return el.getAttribute('data-value') === 'not-required' ? 'Не требуется' : el.getAttribute('data-value');
            })(),

            experience: (() => {
                const el = Array.from(document.querySelectorAll('.selection-grid'))
                    .find(grid => grid.previousElementSibling?.textContent.includes('Опыт работы'))
                    ?.querySelector('.selection-item.selected');
                return el ? el.textContent.trim() : '';
            })(),

            skills: Array.from(document.querySelectorAll('.skill-tag')).map(t => t.textContent.replace('×', '').trim()).filter(Boolean),

            salaryFrom: document.getElementById('salary-from')?.value.trim() || '',
            salaryTo: document.getElementById('salary-to')?.value.trim() || '',
            workHours: document.getElementById('work-hours')?.value || '',
            paymentType: document.getElementById('payment-type')?.value.trim() || '',

            schedule: (() => {
                const el = document.querySelector('.selection-item.selected[data-value="2/2"], .selection-item.selected[data-value="5/2"], .selection-item.selected[data-value="6/1"], .selection-item.selected[data-value="flexible"]');
                return el ? el.getAttribute('data-value') : '';
            })(),

            vacation: (() => {
                const el = document.querySelector('.selection-item.selected[data-value*="vacation"]');
                return el ? el.getAttribute('data-value') : '';
            })(),

            contactPerson: document.getElementById('contact-person')?.value.trim() || '',
            telegram: document.getElementById('contact-telegram')?.value.trim() || '',
            email: document.getElementById('contact-email')?.value.trim() || '',
            phone: document.getElementById('contact-phone')?.value.trim() || ''
        };
        return data;
    }

    function formatTelegramMessage(data) {
        const scheduleMap = { '2/2': '2/2', '5/2': '5/2', '6/1': '6/1', 'flexible': 'Плавающий' };
        const vacationMap = { 'with-vacation': 'С отпуском', 'without-vacation': 'Без отпуска' };

        let msg = `🆕 НОВАЯ ВАКАНСИЯ\n\n`;
        msg += `📋 ${data.vacancyTitle}\n`;
        msg += `🏢 ${data.agencyName}\n\n`;

        if (data.description) msg += `📝 ОПИСАНИЕ:\n${data.description}\n\n`;

        msg += `✅ ТРЕБОВАНИЯ:\n`;
        if (data.englishLevel) msg += `🇺🇸 Английский: ${data.englishLevel}\n`;
        if (data.experience) msg += `💼 Опыт: ${data.experience}\n`;
        if (data.skills.length) msg += `🛠 Навыки: ${data.skills.join(', ')}\n`;
        msg += `\n`;

        msg += `💰 УСЛОВИЯ:\n`;
        if (data.salaryFrom && data.salaryTo) msg += `💵 Зарплата: ${data.salaryFrom}$ - ${data.salaryTo}$\n`;
        else if (data.salaryFrom) msg += `💵 Зарплата: от ${data.salaryFrom}$\n`;
        if (data.workHours) msg += `⏰ Часов в день: ${data.workHours}\n`;
        if (data.paymentType) msg += `💳 Тип оплаты: ${data.paymentType}\n`;
        if (data.schedule) msg += `📅 График: ${scheduleMap[data.schedule] || data.schedule}\n`;
        if (data.vacation) msg += `🏖 Отпуск: ${vacationMap[data.vacation] || data.vacation}\n`;
        msg += `\n`;

        msg += `📞 КОНТАКТЫ:\n`;
        if (data.contactPerson) msg += `👤 Контакт: ${data.contactPerson}\n`;
        if (data.telegram) msg += `📱 Telegram: ${data.telegram}\n`;
        if (data.email) msg += `📧 Email: ${data.email}\n`;
        if (data.phone) msg += `☎️ Телефон: ${data.phone}\n`;

        return msg;
    }

    function generateTelegramBotLink(message) {
        const botUsername = 'moa_site_bot'; // Заменить на имя бота
        // Telegram start payload ограничен по длине (~64 символа), поэтому нельзя передавать весь текст напрямую.
        // Лучше дать ссылку на бота, а сам текст — копировать отдельно
        return `https://t.me/${botUsername}`;
    }

    function showTelegramModal(botLink, message) {
        const existing = document.querySelector('.telegram-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.className = 'telegram-modal';

        const escaped = message
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');

        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Отправить вакансию на модерацию</h2>
                        <span class="modal-close">&times;</span>
                    </div>
                    <div class="modal-body">
                        <p>Ваша вакансия готова к отправке! Перейдите в Telegram и отправьте сообщение боту:</p>
                        <div class="message-preview">
                            <h3>Текст вакансии:</h3>
                            <pre>${escaped}</pre>
                        </div>
                        <div class="modal-buttons">
                            <a href="${botLink}" target="_blank" class="btn-telegram">📱 Открыть Telegram бот</a>
                            <button class="btn-copy">📋 Скопировать текст</button>
                        </div>
                        <div class="modal-instructions">
                            <small>
                                <strong>Инструкция:</strong><br>
                                1. Нажмите "Открыть Telegram бот"<br>
                                2. Отправьте скопированный текст боту<br>
                                3. Дождитесь модерации (до 24 часов)
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.modal-close').onclick = () => modal.remove();
        modal.querySelector('.modal-overlay').onclick = e => { if (e.target === modal.querySelector('.modal-overlay')) modal.remove(); };

        modal.querySelector('.btn-copy').onclick = () => {
            navigator.clipboard.writeText(message).then(() => {
                const btn = modal.querySelector('.btn-copy');
                btn.textContent = '✅ Скопировано!';
                btn.style.background = '#27ae60';
                setTimeout(() => {
                    btn.textContent = '📋 Скопировать текст';
                    btn.style.background = '';
                }, 2000);
            }).catch(() => alert('Не удалось скопировать текст'));
        };

        document.addEventListener('keydown', function esc(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', esc);
            }
        });
    }

    const publishBtn = document.querySelector('.btn-primary');
    if (publishBtn) {
        publishBtn.addEventListener('click', e => {
            e.preventDefault();
            if (!validateForm()) {
                alert('Пожалуйста, заполните обязательные поля');
                return;
            }
            const data = collectFormData();
            const msg = formatTelegramMessage(data);
            const link = generateTelegramBotLink(msg);
            showTelegramModal(link, msg);
        });
    }

    // Черновик без изменений
    const draftBtn = document.querySelector('.btn-secondary');
    if (draftBtn) {
        draftBtn.addEventListener('click', e => {
            e.preventDefault();
            draftBtn.disabled = true;
            draftBtn.textContent = 'Сохраняем...';
            setTimeout(() => {
                alert('Черновик сохранен!');
                draftBtn.disabled = false;
                draftBtn.textContent = 'Сохранить как черновик';
            }, 1000);
        });
    }

    updatePreview();
});
