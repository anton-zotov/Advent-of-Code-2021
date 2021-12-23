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

export function circle(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    strokeColor = 'black',
    fillColor = 'white',
) {
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.ellipse(x, y, 20, 20, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

export function line(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color = 'black',
) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

export function text(ctx, text, x, y, color = 'black', fontSize = 16, fontWeight = 'normal') {
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px serif`;

    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
}
