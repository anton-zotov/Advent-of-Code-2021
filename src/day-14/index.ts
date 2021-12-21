import { DayResults } from '../day-result';
import * as input from './input.json';

const { template, rules }: { template: string; rules: [string, string] } = (input as any).default;
const rulesMap = buildRules();
const pairs = buildPairs();

function buildRules(): { [key: string]: string } {
    const rulesMap = {};
    for (const [match, insert] of rules) {
        rulesMap[match] = insert;
    }
    return rulesMap;
}

function buildPairs(): { [key: string]: number } {
    const pairs = {};
    for (let i = 1; i < template.length; i++) {
        const pair = template[i - 1] + template[i];
        if (!pairs[pair]) pairs[pair] = 0;
        pairs[pair] += 1;
    }
    return pairs;
}

function applyRules(times: number) {
    let curPairs = pairs;
    let nextPairs = {};

    function insertPair(pair: string, count: number) {
        nextPairs[pair] = (nextPairs[pair] || 0) + count;
    }

    while (times--) {
        for (const [pair, count] of Object.entries(curPairs)) {
            if (rulesMap[pair]) {
                insertPair(pair[0] + rulesMap[pair], count);
                insertPair(rulesMap[pair] + pair[1], count);
            } else {
                insertPair(pair, count);
            }
        }
        curPairs = nextPairs;
        nextPairs = {};
    }

    const elCounts = Object.entries(curPairs).reduce(
        (counts, [[el], count]) => {
            counts[el] = (counts[el] || 0) + count;
            return counts;
        },
        { [template.slice(-1)]: 1 },
    );

    return Math.max(...Object.values(elCounts)) - Math.min(...Object.values(elCounts));
}

export function runDay14(): DayResults {
    return {
        results: [
            ['polymer number after 10 times', applyRules(10)],
            ['polymer number after 40 times', applyRules(40)],
        ],
    };
}
