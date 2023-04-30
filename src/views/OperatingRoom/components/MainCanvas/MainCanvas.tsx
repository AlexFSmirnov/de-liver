import { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { isPointInRect, maybeDrawImage, PublicImage, usePublicImages } from '../../../../common';
import { GameScreen, getActiveScreen, getCurrentTarget, navigateToScreen } from '../../../../state';
import { StoreProps } from '../../../../state/store';
import { Canvas } from '../Canvas';
import { HUNT_BUTTON_RECT, OPERATE_BUTTON_RECT, SHOP_BUTTON_RECT } from './constants';

const connectMainCanvas = connect(
    createStructuredSelector({
        activeScreen: getActiveScreen,
        currentTarget: getCurrentTarget,
    }),
    {
        navigateToScreen,
    }
);

type MainCanvasProps = StoreProps<typeof connectMainCanvas>;

const mainCanvasImages = {
    base: PublicImage.Base,
    basePerson: PublicImage.BasePerson,
    personSheetCover: PublicImage.PersonSheetCover,

    harvest: PublicImage.Harvest,
    harvestActive: PublicImage.HarvestActive,
    shop: PublicImage.Shop,
    shopActive: PublicImage.ShopActive,
    hunt: PublicImage.Hunt,
    huntActive: PublicImage.HuntActive,
};

const MainCanvasBase: React.FC<MainCanvasProps> = ({
    activeScreen,
    currentTarget,
    navigateToScreen,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [isShopHovered, setIsShopHovered] = useState(false);
    const [isHuntHovered, setIsHuntHovered] = useState(false);
    const [isHarvestHovered, setIsHarvestHovered] = useState(false);

    const images = usePublicImages(mainCanvasImages);

    const draw = useCallback(() => {
        const { current: canvas } = canvasRef;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        maybeDrawImage(ctx, currentTarget ? images.basePerson : images.base, 0, 0);
        if (currentTarget && activeScreen === GameScreen.Main) {
            maybeDrawImage(ctx, images.personSheetCover, 0, 0);
            maybeDrawImage(ctx, isHarvestHovered ? images.harvestActive : images.harvest, 0, 0);
        }

        maybeDrawImage(ctx, isShopHovered ? images.shopActive : images.shop, 0, 0);
        maybeDrawImage(ctx, isHuntHovered ? images.huntActive : images.hunt, 0, 0);

        // ctx.fillStyle = 'red';
        // ctx.fillRect(canvas.width / 2 - 1, canvas.height / 2 - 1, 2, 2);

        // ctx.fillStyle = 'blue';
        // ctx.fillRect(canvas.width / 2 - 1 - 19, canvas.height / 2 - 1 + 10, 2, 2);
    }, [
        canvasRef.current,
        images,
        currentTarget,
        activeScreen,
        isHarvestHovered,
        isShopHovered,
        isHuntHovered,
    ]);

    useEffect(draw, [draw, canvasRef.current]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const { current: canvas } = canvasRef;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        const x = (screenX / rect.width) * canvas.width;
        const y = (screenY / rect.height) * canvas.height;

        setIsShopHovered(isPointInRect({ x, y }, SHOP_BUTTON_RECT));
        setIsHuntHovered(isPointInRect({ x, y }, HUNT_BUTTON_RECT));

        setIsHarvestHovered(currentTarget !== null && isPointInRect({ x, y }, OPERATE_BUTTON_RECT));
    };

    const handleMouseClick = () => {
        if (isShopHovered) {
            console.log('shop');
        }

        if (isHuntHovered) {
            console.log('hunt');
        }

        if (isHarvestHovered) {
            navigateToScreen(GameScreen.Operating);
        }
    };

    return (
        <Canvas
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onClick={handleMouseClick}
            isCursorPointer={isHuntHovered || isShopHovered || isHarvestHovered}
        />
    );
};

export const MainCanvas = connectMainCanvas(MainCanvasBase);
