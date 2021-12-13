import { DayResults } from '../day-result';
import * as input from './input.json';

type SpawnTimers = { [key: string]: number };
const lanternfishPopulation: number[] = (input as any).default;
const reproducesIn = 7;
const newbornDelay = 2;

function count(spawnTimers: SpawnTimers): number {
    return Object.values(spawnTimers).reduce((total, cur) => total + cur, 0);
}

function simulate(population: number[], days: number): SpawnTimers {
    let spawnTimers: SpawnTimers = {};
    for (const spawnTimer of population) {
        spawnTimers[spawnTimer] = (spawnTimers[spawnTimer] ?? 0) + 1;
    }

    while (days--) {
        const nextTimers = {};
        for (const [spawnTimer, amount] of Object.entries(spawnTimers)) {
            if (spawnTimer === '0') {
                nextTimers[reproducesIn - 1] = (nextTimers[reproducesIn - 1] || 0) + amount;
                nextTimers[reproducesIn - 1 + newbornDelay] = amount;
            } else {
                nextTimers[+spawnTimer - 1] = (nextTimers[+spawnTimer - 1] || 0) + amount;
            }
        }
        spawnTimers = nextTimers;
    }
    return spawnTimers;
}

export function runDay6(): DayResults {
    return {
        results: [
            ['amount of lanternfish after 80 days', count(simulate(lanternfishPopulation, 18))],
            ['amount of lanternfish after 256 days', count(simulate(lanternfishPopulation, 256))],
        ],
    };
}
