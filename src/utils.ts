export function createCanvas(
    node: HTMLElement,
    width: number,
    height: number,
): CanvasRenderingContext2D {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.border = '1px solid black';
    node.append(canvas);

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    return ctx;
}

export function createMatrixIterator(matrix: any[][]) {
    return function* () {
        for (let x = 0; x < matrix[0].length; x++) {
            for (let y = 0; y < matrix.length; y++) {
                yield [x, y, matrix[y][x]];
            }
        }
    };
}

export function copyMatrix(matrix: any[][]) {
    return matrix.map((row) => [...row]);
}
