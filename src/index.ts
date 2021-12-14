import './main.css';
import { Result } from './day-result';
import { days } from './days';

for (let dayNum = 0; dayNum < days.length; dayNum++) {
    const { results, draw } = days[dayNum]();

    const dayElement = document.querySelector<HTMLDivElement>('.day:last-child');
    document.body.insertAdjacentHTML('beforeend', getDayHtml(dayNum, results));

    if (draw) {
        const toggle = dayElement.querySelector<HTMLButtonElement>('.toggle');
        toggle.style.display = 'block';
        toggle.onclick = () => {
            if (!toggle.dataset.drawn) {
                toggle.dataset.drawn = 'true';
                draw(dayElement.querySelector('.custom-html'));
            }
            dayElement.querySelector<HTMLElement>('.custom-html').classList.toggle('hidden');
        };
    }
}

function getDayHtml(dayNum: number, results: Result[]): string {
    return `
    <div class="day">
        <div class="header">Day ${dayNum + 1}</div>
        <div class="results">${getResultsHtml(results)}</div>
        <button type="button" class="toggle">toggle</button>
        <div class="custom-html hidden"></div>
    </div>
    `;
}

function getResultsHtml(results: Result[]) {
    return results.map(([name, value]) => `<div class="result">${name}: ${value}</div>`).join('');
}
