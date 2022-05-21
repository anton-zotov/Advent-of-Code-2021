import { DayResults } from '../day-result';
import * as input from './input.json';
import { createCanvas, line, text } from '../utils/canvas';

type Area = {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
};

type Point = {
    x: number;
    y: number;
};

const targetArea: Area = (input as any).default;
let bestSteps: Point[] = [];

function isInTargetArea(x: number, y: number): boolean {
    return x >= targetArea.x1 && x <= targetArea.x2 && y >= targetArea.y1 && y <= targetArea.y2;
}

function isOvershoot(x: number, y: number): boolean {
    return x > targetArea.x2 || y > targetArea.y2;
}

function getHighestYPosition(): number {
    let bestMaxY = -Infinity;

    for (let i = 0; i <= 120; i++) {
        const steps: Point[] = [];
        let x = 0;
        let y = 0;
        let dx = 17;
        let dy = -i;
        let stepsRemaining = Infinity;
        let maxY = -Infinity;
        let didHit = false;

        while (stepsRemaining) {
            steps.push({ x, y });
            maxY = Math.max(maxY, -y);
            x += dx;
            y += dy;
            dx = Math.max(0, dx - 1);
            dy += 1;
            stepsRemaining--;

            if (isInTargetArea(x, y)) {
                didHit = true;
            }

            if (isOvershoot(x, y) && stepsRemaining === Infinity) stepsRemaining = 3;
        }
        if (!didHit) maxY = -1;
        if (maxY > bestMaxY) {
            bestMaxY = maxY;
            bestSteps = steps;
        }
    }

    return bestMaxY;
}

function getGoodVelocityCount(): number {
    let goodVelocityCount = 0;

    for (let startDx = 3; startDx <= 300; startDx++) {
        for (let startDy = 300; startDy >= -300; startDy--) {
            let dx = startDx;
            let dy = startDy;
            let x = 0;
            let y = 0;

            while (!isOvershoot(x, y)) {
                x += dx;
                y += dy;
                dx = Math.max(0, dx - 1);
                dy += 1;

                if (isInTargetArea(x, y)) {
                    goodVelocityCount++;
                    break;
                }
            }
        }
    }
    return goodVelocityCount;
}

function draw(node: HTMLElement): void {
    const cellSize = 1;
    const dotSize = 5;
    const yOffset = 6500;
    const padding = 20;
    const ctx = createCanvas(
        node,
        (targetArea.x2 + padding) * cellSize,
        (targetArea.y2 + yOffset + padding) * cellSize,
    );

    ctx.fillStyle = 'green';
    ctx.fillRect(
        targetArea.x1 * cellSize,
        (targetArea.y1 + yOffset) * cellSize,
        (targetArea.x2 - targetArea.x1 + 1) * cellSize,
        (targetArea.y2 - targetArea.y1 + 1) * cellSize,
    );

    ctx.fillStyle = 'red';
    for (const { x, y } of bestSteps) {
        ctx.fillRect(x * cellSize, (y + yOffset) * cellSize, dotSize, dotSize);
    }
}

export function runDay17(): DayResults {
    return {
        results: [
            ['highest y position', getHighestYPosition()],
            ['number of velocities that hit the target area', getGoodVelocityCount()],
        ],
        draw,
    };
}
