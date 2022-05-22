import { DayResults } from '../day-result';
import * as input from './input.json';

type Node = {
    value: number;
    parent: Node;
    left: Node;
    right: Node;
    representation: string;
};

const data: string[] = (input as any).default;

function Node() {
    this.left = null;
    this.right = null;
    this.parent = null;
    this.value = null;
}
Node.prototype.toString = function () {
    if (this.value !== null) return this.value;
    return `[${this.left.toString()},${this.right.toString()}]`;
};

function cloneDeep(node: Node, parent: Node = null): Node {
    if (!node) return null;
    const clone: Node = { ...node };
    clone.left = cloneDeep(node.left, clone);
    clone.right = cloneDeep(node.right, clone);
    clone.parent = parent;
    return clone;
}

function parseNumber(tokens: string, pos: number): { node: Node; newPos: number } {
    const node: Node = new Node();
    let numStr = '';
    while (tokens[pos] >= '0' && tokens[pos] <= '9') {
        numStr += tokens[pos++];
    }
    node.value = parseInt(numStr, 10);
    return { node, newPos: pos };
}

function parseChild(tokens: string, pos: number, parent: Node): { node: Node; newPos: number } {
    let node: Node;
    let newPos: number;

    if (tokens[pos] === '[') {
        ({ node, newPos } = parseNode(tokens, pos + 1));
    } else {
        ({ node, newPos } = parseNumber(tokens, pos));
    }

    node.parent = parent;
    return { node, newPos };
}

function parseNode(tokens: string, pos = 1): { node: Node; newPos: number } {
    const node: Node = new Node();

    let { node: child, newPos } = parseChild(tokens, pos, node);
    pos = newPos + 1;
    node.left = child;

    ({ node: child, newPos } = parseChild(tokens, pos, node));
    node.right = child;

    return { node, newPos: newPos + 1 };
}

function* getRoot(): Generator<Node> {
    for (let tokens of data) {
        yield parseNode(tokens).node;
    }
    return null;
}

function traverse(node: Node, cb: (node: Node, depth?: number) => boolean, depth = 0): boolean {
    if (!node) return false;
    if (cb(node, depth)) return true;
    if (traverse(node.left, cb, depth + 1)) return true;
    if (traverse(node.right, cb, depth + 1)) return true;
    return false;
}

function explode(node: Node): void {
    function goDown(child: Node): boolean {
        if (!child) return false;
        const childBeingIncremented = childBeingExploded === 'right' ? 'left' : 'right';
        if (child[childBeingIncremented].value !== null) {
            child[childBeingIncremented].value += node[childBeingExploded].value;
            return true;
        }
        return goDown(child[childBeingIncremented]);
    }

    function goUp(parent: Node, cameFrom: Node): void {
        if (!parent) return;
        if (parent[childBeingExploded] === cameFrom) {
            goUp(parent.parent, parent);
            return;
        }
        if (parent[childBeingExploded].value !== null) {
            parent[childBeingExploded].value += node[childBeingExploded].value;
            return;
        } else {
            if (goDown(parent[childBeingExploded])) return;
        }
    }

    let childBeingExploded = 'right';
    goUp(node.parent, node);

    childBeingExploded = 'left';
    goUp(node.parent, node);

    node.value = 0;
    node.left = null;
    node.right = null;
}

function findNodeToExplode(root: Node): Node {
    let node = null;

    traverse(root, (curNode: Node, depth: number) => {
        if (depth >= 4 && curNode.value === null) {
            node = curNode;
            return true;
        }
        return false;
    });

    return node;
}

function split(node: Node): void {
    node.left = new Node();
    node.left.value = Math.floor(node.value / 2);
    node.left.parent = node;

    node.right = new Node();
    node.right.value = Math.ceil(node.value / 2);
    node.right.parent = node;

    node.value = null;
}

function findNodeToSplit(root: Node): Node {
    let node = null;

    traverse(root, (curNode: Node) => {
        if (curNode.value >= 10) {
            node = curNode;
            return true;
        }
        return false;
    });

    return node;
}

function reduce(root: Node) {
    while (true) {
        const nodeToExplode = findNodeToExplode(root);
        if (nodeToExplode) {
            explode(nodeToExplode);
            continue;
        }

        const nodeToSplit = findNodeToSplit(root);
        if (nodeToSplit) {
            split(nodeToSplit);
            continue;
        }

        break;
    }
}

function add(root1: Node, root2: Node): Node {
    const newRoot = new Node();

    newRoot.left = root1;
    root1.parent = newRoot;

    newRoot.right = root2;
    root2.parent = newRoot;

    reduce(newRoot);
    return newRoot;
}

function getMagnitude(root: Node): number {
    if (root.value !== null) return root.value;
    return getMagnitude(root.left) * 3 + getMagnitude(root.right) * 2;
}

function getTotalMagnitude(): number {
    const roots = [...getRoot()];
    let root = roots.shift();

    while (roots.length) {
        const root2 = roots.shift();
        root = add(root, root2);
    }

    return getMagnitude(root);
}

function getLargestMagnitudeOfAnySumOfTwo(): number {
    const roots = [...getRoot()];
    let maxMagnitude = -Infinity;

    for (let i = 0; i < roots.length; i++) {
        for (let j = 1; j < roots.length; j++) {
            if (i == j) continue;
            let root = add(cloneDeep(roots[i]), cloneDeep(roots[j]));
            maxMagnitude = Math.max(maxMagnitude, getMagnitude(root));
            
            root = add(cloneDeep(roots[j]), cloneDeep(roots[i]));
            maxMagnitude = Math.max(maxMagnitude, getMagnitude(root));
        }
    }

    return maxMagnitude;
}

export function runDay18(): DayResults {
    return {
        results: [
            ['the magnitude of the final sum', getTotalMagnitude()],
            [
                'the largest magnitude of any sum of two different snailfish numbers',
                getLargestMagnitudeOfAnySumOfTwo(),
            ],
        ],
    };
}
