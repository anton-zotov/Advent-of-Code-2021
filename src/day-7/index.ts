import { DayResults } from '../day-result';
import * as input from './input.json';

const crabPositions: number[] = (input as any).default;

function getCost(steps: number): number {
    return ((steps + 1) * steps) / 2;
}

function getFuelConsumption(crabPositions: number[], withCostIncrease: boolean): number {
    let minPos = crabPositions[0];
    let maxPos = crabPositions[0];

    for (let position of crabPositions) {
        if (position < minPos) {
            minPos = position;
        }
        if (position > maxPos) {
            maxPos = position;
        }
    }

    const positionMap: { [key: string]: number } = {};
    let currentConsumption = 0;
    for (let position of crabPositions) {
        positionMap[position] = (positionMap[position] || 0) + 1;
        currentConsumption += withCostIncrease ? getCost(position) : position;
    }

    let minConsumption = currentConsumption;
    for (let pos = minPos + 1; pos <= maxPos; pos++) {
        for (let [crabPosition, crabAmount] of Object.entries(positionMap)) {
            if (+crabPosition < pos) {
                currentConsumption += withCostIncrease
                    ? crabAmount * (pos - +crabPosition)
                    : crabAmount;
            } else {
                currentConsumption -= withCostIncrease
                    ? crabAmount * (+crabPosition - pos + 1)
                    : crabAmount;
            }
        }
        minConsumption = Math.min(minConsumption, currentConsumption);
    }

    return minConsumption;
}

export function runDay7(): DayResults {
    return {
        results: [
            ['fuel consumption', getFuelConsumption(crabPositions, false)],
            ['fuel consumption with const increase', getFuelConsumption(crabPositions, true)],
        ],
    };
}
