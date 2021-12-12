import { DayResults } from '../day-result';
import * as input from './input.json';

type Board = number[][];
type Input = {
    draws: number[];
    boards: Board[];
};

const { draws, boards }: Input = (input as any).default;
const DRAWN = -1;

function checkColumn(board: Board, columnNum: number): boolean {
    for (let y = 0; y < board.length; y++) {
        if (board[y][columnNum] !== DRAWN) return false;
    }
    return true;
}

function checkWin(board: Board): boolean {
    for (let row of board) {
        if (row.every((cell) => cell === DRAWN)) return true;
    }
    for (let x = 0; x < board[0].length; x++) {
        if (checkColumn(board, x)) return true;
    }
    return false;
}

function mark(board: Board, draw: number): void {
    for (let row of board) {
        for (let i in row) {
            if (row[i] === draw) row[i] = DRAWN;
        }
    }
}

function getUnmarkedSum(board: Board): number {
    let sum = 0;
    for (let row of board) {
        for (let cell of row) {
            if (cell !== DRAWN) sum += cell;
        }
    }
    return sum;
}

function getWinnerScore({ draws, boards }: Input): number {
    for (let draw of draws) {
        for (let board of boards) {
            mark(board, draw);
            if (checkWin(board)) return getUnmarkedSum(board) * draw;
        }
    }
    return -1;
}

function getLastToWinScore({ draws, boards }: Input): number {
    let winningBoards = [];
    for (let draw of draws) {
        for (let i in boards) {
            if (winningBoards.includes(i)) continue;

            const board = boards[i];
            mark(board, draw);

            if (checkWin(board)) {
                winningBoards.push(i);
                if (winningBoards.length === boards.length) {
                    return getUnmarkedSum(board) * draw;
                }
            }
        }
    }
    return -1;
}

export function runDay4(): DayResults {
    return [
        ['winner score', getWinnerScore({ draws, boards })],
        ['last to win score', getLastToWinScore({ draws, boards })],
    ];
}
