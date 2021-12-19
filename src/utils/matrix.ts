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
