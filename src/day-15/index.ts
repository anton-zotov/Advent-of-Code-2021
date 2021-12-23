import { DayResults } from '../day-result';
import * as input from './input.json';
import PriorityQueue from 'js-priority-queue';
import { createCanvas, line, text } from '../utils/canvas';

type Node = {
    x: number;
    y: number;
    risk: number;
    pathRisk: number;
    fScore: number;
    gScore: number;
    hScore: number;
    cameFrom?: Node;
};

let riskMap: Node[][];
let path = new Set<Node>();

function* getNeighbors(node: Node, map: Node[][]) {
    const dirs = [
        [-1, 0],
        [0, -1],
        [0, 1],
        [1, 0],
    ];
    for (let [dx, dy] of dirs) {
        if (
            node.x + dx >= 0 &&
            node.x + dx < map[0].length &&
            node.y + dy >= 0 &&
            node.y + dy < map.length
        ) {
            yield map[node.y + dy][node.x + dx];
        }
    }
}

function AStarSearch(riskMap: Node[][], start: Node, end: Node) {
    const open = new PriorityQueue({
        comparator: (a: Node, b: Node) => a.fScore - b.fScore,
    });
    const openSet = new Set();

    function queue(node: Node) {
        open.queue(node);
        openSet.add(node);
    }

    function dequeue(): Node {
        const node = open.dequeue();
        openSet.delete(node);
        return node;
    }

    queue(start);

    while (open.length) {
        const current = dequeue();
        if (current === end) {
            return end.pathRisk;
        }
        for (const neighbor of getNeighbors(current, riskMap)) {
            const tentativeGScore = current.gScore + neighbor.risk;
            if (tentativeGScore < neighbor.gScore) {
                neighbor.cameFrom = current;
                neighbor.pathRisk = current.pathRisk + neighbor.risk;
                neighbor.gScore = tentativeGScore;
                neighbor.fScore = tentativeGScore + neighbor.hScore;
                if (!openSet.has(neighbor)) {
                    queue(neighbor);
                }
            }
        }
    }

    throw new Error('no path found');
}

function getTotalRisk(wrapTimes: number = 0): number {
    const rawMap = (input as any).default.map((s) => [...s].map((c) => +c));
    const wrap = (n: number) => (n > 9 ? n - 9 : n);

    let mapWidth = rawMap[0].length;
    let mapHeight = rawMap.length;

    for (let i = 1; i < wrapTimes; i++) {
        for (let y = 0; y < mapHeight; y++) {
            rawMap[y].push(...rawMap[y].slice(0, mapWidth).map((n) => wrap(n + i)));
        }
    }
    for (let i = 1; i < wrapTimes; i++) {
        for (let y = 0; y < mapHeight; y++) {
            rawMap.push(rawMap[y].map((n) => wrap(n + i)));
        }
    }

    mapWidth = rawMap[0].length;
    mapHeight = rawMap.length;
    const getHScore = (x: number, y: number) => mapWidth - x + (mapHeight - y) - 2;

    riskMap = rawMap.map((s, y) =>
        [...s].map((c, x) => ({
            x,
            y,
            risk: +c,
            pathRisk: 0,
            fScore: Infinity,
            gScore: Infinity,
            hScore: getHScore(x, y),
        })),
    );

    const start = riskMap[0][0];
    const end = riskMap[mapHeight - 1][mapWidth - 1];

    start.gScore = 0;
    start.fScore = start.hScore;

    AStarSearch(riskMap, start, end);

    let node = end;
    path = new Set();
    while (node) {
        path.add(node);
        node = node.cameFrom;
    }

    return end.pathRisk;
}

function draw(node: HTMLElement): void {
    const dotSize = 1;
    const ctx = createCanvas(node, riskMap[0].length * dotSize, riskMap.length * dotSize);

    ctx.fillStyle = 'white';
    for (let x = 0; x < riskMap[0].length; x++) {
        for (let y = 0; y < riskMap.length; y++) {
            let color = 'white';
            let fontWeight = 'normal';
            if (path.has(riskMap[y][x])) {
                color = '#5f5';
                fontWeight = 'bold';
            }
            text(
                ctx,
                riskMap[y][x].risk,
                x * dotSize + dotSize * 0.4,
                y * dotSize + dotSize * 0.8,
                color,
                dotSize,
                fontWeight,
            );
        }
    }
}

export function runDay15(): DayResults {
    return {
        results: [
            ['total risk', getTotalRisk()],
            ['total risk of wrapped map', getTotalRisk(5)],
        ],
        draw,
    };
}
