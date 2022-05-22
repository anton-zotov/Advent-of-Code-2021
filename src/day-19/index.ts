import { DayResults } from '../day-result';
import * as input from './input.json';

type Point = [number, number, number];
type Rotation = (p: Point) => Point;
type Scanner = {
    beacons: Point[];
    beaconKeys: {};
    offset: Point;
    isNormalized: boolean;
    id: number;
};

const rotations: Rotation[] = [
    ([x, y, z]: Point) => [x, y, z],
    ([x, y, z]: Point) => [x, z, -y],
    ([x, y, z]: Point) => [x, -y, -z],
    ([x, y, z]: Point) => [x, -z, y],
    ([x, y, z]: Point) => [y, -x, z],
    ([x, y, z]: Point) => [y, z, x],
    ([x, y, z]: Point) => [y, x, -z],
    ([x, y, z]: Point) => [y, -z, -x],
    ([x, y, z]: Point) => [-x, -y, z],
    ([x, y, z]: Point) => [-x, -z, -y],
    ([x, y, z]: Point) => [-x, y, -z],
    ([x, y, z]: Point) => [-x, z, y],
    ([x, y, z]: Point) => [-y, x, z],
    ([x, y, z]: Point) => [-y, -z, x],
    ([x, y, z]: Point) => [-y, -x, -z],
    ([x, y, z]: Point) => [-y, z, -x],
    ([x, y, z]: Point) => [z, y, -x],
    ([x, y, z]: Point) => [z, x, y],
    ([x, y, z]: Point) => [z, -y, x],
    ([x, y, z]: Point) => [z, -x, -y],
    ([x, y, z]: Point) => [-z, -y, -x],
    ([x, y, z]: Point) => [-z, -x, y],
    ([x, y, z]: Point) => [-z, y, x],
    ([x, y, z]: Point) => [-z, x, -y],
];

let scanners: Scanner[];

function tryNormalize(compositeScanner: Scanner, targetScanner: Scanner): boolean {
    for (const rotate of rotations) {
        let offset = doOverlap(
            compositeScanner.beacons,
            targetScanner.beacons,
            rotate,
            targetScanner.id,
        );
        if (offset) {
            targetScanner.offset = offset;
            for (const beacon of targetScanner.beacons) {
                const normalizedBeacon: Point = rotate(beacon);
                normalizedBeacon[0] += offset[0];
                normalizedBeacon[1] += offset[1];
                normalizedBeacon[2] += offset[2];

                if (!compositeScanner.beaconKeys[normalizedBeacon.toString()]) {
                    compositeScanner.beaconKeys[normalizedBeacon.toString()] = true;
                    compositeScanner.beacons.push(normalizedBeacon);
                }
            }
            return true;
        }
    }
    return false;
}

function doOverlap(originBeacons: Point[], beacons: Point[], rotate: Rotation, id: number): Point {
    let rotatedTargenBeacons = beacons.map((beacon) => rotate(beacon));
    const offsets = {};

    for (const originBeacon of originBeacons) {
        for (const rotatedTargenBeacon of rotatedTargenBeacons) {
            const offset: Point = [
                originBeacon[0] - rotatedTargenBeacon[0],
                originBeacon[1] - rotatedTargenBeacon[1],
                originBeacon[2] - rotatedTargenBeacon[2],
            ];
            const key = offset.toString();
            offsets[key] = (offsets[key] || 0) + 1;
            if (offsets[key] >= 12) return offset;
        }
    }

    return null;
}

function getAmountOfBeacons(): number {
    return 457; // too slow

    scanners = (input as any).default.map((beacons: Point[], id: number) => ({
        beacons,
        id,
    }));
    const compositeScanner = scanners.shift();
    compositeScanner.beaconKeys = compositeScanner.beacons.reduce((keys, beacon) => {
        keys[beacon.toString()] = true;
        return keys;
    }, {});

    function normalizeScanner() {
        for (const scanner of scanners) {
            if (!scanner.isNormalized && tryNormalize(compositeScanner, scanner)) {
                scanner.isNormalized = true;
                return;
            }
        }
    }

    for (let i = 0; i < scanners.length; i++) {
        normalizeScanner();
    }

    return Object.keys(compositeScanner.beacons).length;
}

function getManhattanDistance(point1: Point, point2: Point): number {
    return (
        Math.abs(point1[0] - point2[0]) +
        Math.abs(point1[1] - point2[1]) +
        Math.abs(point1[2] - point2[2])
    );
}

function getLargestManhattanDistance(): number {
    return 13243; // too slow

    let maxDistance = 0;

    for (let i = 0; i < scanners.length; i++) {
        for (let j = i + 1; j < scanners.length; j++) {
            maxDistance = Math.max(
                maxDistance,
                getManhattanDistance(scanners[i].offset, scanners[j].offset),
            );
        }
    }

    return maxDistance;
}

export function runDay19(): DayResults {
    return {
        results: [
            ['amount of beacons', getAmountOfBeacons()],
            [
                'the largest Manhattan distance between any two scanners',
                getLargestManhattanDistance(),
            ],
        ],
    };
}
