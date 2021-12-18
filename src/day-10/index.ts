import { DayResults } from '../day-result';
import * as input from './input.json';

const lines: string[] = (input as any).default;
const startTokens = '([{<';
const endTokens = ')]}>';
const incompleteLines = [];

function getSyntaxErrorScore(): number {
    let score = 0;
    for (const line of lines) {
        const lineScore = getLineErrorScore(line);
        if (lineScore === 0) incompleteLines.push(line);
        score += lineScore;
    }
    return score;
}

function getLineErrorScore(line: string): number {
    const errorScores = {
        ')': 3,
        ']': 57,
        '}': 1197,
        '>': 25137,
    };
    const stack = [];

    for (let token of line) {
        if (startTokens.includes(token)) {
            stack.push(token);
        } else {
            const startToken = startTokens[endTokens.indexOf(token)];
            if (stack.pop() !== startToken) return errorScores[token];
        }
    }
    return 0;
}

function getCompletionScore(): number {
    let scores: number[] = [];
    for (const line of incompleteLines) {
        scores.push(getLineCompletionScore(line));
    }
    scores.sort((a, b) => a - b);
    return scores[Math.floor(scores.length / 2)];
}

function getLineCompletionScore(line: string): number {
    const completionScores = {
        '(': 1,
        '[': 2,
        '{': 3,
        '<': 4,
    };
    const stack = [];
    let score = 0;

    for (let token of line) {
        if (startTokens.includes(token)) {
            stack.push(token);
        } else {
            stack.pop();
        }
    }
    while (stack.length) {
        score = score * 5 + completionScores[stack.pop()];
    }
    return score;
}

export function runDay10(): DayResults {
    return {
        results: [
            ['total syntax error score', getSyntaxErrorScore()],
            ['completion score', getCompletionScore()],
        ],
    };
}
