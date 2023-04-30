import { useCallback, useEffect, useRef, useState } from 'react';
import { PublicImage, usePublicImages } from '../../../../common';
import { Canvas } from '../Canvas';

const maybeDrawImage = (
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement | undefined | null,
    x: number,
    y: number
) => {
    if (image) {
        ctx.drawImage(image, x, y);
    }
};

interface Point {
    x: number;
    y: number;
}

interface Rect {
    top: number;
    left: number;
    right: number;
    bottom: number;
}

const isPointInRect = (point: Point, rect: Rect) => {
    const { x, y } = point;
    const { top, left, right, bottom } = rect;

    return x >= left && x <= right && y >= top && y <= bottom;
};

const SHOP_BUTTON_RECT = {
    top: 22,
    left: 124,
    right: 208,
    bottom: 48,
};

const HUNT_BUTTON_RECT = {
    top: 175,
    left: 245,
    right: 298,
    bottom: 215,
};

export const MainCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [isShopHovered, setIsShopHovered] = useState(false);
    const [isHuntHovered, setIsHuntHovered] = useState(false);
    const [isOperateHovered, setIsOperateHovered] = useState(false);

    const images = usePublicImages({
        base: PublicImage.Base,
        basePerson: PublicImage.BasePerson,
        personSheetCover: PublicImage.PersonSheetCover,

        harvest: PublicImage.Harvest,
        harvestActive: PublicImage.HarvestActive,
        shop: PublicImage.Shop,
        shopActive: PublicImage.ShopActive,
        hunt: PublicImage.Hunt,
        huntActive: PublicImage.HuntActive,
    });

    const draw = useCallback(() => {
        const { current: canvas } = canvasRef;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        maybeDrawImage(ctx, images.base, 0, 0);

        maybeDrawImage(ctx, isShopHovered ? images.shopActive : images.shop, 0, 0);
        maybeDrawImage(ctx, isHuntHovered ? images.huntActive : images.hunt, 0, 0);
    }, [canvasRef.current, images]);

    useEffect(draw, [draw, canvasRef.current]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        // log current mouse position
        const { current: canvas } = canvasRef;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        // Scale to fit canvas coord system
        const x = (screenX / rect.width) * canvas.width;
        const y = (screenY / rect.height) * canvas.height;

        setIsShopHovered(isPointInRect({ x, y }, SHOP_BUTTON_RECT));
        setIsHuntHovered(isPointInRect({ x, y }, HUNT_BUTTON_RECT));

        console.log({ x, y });
    };

    return (
        <Canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            isCursorPointer={isHuntHovered || isShopHovered}
        />
    );
};
