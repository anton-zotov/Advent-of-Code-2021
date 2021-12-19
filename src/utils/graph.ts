export interface Node {
    connections: Set<Node>;
    name?: string;
    x?: number;
    y?: number;
    dx?: number;
    dy?: number;
}

export function traverseEdges(node: Node, cb: (node: Node, connectedNode: Node) => void): void {
    const visited = new Set();
    go(node);

    function go(node: Node): void {
        if (visited.has(node)) return;
        visited.add(node);
        for (const connectedNode of node.connections) {
            cb(node, connectedNode);
            go(connectedNode);
        }
    }
}
