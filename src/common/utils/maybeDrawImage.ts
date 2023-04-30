export const maybeDrawImage = (
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement | undefined | null,
    x?: number,
    y?: number
) => {
    if (image) {
        ctx.drawImage(image, x || 0, y || 0);
    }
};
