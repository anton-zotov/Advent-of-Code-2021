import { DayResults } from '../day-result';
import * as input from './input.json';

type Type = 'literal' | 'operator';

enum TypeId {
    Sum = 0,
    Product = 1,
    Minimum = 2,
    Maximum = 3,
    Literal = 4,
    GreaterThan = 5,
    LessThan = 6,
    EqualTo = 7,
}

type Packet = {
    version?: number;
    type?: Type;
    typeId?: number;
    length?: number;
    literalValue?: number;
    subpackets?: Packet[];
};

function hexToBinary(hex: string): string {
    let binary = '';
    for (const c of hex) {
        binary += parseInt(c, 16).toString(2).padStart(4, '0');
    }
    return binary;
}

function parseLiteralValue(binary: string): { value: number; length: number } {
    let binaryValue = '';
    let pos = 6;
    let prefix: string;

    do {
        prefix = binary[pos];
        binaryValue += binary.slice(pos + 1, pos + 5);
        pos += 5;
    } while (prefix !== '0');

    return { value: parseInt(binaryValue, 2), length: pos };
}

function parsePacket(binary: string): Packet {
    const packet: Packet = { length: 0, subpackets: [] };
    packet.version = parseInt(binary.slice(0, 3), 2);
    packet.typeId = parseInt(binary.slice(3, 6), 2);
    packet.type = packet.typeId === 4 ? 'literal' : 'operator';

    if (packet.type === 'literal') {
        const { value, length } = parseLiteralValue(binary);
        packet.literalValue = value;
        packet.length = length;
    } else {
        const lengthTypeId = binary[6];
        if (lengthTypeId === '0') {
            packet.length = 7 + 15;
            const subpacketsLength = parseInt(binary.slice(7, 7 + 15), 2);
            const subpacketsBinary = binary.slice(7 + 15, 7 + 15 + subpacketsLength);

            let pos = 0;
            while (pos < subpacketsLength) {
                const subpacket = parsePacket(subpacketsBinary.slice(pos));
                packet.subpackets.push(subpacket);
                packet.length += subpacket.length;
                pos += subpacket.length;
            }
        } else {
            packet.length = 7 + 11;
            const subpacketCount = parseInt(binary.slice(7, 7 + 11), 2);
            let pos = 7 + 11;

            for (let i = 0; i < subpacketCount; i++) {
                const subpacket = parsePacket(binary.slice(pos));
                packet.subpackets.push(subpacket);
                packet.length += subpacket.length;
                pos += subpacket.length;
            }
        }
    }

    return packet;
}

function traverse(packet: Packet, cb: (packet: Packet) => void) {
    if (!packet) return;
    cb(packet);
    for (const subpacket of packet.subpackets) {
        traverse(subpacket, cb);
    }
}

function getOutermostPacket(): Packet {
    const hex = (input as any).default;
    const binary = hexToBinary(hex);
    return parsePacket(binary);
}

function getVersionSum() {
    let versionSum = 0;
    traverse(getOutermostPacket(), (packet: Packet) => (versionSum += packet.version));
    return versionSum;
}

function evaluate(packet: Packet): number {
    switch (packet.typeId) {
        case TypeId.Literal:
            return packet.literalValue;
        case TypeId.Sum:
            return packet.subpackets.reduce((sum, packet) => sum + evaluate(packet), 0);
        case TypeId.Product:
            return packet.subpackets.reduce((prod, packet) => prod * evaluate(packet), 1);
        case TypeId.Minimum:
            return Math.min(...packet.subpackets.map((packet) => evaluate(packet)));
        case TypeId.Maximum:
            return Math.max(...packet.subpackets.map((packet) => evaluate(packet)));
        case TypeId.GreaterThan:
            return evaluate(packet.subpackets[0]) > evaluate(packet.subpackets[1]) ? 1 : 0;
        case TypeId.LessThan:
            return evaluate(packet.subpackets[0]) < evaluate(packet.subpackets[1]) ? 1 : 0;
        case TypeId.EqualTo:
            return evaluate(packet.subpackets[0]) === evaluate(packet.subpackets[1]) ? 1 : 0;
    }
    return 0;
}


function getEvaluation(): number {
    return evaluate(getOutermostPacket());
}

export function runDay16(): DayResults {
    return {
        results: [
            ['version sum', getVersionSum()],
            ['evaluation', getEvaluation()],
        ],
    };
}
