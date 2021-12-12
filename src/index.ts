import './main.css';
import { Result } from './day-result';
import { runDay1 } from './day-1';
import { runDay2 } from './day-2';
import { runDay3 } from './day-3';
import { runDay4 } from './day-4';
import { runDay5 } from './day-5';

const days = [runDay1, runDay2, runDay3, runDay4, runDay5];

for (let dayNum = 0; dayNum < days.length; dayNum++) {
    document.body.insertAdjacentHTML('beforeend', getDayHtml(dayNum));

    const dayElement = document.querySelector<HTMLDivElement>('.day:last-child');
    const { results, draw } = days[dayNum]();

    dayElement.querySelector('.results').insertAdjacentHTML('beforeend', getResultsHtml(results));

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

function getDayHtml(dayNum: number): string {
    return `
    <div class="day">
        <div class="header">Day ${dayNum + 1}</div>
        <div class="results"></div>
        <button type="button" class="toggle">toggle</button>
        <div class="custom-html hidden"></div>
    </div>
    `;
}

function getResultsHtml(results: Result[]) {
    return results.map(([name, value]) => `<div class="result">${name}: ${value}</div>`).join('');
}
