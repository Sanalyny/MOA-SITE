document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    if (!header) return;

    // Находим старую навигацию и комментируем её
    const oldNav = header.querySelector('.purpose');
    if (oldNav) {
        header.insertBefore(document.createComment(' ' + oldNav.outerHTML + ' '), oldNav);
        oldNav.style.display = 'none';
    }

    // Создаем контейнер для новой навигации
    const navContainer = document.createElement('div');
    navContainer.id = 'navigation-component-container';
    header.appendChild(navContainer);

    // Загружаем HTML компонента
    fetch('/assets/frontend/components/navigation.html')
        .then(response => response.text())
        .then(data => {
            navContainer.innerHTML = data;
            initializeDropdown();
        });

    function initializeDropdown() {
        const dropdownBtn = document.querySelector('.dropdown-btn');
        const dropdownContent = document.querySelector('.dropdown-content');
        const currentPageTitle = document.getElementById('current-page-title');
        const links = dropdownContent.querySelectorAll('a');

        // Определяем текущую страницу
        const currentPagePath = window.location.pathname.split('/').pop();
        let foundCurrent = false;

        links.forEach(link => {
            if (link.dataset.page === currentPagePath) {
                link.classList.add('current');
                currentPageTitle.textContent = link.textContent;
                foundCurrent = true;
            }
        });

        if (!foundCurrent) {
            currentPageTitle.textContent = 'Выберите страницу';
        }

        // Логика открытия/закрытия списка
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isShown = dropdownContent.style.display === 'block';
            dropdownContent.style.display = isShown ? 'none' : 'block';
            dropdownBtn.classList.toggle('active', !isShown);
        });

        // Закрываем список при клике вне его
        document.addEventListener('click', () => {
            dropdownContent.style.display = 'none';
            dropdownBtn.classList.remove('active');
        });
    }
});
