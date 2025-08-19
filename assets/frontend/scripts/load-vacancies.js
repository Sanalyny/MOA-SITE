async function loadVacancies() {
    try {
        const response = await fetch("/assets/backend/data/vacancies.json");
        if (!response.ok) throw new Error('Не удалось загрузить vacancies.json');

        const data = await response.json();
        const container = document.getElementById('vacancies');

        // Очищаем контейнер от статичных примеров
        container.innerHTML = '';

        data.forEach(item => {
            // Создаем основную карточку
            const card = document.createElement('div');
            card.classList.add('item-card');

            // Создаем заголовок карточки
            const header = document.createElement('div');
            header.classList.add('item-header');

            const headerText = document.createElement('div');
            headerText.classList.add('item-header-text');

            const subtitle = document.createElement('h4');
            subtitle.classList.add('item-subtitle');
            subtitle.textContent = item['agency-name'];

            const title = document.createElement('h2');
            title.classList.add('item-title');
            title.textContent = item['vacancy-title'];

            headerText.appendChild(subtitle);
            headerText.appendChild(title);

            const imageDiv = document.createElement('div');
            imageDiv.classList.add('item-image');

            const image = document.createElement('img');
            image.src = "/assets/frontend/images/temp_image.png";
            image.style.borderRadius = "24px";
            image.style.width = "48px";
            image.style.height = "48px";
            image.alt = "Agency Logo";

            imageDiv.appendChild(image);

            header.appendChild(headerText);
            header.appendChild(imageDiv);

            // Создаем разделительную линию
            const line = document.createElement('div');
            line.classList.add('item-line');

            // Создаем тело карточки с атрибутами
            const body = document.createElement('div');
            body.classList.add('item-body');

            const attributesHolder = document.createElement('div');
            attributesHolder.classList.add('item-attributes-holder');

            // Список атрибутов в том же порядке, что и в HTML
            const attributes = [
                item['vacancy-minimal-language'],
                `от ${item['vacancy-minimal-experiecnce']}`,
                `от ${item['vacancy-minimal-salary']}$`,
                item['vacancy-schedule'],
                `${item['vacancy-procentage']}%`,
                item['vacancy-platforms'][0], // Первая платформа
                "Подробнее..."
            ];

            // Создаем элементы для каждого атрибута
            attributes.forEach(attrText => {
                const attribute = document.createElement('li');
                attribute.classList.add('unselected-switcher', 'item-attributes');
                attribute.textContent = attrText;
                attributesHolder.appendChild(attribute);
            });

            body.appendChild(attributesHolder);

            // Собираем карточку
            card.appendChild(header);
            card.appendChild(line);
            card.appendChild(body);

            container.appendChild(card);
        });
    } catch (error) {
        console.error(error);
    }
}

// Запускаем загрузку при полной загрузке DOM
document.addEventListener('DOMContentLoaded', loadVacancies);


// TODO:
// 