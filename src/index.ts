import './main.css';
import { Result } from './day-result';
import { days } from './days';

for (let dayNum = days.length - 1; dayNum >= 0; dayNum--) {
    const start = performance.now();
    const { results, draw } = days[dayNum]();
    const duration = Math.round(performance.now() - start);

    document.body.insertAdjacentHTML('beforeend', getDayHtml(dayNum, duration, results));
    const dayElement = document.querySelector<HTMLDivElement>('.day:last-child');

    if (draw) {
        const toggle = dayElement.querySelector<HTMLButtonElement>('.toggle');
        toggle.style.display = 'block';
        toggle.onclick = () => {
            if (!toggle.dataset.drawn) {
                toggle.dataset.drawn = 'true';
                setTimeout(() => {
                    draw(dayElement.querySelector('.custom-html'))
                    dayElement.querySelector('.loading').remove();
                });
            }
            dayElement.querySelector<HTMLElement>('.custom-html').classList.toggle('hidden');
        };
    }
}

function getDayHtml(dayNum: number, duration: number, results: Result[]): string {
    return `
    <div class="day">
        <div class="header">Day ${dayNum + 1} (${duration}ms)</div>
        <div class="results">${getResultsHtml(results)}</div>
        <button type="button" class="toggle">toggle</button>
        <div class="custom-html hidden">
            <div class="loading">Loading...</div></div>
    </div>
    `;
}

function getResultsHtml(results: Result[]) {
    return results.map(([name, value]) => `<div class="result">${name}: ${value}</div>`).join('');
}
