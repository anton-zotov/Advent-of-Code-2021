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

export function rotateRight(matrix: any[][]): any[][] {
    const origWidth = matrix[0].length;
    const origHeight = matrix.length;
    const newMatrix = createMatrix(origHeight, origWidth);

    for (let x = 0; x < origWidth; x++) {
        for (let y = 0; y < origHeight; y++) {
            newMatrix[x][origHeight - y - 1] = matrix[y][x];
        }
    }

    return newMatrix;
}

export function rotateLeft(matrix: any[][]): any[][] {
    return rotateRight(rotateRight(rotateRight(matrix)));
}

export function createMatrix<T = number>(width: number, height: number, fill: number = 0): T[][] {
    return Array.from({ length: height }).map((_) =>
        Array.from({ length: width }).fill(fill),
    ) as T[][];
}
