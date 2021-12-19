import { DayResults } from '../day-result';
import { circle, createCanvas, line, text } from '../utils/canvas';
import { Node, traverseEdges } from '../utils/graph';
import * as input from './input.json';

type Connections = [string, string][];
interface CaveNode extends Node {
    isBig: boolean;
}

const caveConnectivity: Connections = (input as any).default;
let start: CaveNode;
let end: CaveNode;
let nodes: CaveNode[] = [];

buildGraph();

function buildGraph() {
    const nodesObj: { [key: string]: CaveNode } = {};

    function createNode(name: string): CaveNode {
        return {
            name,
            connections: new Set(),
            isBig: name[0].toUpperCase() === name[0],
            x: 200 + Math.random() * 100,
            y: 200 + Math.random() * 100,
            dx: 0,
            dy: 0,
        };
    }

    for (let [from, to] of caveConnectivity) {
        if (!nodesObj[from]) nodesObj[from] = createNode(from);
        if (!nodesObj[to]) nodesObj[to] = createNode(to);

        nodesObj[from].connections.add(nodesObj[to]);
        nodesObj[to].connections.add(nodesObj[from]);
    }

    start = nodesObj['start'];
    end = nodesObj['end'];
    nodes = Object.values(nodesObj);
}

function getPaths(canVisitAgain: boolean) {
    const paths = [];

    function traverse(
        node: CaveNode,
        canVisitAgain = true,
        currentPath: string[] = [],
        visited = new Set<Node>(),
    ) {
        if (visited.has(node)) {
            if (node !== start && node !== end && canVisitAgain) canVisitAgain = false;
            else return;
        }
        if (!node.isBig) visited.add(node);
        currentPath.push(node.name);
        if (node === end) {
            paths.push(currentPath);
            return;
        }
        for (const connectedNode of node.connections) {
            traverse(connectedNode as CaveNode, canVisitAgain, [...currentPath], new Set(visited));
        }
    }

    traverse(start, canVisitAgain);
    return paths;
}

function springForce(node1, node2) {
    const k = 0.001;
    const edgeLength = 80;

    const dist = Math.sqrt((node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2);
    const force = (dist - edgeLength) * k;

    node1.dx += (node2.x - node1.x) * force;
    node1.dy += (node2.y - node1.y) * force;
}

function chargeForce() {
    const K = 150;
    for (const node1 of nodes) {
        for (const node2 of nodes) {
            if (node1 !== node2 && !node1.connections.has(node2)) {
                const dist = Math.sqrt((node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2);
                node1.dx += (K * (node1.x - node2.x)) / dist ** 2;
                node1.dy += (K * (node1.y - node2.y)) / dist ** 2;
            }
        }
    }
}

function draw(node: HTMLElement): void {
    const size = 500;
    const startX = size / 2;
    const startY = 100;
    const endX = size / 2;
    const endY = 400;
    const ctx = createCanvas(node, size, size);

    function frame() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, size, size);

        for (const node of nodes) {
            for (const connectedNode of node.connections) {
                line(ctx, node.x, node.y, connectedNode.x, connectedNode.y);
            }
        }
        for (const node of nodes) {
            circle(ctx, node.x, node.y);
            text(ctx, node.name, node.x, node.y + 4);
        }
        for (const node of nodes) {
            node.x += node.dx;
            node.y += node.dy;
            node.dx = 0;
            node.dy = 0;
        }
        traverseEdges(start, springForce);
        chargeForce();

        start.dx = (startX - start.x) * 0.5;
        start.dy = (startY - start.y) * 0.5;
        end.dx = (endX - end.x) * 0.5;
        end.dy = (endY - end.y) * 0.5;

        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
}

export function runDay12(): DayResults {
    return {
        results: [
            ['amount of paths', getPaths(false).length],
            ['amount of paths when allowed to visit twice', getPaths(true).length],
        ],
        draw,
    };
}
