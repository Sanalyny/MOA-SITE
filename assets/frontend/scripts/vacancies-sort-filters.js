function applyFilters() {
    const filters = {
        salaryMin: document.querySelector('.salary-input').valueAsNumber,
        schedule: Array.from(document.querySelectorAll('.filter-grid-right .customizable-border-box')).filter(el => el.classList.contains('selected')),
        vacation: Array.from(document.querySelectorAll('.vacation-section .customizable-border-box')).filter(el => el.classList.contains('selected'))
    };

    const vacancies = JSON.parse(localStorage.getItem('vacancies') || '[]');
    const filteredVacancies = vacancies.filter(vacancy => {
        return (
            vacancy.vacancy_minimal_salary >= filters.salaryMin &&
            filters.schedule.includes(vacancy.vacancy_schedule) &&
            (filters.vacation[0] ? !vacancy.vacancy_vacation : true)
        );
    });

    renderFilteredVacancies(filteredVacancies);
}

function renderFilteredVacancies(vacancies) {
    const container = document.getElementById('vacancies');
    container.innerHTML = '';
    vacancies.forEach(vacancy => {
        const card = createVacancyCard(vacancy);
        container.appendChild(card);
    });
}

function createVacancyCard(vacancy) {
    // Create card elements here
    // ...
}

document.querySelectorAll('.filter-grid input, .filter-grid button').forEach(el => {
    el.addEventListener('change', applyFilters);
});