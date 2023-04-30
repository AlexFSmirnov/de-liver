export interface Point {
    x: number;
    y: number;
}

export interface Rect {
    top: number;
    left: number;
    right: number;
    bottom: number;
}

export const isPointInRect = (point: Point, rect: Rect) => {
    const { x, y } = point;
    const { top, left, right, bottom } = rect;

    return x >= left && x <= right && y >= top && y <= bottom;
};
