import './main.css';
import { runDay1 } from './day-1';
import { DayResults } from './day-result';

const days = [runDay1];

for (let dayNum = 0; dayNum < days.length; dayNum++) {
    const results = days[dayNum]();
    document.body.insertAdjacentHTML('beforeend', getResultsHtml(dayNum, results));
}

function getResultsHtml(dayNum: number, results: DayResults) {
    const resultsHtml = results
        .map(([name, value]) => `<div class="result">${name}: ${value}</div>`)
        .join('');
    return `
    <div class="day">
        <div class="header">Day ${dayNum + 1}</div>
        <div class="results">${resultsHtml}</div>
    </div>
    `;
}