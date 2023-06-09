import { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { isPointInRect, maybeDrawImage, PublicImage, usePublicImages } from '../../../../common';
import { PublicSound } from '../../../../common/enums/PublicSound';
import {
    Ending,
    GameScreen,
    getActiveScreen,
    getCurrentTarget,
    getIsHarvestComplete,
    navigateToScreen,
    playSound,
    setBackgroundMusic,
    setEnding,
} from '../../../../state';
import { StoreProps } from '../../../../state/store';
import { Canvas } from '../Canvas';
import { HUNT_BUTTON_RECT, OPERATE_BUTTON_RECT, SHOP_BUTTON_RECT } from './constants';

const connectMainCanvas = connect(
    createStructuredSelector({
        activeScreen: getActiveScreen,
        currentTarget: getCurrentTarget,
        isHarvestComplete: getIsHarvestComplete,
    }),
    {
        navigateToScreen,
        setEnding,
        playSound,
        setBackgroundMusic,
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
    isHarvestComplete,
    navigateToScreen,
    setEnding,
    playSound,
    setBackgroundMusic,
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
        if (currentTarget && activeScreen !== GameScreen.Operating && !isHarvestComplete) {
            maybeDrawImage(ctx, images.personSheetCover, 0, 0);
            maybeDrawImage(ctx, isHarvestHovered ? images.harvestActive : images.harvest, 0, 0);
        }

        maybeDrawImage(ctx, isShopHovered ? images.shopActive : images.shop, 0, 0);
        maybeDrawImage(ctx, isHuntHovered ? images.huntActive : images.hunt, 0, 0);
    }, [
        canvasRef.current,
        images,
        currentTarget,
        activeScreen,
        isHarvestHovered,
        isShopHovered,
        isHuntHovered,
        isHarvestComplete,
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

        setIsHarvestHovered(
            currentTarget !== null &&
                !isHarvestComplete &&
                isPointInRect({ x, y }, OPERATE_BUTTON_RECT)
        );
    };

    const handleMouseClick = () => {
        if (isShopHovered) {
            navigateToScreen(GameScreen.Shop);
        }

        if (isHuntHovered) {
            navigateToScreen(GameScreen.Hunt);
        }

        if (isHarvestHovered) {
            playSound(PublicSound.Zipper);
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
