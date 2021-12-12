import { DayResults } from '../day-result';
import * as input from './input.json';

const report = (input as any).default;

function getCommonBit(report: string[], position: number): string {
    let ones = 0;
    let zeros = 0;

    for (let s of report) {
        if (s[position] === '1') ones += 1;
        else zeros += 1;
    }

    return ones >= zeros ? '1' : '0';
}

function getPowerConsumption(report: string[]): number {
    let diagnostics = '';

    for (let i = 0; i < report[0].length; i++) {
        diagnostics += getCommonBit(report, i);
    }

    const invertedDiagnostics = [...diagnostics].map((c) => (c === '1' ? '0' : '1')).join('');

    return parseInt(diagnostics, 2) * parseInt(invertedDiagnostics, 2);
}

function filterByBitCriteria(report: string[], useMostCommonBit: boolean): number {
    const bitCriteria = (givenBit, commonBit) =>
        useMostCommonBit ? givenBit === commonBit : givenBit !== commonBit;
    let bitPos = 0;

    while (report.length > 1) {
        const commonBit = getCommonBit(report, bitPos);
        report = report.filter((datum) => bitCriteria(datum[bitPos], commonBit));
        bitPos++;
    }

    return parseInt(report[0], 2);
}

function getLifeSupportRating(report: string[]): number {
    return filterByBitCriteria(report, true) * filterByBitCriteria(report, false);
}

export function runDay3(): DayResults {
    return [
        ['power comsumption', getPowerConsumption(report)],
        ['life support rating', getLifeSupportRating(report)],
    ];
}
