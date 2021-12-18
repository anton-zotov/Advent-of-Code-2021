import { DayResults } from '../day-result';
import * as input from './input.json';
import { createCanvas } from './utils';

const heightMap: number[][] = (input as any).default.map((heights) => [...heights].map((h) => +h));
const mapWidth = heightMap[0].length;
const mapHeight = heightMap.length;
const basins = Array.from({ length: mapHeight }).map((_) =>
    Array.from({ length: mapWidth }).fill(-1),
) as number[][];
const basinSizes = [];
const getHeight = (x: number, y: number) => heightMap[y][x];
const lowPoints = getLowPoints();

function getNeighbors(x: number, y: number) {
    const neighbors: [number, number][] = [];
    if (x > 0) neighbors.push([x - 1, y]);
    if (x < mapWidth - 1) neighbors.push([x + 1, y]);
    if (y > 0) neighbors.push([x, y - 1]);
    if (y < mapHeight - 1) neighbors.push([x, y + 1]);
    return neighbors;
}

function getNeighborHeights(x: number, y: number) {
    return getNeighbors(x, y).map(([x, y]) => getHeight(x, y));
}

function* iterateMap() {
    for (let x = 0; x < mapWidth; x++) {
        for (let y = 0; y < mapHeight; y++) {
            yield [x, y, getHeight(x, y)];
        }
    }
}

function getLowPoints(): [number, number][] {
    const lowPoints = [];
    for (const [x, y, currentHeight] of iterateMap()) {
        if (getNeighborHeights(x, y).every((height) => height > currentHeight))
            lowPoints.push([x, y]);
    }
    return lowPoints;
}

function getRiskLevelsSum(): number {
    return lowPoints.reduce((sum, [x, y]) => sum + getHeight(x, y) + 1, 0);
}

function getLargestBasinsSizeProduct(): number {
    function markNeighbors(x: number, y: number, basin: number) {
        if (getHeight(x, y) === 9 || basins[y][x] !== -1) return;

        basins[y][x] = basin;
        basinSizes[basin] = (basinSizes[basin] || 0) + 1;

        for (const [nx, ny] of getNeighbors(x, y)) {
            markNeighbors(nx, ny, basin);
        }
    }

    lowPoints.forEach(([x, y], basin) => {
        markNeighbors(x, y, basin);
    });

    return basinSizes
        .sort((a, b) => b - a)
        .slice(0, 3)
        .reduce((product, n) => product * n, 1);
}

function draw(node: HTMLElement): void {
    const pointSize = 5;
    const randC = () => Math.floor(Math.random() * 200 + 30);
    const basinColors = basinSizes.map((_) => `rgb(${randC()},${randC()},${randC()})`);
    const ctx = createCanvas(node, mapWidth * pointSize, mapHeight * pointSize);

    for (const [x, y, currentHeight] of iterateMap()) {
        let color = '#000';
        if (currentHeight === 9) color = '#fff';
        if (basins[y][x] !== -1) color = basinColors[basins[y][x]];
        ctx.fillStyle = color;
        ctx.fillRect(x * pointSize, y * pointSize, pointSize, pointSize);
    }
}

export function runDay9(): DayResults {
    return {
        results: [
            ['sum of risk levels of low points', getRiskLevelsSum()],
            ['3 largest basin size product', getLargestBasinsSizeProduct()],
        ],
        draw,
    };
}
