import { DayResults } from '../day-result';
import { createCanvas } from '../utils/canvas';
import { createMatrix, rotateLeft, rotateRight } from '../utils/matrix';
import * as input from './input.json';

type Sheet = number[][];
const { dots, folds }: { dots: [number, number][]; folds: [string, number][] } = (input as any)
    .default;
const sheet: Sheet = prepareSheet();
let foldedSheet: Sheet = [];

function prepareSheet() {
    const width = Math.max(...dots.map(([x, y]) => x)) + 1;
    const height = Math.max(...dots.map(([x, y]) => y)) + 1;
    const sheet = createMatrix(width, height) as Sheet;

    for (const [x, y] of dots) {
        sheet[y][x] = 1;
    }

    return sheet;
}

function getDotsAfterFolding(maxNumberOfFolds: number = Infinity): number {
    foldedSheet = sheet;
    for (const [dir, line] of folds) {
        const foldFn = dir === 'y' ? foldUp : foldLeft;
        foldedSheet = foldFn(foldedSheet, line);
        if (--maxNumberOfFolds === 0) break;
    }
    return foldedSheet.flat().filter((n) => n === 1).length;
}

function foldUp(sheet: Sheet, line: number): Sheet {
    const bottomSize = sheet.length - line - 1;
    const newHeight = Math.max(line, bottomSize);
    const topOffset = newHeight - line;
    const bottomOffset = newHeight - bottomSize;
    const foldedSheet = [];

    for (let y = 0; y < newHeight; y++) {
        const row = [];
        for (let x = 0; x < sheet[0].length; x++) {
            const topSymbol = y >= topOffset ? sheet[y - topOffset][x] : 0;
            const bottomSymbol =
                y >= bottomOffset ? sheet[sheet.length - 1 - y - bottomOffset][x] : 0;
            row.push(topSymbol || bottomSymbol);
        }
        foldedSheet.push(row);
    }

    return foldedSheet;
}

function foldLeft(sheet: Sheet, line: number): Sheet {
    const foldedSheet = foldUp(rotateRight(sheet), line);
    return rotateLeft(foldedSheet);
}

function draw(node: HTMLElement): void {
    const dotSize = 10;
    const ctx = createCanvas(node, foldedSheet[0].length * dotSize, foldedSheet.length * dotSize);

    ctx.fillStyle = 'white';
    for (let x = 0; x < foldedSheet[0].length; x++) {
        for (let y = 0; y < foldedSheet.length; y++) {
            if (foldedSheet[y][x]) {
                ctx.fillRect(x * dotSize, y * dotSize, dotSize, dotSize);
            }
        }
    }
}

export function runDay13(): DayResults {
    return {
        results: [
            ['dots visible after the first fold instruction', getDotsAfterFolding(1)],
            ['dots visible after all fold instructions', getDotsAfterFolding()],
        ],
        draw,
    };
}
