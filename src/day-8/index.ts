import { DayResults } from '../day-result';
import * as input from './input.json';

type Signal = [string, string];
type SegmentMap = {
    [key: string]: { options: string[]; seedPos: number };
};

const signals: Signal[] = (input as any).default;

// --------------part one-----------------

const knownDigitsBySegments = {
    2: 1,
    3: 7,
    4: 4,
    7: 8,
};

function guessDigit(mixedSegments: string) {
    return knownDigitsBySegments[mixedSegments.length] || null;
}

function countSimpleDigits(signals: Signal[]): number {
    let count = 0;
    for (let [input, output] of signals) {
        for (const segments of output.split(' ')) {
            if (guessDigit(segments)) {
                count += 1;
            }
        }
    }
    return count;
}

// --------------part two-----------------

let segmentMap: SegmentMap;
const validDigits = [
    'abcefg',
    'cf',
    'acdeg',
    'acdfg',
    'bcdf',
    'abdfg',
    'abdefg',
    'acf',
    'abcdefg',
    'abcdfg',
];

function sumUpOutputValues(signals: Signal[]): number {
    return signals.reduce((sum, signal) => sum + decodeSignal(signal), 0);
}

function decodeSignal([input, output]: Signal): number {
    function getMappedSegment(c: string, seed: string): string {
        if (segmentMap[c].options.length === 1) return segmentMap[c].options[0];
        return segmentMap[c].options[+seed[segmentMap[c].seedPos]];
    }

    let correctionMap = {};
    segmentMap = prepareSegmentMap(input);

    for (let i = 0; i < 8; i++) {
        const seed = i.toString(2).padStart(3, '0');
        correctionMap = [...'abcdefg'].reduce(
            (map, c) => ({ ...map, [getMappedSegment(c, seed)]: c }),
            {},
        );

        const decodedNumber = decodeSequence(correctionMap, input);
        if (decodedNumber !== null) break;
    }

    return decodeSequence(correctionMap, output);
}

function decodeSequence(correctionMap: {}, input: string): number {
    let numberStr = '';
    for (const segments of input.split(' ')) {
        const digit = decodeDigit(correctionMap, segments);
        if (digit === -1) return null;
        numberStr += digit;
    }
    return +numberStr;
}

function decodeDigit(correctionMap: {}, segments: string): number {
    const mappedSegments = [...segments]
        .map((c) => correctionMap[c])
        .sort()
        .join('');
    return validDigits.indexOf(mappedSegments);
}

function prepareSegmentMap(input: string): SegmentMap {
    const inputArr = input.split(' ');
    const findDigit = (len: number) => [...inputArr.find((s) => s.length === len)];
    const map: SegmentMap = {};

    const one = findDigit(2);
    const four = findDigit(4);
    const seven = findDigit(3);
    const eight = findDigit(7);

    map['c'] = { options: [...one], seedPos: 1 };
    map['f'] = { options: [...one].reverse(), seedPos: 1 };
    map['a'] = { options: seven.filter((segment) => !one.includes(segment)), seedPos: 0 };
    map['b'] = { options: four.filter((segment) => !one.includes(segment)), seedPos: 0 };
    map['d'] = { options: [...map['b'].options].reverse(), seedPos: 0 };
    map['e'] = {
        options: eight.filter((segment) => ![...seven, ...four].includes(segment)),
        seedPos: 2,
    };
    map['g'] = { options: [...map['e'].options].reverse(), seedPos: 2 };

    return map;
}

export function runDay8(): DayResults {
    return {
        results: [
            ['1, 4, 7, 8 count', countSimpleDigits(signals)],
            ['sum of output values', sumUpOutputValues(signals)],
        ],
    };
}
