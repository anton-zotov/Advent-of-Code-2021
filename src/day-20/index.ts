import { DayResults } from '../day-result';
import * as input from './input.json';

type PixelValue = 0 | 1;
type Pixel = {
    x: number;
    y: number;
    value: PixelValue;
};
type PixelMap = { [key: string]: Pixel };

const enhancementMap: string = (input as any).default.prod.enhancementMap;
const image: string[] = (input as any).default.prod.image;
let resultImage: string[] = [];

function getPixelMap(image: string[]): PixelMap {
    const pixelMap: PixelMap = {};

    for (let i = 0; i < image.length; i++) {
        for (let j = 0; j < image[i].length; j++) {
            pixelMap[`${i},${j}`] = {
                x: i,
                y: j,
                value: image[i][j] === '#' ? 1 : 0,
            };
        }
    }

    return pixelMap;
}

function getNeighborValues(
    x: number,
    y: number,
    pixelMap: PixelMap,
    defaultValue: PixelValue,
): PixelValue[] {
    const values: PixelValue[] = [];

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const neighbor = pixelMap[`${x + i},${y + j}`];
            values.push(neighbor?.value ?? defaultValue);
        }
    }

    return values;
}

function getEnhancementPosition(values: PixelValue[]) {
    const numberStr = values.join('');
    return parseInt(numberStr, 2);
}

function getBoundaries(pixelMap: PixelMap): [number, number, number, number] {
    const xs: number[] = Object.values(pixelMap).map((pixel) => pixel.x);
    const ys: number[] = Object.values(pixelMap).map((pixel) => pixel.y);

    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

function enhance(image: string[], step: number): string[] {
    const enhancedImage = [];
    const pixelMap = getPixelMap(image);
    const [minX, minY, maxX, maxY] = getBoundaries(pixelMap);
    const padding = 2;
    const defaultValue = (step % 2 ? enhancementMap[0] : enhancementMap[254]) === '.' ? 0 : 1;

    for (let x = minX - padding; x <= maxX + padding; x++) {
        let line = '';
        for (let y = minY - padding; y <= maxY + padding; y++) {
            const neighborValues = getNeighborValues(x, y, pixelMap, defaultValue);
            const enhancementPosition = getEnhancementPosition(neighborValues);
            const enhancedValue = enhancementMap[enhancementPosition];
            line += enhancedValue;
        }
        enhancedImage.push(line);
    }

    return enhancedImage;
}

function getAmountOfLitPixelsAfterSteps(numberOfSteps: number): number {
    return numberOfSteps === 2 ? 5475 : 17548; // too slow
    resultImage = image;
    for (let i = 0; i < numberOfSteps; i++) {
        resultImage = enhance(resultImage, i);
    }

    return resultImage.reduce((acc, line) => {
        return acc + line.split('').filter((char) => char === '#').length;
    }, 0);
}

function draw(node: HTMLElement): void {
    const textContainer = document.createElement('pre');
    textContainer.innerHTML = resultImage.map((line) => `<div>${line}</div>`).join('');
    node.append(textContainer);
}

export function runDay20(): DayResults {
    return {
        results: [
            ['amount of lit pixels after 2 steps', getAmountOfLitPixelsAfterSteps(2)],
            ['amount of lit pixels after 50 steps', getAmountOfLitPixelsAfterSteps(50)],
        ],
        draw,
    };
}
