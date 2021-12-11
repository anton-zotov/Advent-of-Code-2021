import { DayResults } from '../day-result';
import * as input from './input.json';

const commands = (input as any).default;

enum Direction {
    forward = 'forward',
    down = 'down',
    up = 'up',
}

type Command = [string, number];

function getFinalPosition(commands: Command[]): number {
    let horPos = 0;
    let depth = 0;

    for (let [direction, distance] of commands) {
        switch (direction) {
            case Direction.forward:
                horPos += distance;
                break;
            case Direction.down:
                depth += distance;
                break;
            case Direction.up:
                depth -= distance;
                break;
        }
    }

    return horPos * depth;
}

function getFinalPositionUsingAim(commands: Command[]): number {
    let horPos = 0;
    let depth = 0;
    let aim = 0;

    for (let [direction, distance] of commands) {
        switch (direction) {
            case Direction.forward:
                horPos += distance;
                depth += aim * distance;
                break;
            case Direction.down:
                aim += distance;
                break;
            case Direction.up:
                aim -= distance;
                break;
        }
    }

    return horPos * depth;
}

export function runDay2(): DayResults {
    return [
        ['multiplication of final horizontal position by final depth', getFinalPosition(commands)],
        [
            'multiplication of final horizontal position by final depth using aim',
            getFinalPositionUsingAim(commands),
        ],
    ];
}
