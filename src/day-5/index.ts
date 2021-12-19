import { createCanvas } from '../utils/canvas';
import { DayResults } from '../day-result';
import * as input from './input.json';

type Map = {
    rows: number[][];
    width: number;
    height: number;
    maxOverlapCount: number;
};
type VentLine = [number, number, number, number];
const ventLines: VentLine[] = (input as any).default;

function excludeDiagonalLines(lines: VentLine[]): VentLine[] {
    return lines.filter(([x1, y1, x2, y2]) => x1 === x2 || y1 === y2);
}

function createMap(lines: VentLine[]): Map {
    let maxWidth = 0;
    let maxHeight = 0;

    for (let [x1, y1, x2, y2] of lines) {
        maxWidth = Math.max(maxWidth, x1, x2);
        maxHeight = Math.max(maxHeight, y1, y2);
    }

    return {
        rows: Array.from({ length: maxHeight + 1 }).map((_) =>
            Array.from({ length: maxWidth + 1 }).fill(0),
        ) as number[][],
        width: maxWidth + 1,
        height: maxHeight + 1,
        maxOverlapCount: 0,
    };
}

function fillMap(map: Map, lines: VentLine[]): void {
    for (let [x1, y1, x2, y2] of lines) {
        const xSize = x2 - x1;
        const ySize = y2 - y1;
        const xStep = Math.sign(xSize);
        const yStep = Math.sign(ySize);
        for (
            let dx = 0, dy = 0;
            dx !== xSize + xStep || dy !== ySize + yStep;
            dx += xStep, dy += yStep
        ) {
            map.rows[y1 + dy][x1 + dx] += 1;
            map.maxOverlapCount = Math.max(map.maxOverlapCount, map.rows[y1 + dy][x1 + dx]);
        }
    }
}

function getOverlappingPointsCount(lines: VentLine[], shouldExcludeDiagonalLines: boolean) {
    const map = createMap(lines);
    fillMap(map, shouldExcludeDiagonalLines ? excludeDiagonalLines(lines) : lines);

    let pointsWithOverlapping = 0;
    for (let row of map.rows) {
        for (let point of row) {
            if (point > 1) pointsWithOverlapping += 1;
        }
    }

    return pointsWithOverlapping;
}

function drawMap(lines: VentLine[], node: HTMLElement): void {
    const map = createMap(lines);
    fillMap(map, lines);

    const pointSize = 1;
    const ctx = createCanvas(node, map.width * pointSize, map.height * pointSize);
    const colorStep = Math.floor(255 / map.maxOverlapCount);

    for (let r in map.rows) {
        const row = map.rows[r];
        for (let c in row) {
            const color = colorStep * row[c];
            ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
            ctx.fillRect(+c * pointSize, +r * pointSize, pointSize, pointSize);
        }
    }
}

export function runDay5(): DayResults {
    return {
        results: [
            ['overlapping points count', getOverlappingPointsCount(ventLines, true)],
            [
                'overlapping points count with horizontal lines',
                getOverlappingPointsCount(ventLines, false),
            ],
        ],
        draw: (node: HTMLElement) => drawMap(ventLines, node),
    };
}

export function attachHtml(): void {}
