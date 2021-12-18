import { DayResults } from '../day-result';
import { copyMatrix, createCanvas, createMatrixIterator } from '../utils';
import * as input from './input.json';

const energyLevels: number[][] = (input as any).default.map((s) => [...s].map((c) => +c));

const iterateLevels = (lvls = energyLevels) => createMatrixIterator(lvls);
const size = energyLevels.length;
const levelsHistory = [];
let flashes = 0;
let firstSynchoFlash = 0;

function getLevel(x: number, y: number): number {
    return energyLevels[y][x];
}

function* getNeighbors(x: number, y: number) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const x1 = x + i;
            const y1 = y + j;
            if ((i || j) && x1 >= 0 && y1 >= 0 && x1 < size && y1 < size) {
                yield [x1, y1, getLevel(x1, y1)];
            }
        }
    }
}

function inc(x: number, y: number) {
    const level = getLevel(x, y);
    if (level === 10) return;
    if (level === 9) flashes += 1;
    energyLevels[y][x] = level + 1;

    if (level === 9) {
        for (let [nx, ny, level] of getNeighbors(x, y)) {
            inc(nx, ny);
        }
    }
}

function reset() {
    for (let [x, y, level] of iterateLevels()()) {
        if (level === 10) {
            energyLevels[y][x] = 0;
        }
    }
}

function getTotalFlashAmount(steps: number): number {
    let totalFlashes = 0;
    levelsHistory.push(copyMatrix(energyLevels));

    for (let i = 0; i < steps; i++) {
        flashes = 0;
        for (let [x, y] of iterateLevels()()) {
            inc(x, y);
        }
        levelsHistory.push(copyMatrix(energyLevels));
        reset();
        if (flashes === size * size && !firstSynchoFlash) firstSynchoFlash = i;
        totalFlashes += flashes;
    }
    return totalFlashes;
}

function draw(node: HTMLElement): void {
    const pointSize = 5;
    const getC = (level: number) => Math.floor((level / 9) * 200);
    const ctx = createCanvas(node, size * pointSize, size * pointSize);

    const turnDiv = document.createElement('div');
    node.appendChild(turnDiv);

    for (let i = 0; i < levelsHistory.length; i++) {
        setTimeout(() => {
            turnDiv.innerHTML = `Turn ${i}`;
            for (const [x, y, level] of iterateLevels(levelsHistory[i])()) {
                let color = `rgb(${getC(level)}, ${getC(level)}, ${getC(level)})`;
                if (level === 10) color = '#fff';
                ctx.fillStyle = color;
                ctx.fillRect(x * pointSize, y * pointSize, pointSize, pointSize);
            }
        }, 80 * i);
    }
}

export function runDay11(): DayResults {
    return {
        results: [
            ['total flashes are there after 100 steps', getTotalFlashAmount(100)],
            [
                'first synchro flash',
                (() => {
                    getTotalFlashAmount(200);
                    return 101 + firstSynchoFlash;
                })(),
            ],
        ],
        draw,
    };
}
