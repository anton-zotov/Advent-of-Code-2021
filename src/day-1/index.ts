import { DayResults } from '../day-result';
import * as input from './input.json';

const depths = (input as any).default;

function getIncreaseCount(depths: number[]): number {
    let prevDepth = depths[0];
    let increaseCount = 0;

    for (let i = 1; i < depths.length; i++) {
        const curDepth = depths[i];
        if (curDepth > prevDepth) increaseCount++;
        prevDepth = curDepth;
    }

    return increaseCount;
}

function getIncreaseCountSlidingWindow(depths: number[], windowSize: number): number {
    let increaseCount = 0;
    let prevDepthWindow = depths.slice(0, windowSize).reduce((acc, depth) => acc + depth, 0);

    for (let i = windowSize; i < depths.length; i++) {
        const curDepthWindow = prevDepthWindow - depths[i - windowSize] + depths[i];
        if (curDepthWindow > prevDepthWindow) increaseCount++;
        prevDepthWindow = curDepthWindow;
    }

    return increaseCount;
}

export function runDay1(): DayResults {
    return {
        results: [
            ['increase count', getIncreaseCount(depths)],
            ['increase count sliding window', getIncreaseCountSlidingWindow(depths, 3)],
        ],
    };
}
