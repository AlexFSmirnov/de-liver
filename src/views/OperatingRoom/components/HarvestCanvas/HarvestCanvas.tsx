import { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { isPointInRect, maybeDrawImage, PublicImage, usePublicImages } from '../../../../common';
import { GameScreen, getActiveScreen, getCurrentTarget, navigateToScreen } from '../../../../state';
import { StoreProps } from '../../../../state/store';
import { Canvas } from '../Canvas';
import {
    KIDNEYS_POINTS,
    LARGE_INTESTINE_POINTS,
    LIVER_POINTS,
    SKIN_RECT,
    SMALL_INTESTINE_RECT,
    STOMACH_POINTS,
} from './constants';

const connectHarvestCanvas = connect(
    createStructuredSelector({
        activeScreen: getActiveScreen,
        currentTarget: getCurrentTarget,
    }),
    {
        navigateToScreen,
    }
);

type HarvestCanvasProps = StoreProps<typeof connectHarvestCanvas>;

const harvestCanvasImages = {
    operateBackground: PublicImage.OperateBackground,
    operateKidneys: PublicImage.OperateKidneys,
    operateKidneysActive: PublicImage.OperateKidneysActive,
    operateLargeIntestine: PublicImage.OperateLargeIntestine,
    operateLargeIntestineActive: PublicImage.OperateLargeIntestineActive,
    operateLiver: PublicImage.OperateLiver,
    operateLiverActive: PublicImage.OperateLiverActive,
    operateSmallIntestine: PublicImage.OperateSmallIntestine,
    operateSmallIntestineActive: PublicImage.OperateSmallIntestineActive,
    operateStomach: PublicImage.OperateStomach,
    operateStomachActive: PublicImage.OperateStomachActive,
    operateSkinCover: PublicImage.OperateSkinCover,
    operateSpine: PublicImage.OperateSpine,
    operateTopCover: PublicImage.OperateTopCover,
};

enum HarvestStage {
    Skin,
    Liver,
    Stomach,
    LargeIntestine,
    SmallIntestine,
    Kidneys,
    Complete,
}

const HarvestCanvasBase: React.FC<HarvestCanvasProps> = ({
    activeScreen,
    currentTarget,
    navigateToScreen,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [currentHarvestStage, setCurrentHarvestStage] = useState(HarvestStage.Skin);
    const [isMouseOverCurrentOrgan, setIsMouseOverCurrentOrgan] = useState(false);

    const images = usePublicImages(harvestCanvasImages);

    const draw = useCallback(() => {
        const { current: canvas } = canvasRef;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        maybeDrawImage(ctx, images.operateBackground);
        maybeDrawImage(ctx, images.operateSpine);

        if (currentHarvestStage <= HarvestStage.Kidneys)
            maybeDrawImage(
                ctx,
                isMouseOverCurrentOrgan && currentHarvestStage === HarvestStage.Kidneys
                    ? images.operateKidneysActive
                    : images.operateKidneys
            );
        if (currentHarvestStage <= HarvestStage.SmallIntestine)
            maybeDrawImage(
                ctx,
                isMouseOverCurrentOrgan && currentHarvestStage === HarvestStage.SmallIntestine
                    ? images.operateSmallIntestineActive
                    : images.operateSmallIntestine
            );
        if (currentHarvestStage <= HarvestStage.LargeIntestine)
            maybeDrawImage(
                ctx,
                isMouseOverCurrentOrgan && currentHarvestStage === HarvestStage.LargeIntestine
                    ? images.operateLargeIntestineActive
                    : images.operateLargeIntestine
            );
        if (currentHarvestStage <= HarvestStage.Stomach)
            maybeDrawImage(
                ctx,
                isMouseOverCurrentOrgan && currentHarvestStage === HarvestStage.Stomach
                    ? images.operateStomachActive
                    : images.operateStomach
            );
        if (currentHarvestStage <= HarvestStage.Liver)
            maybeDrawImage(
                ctx,
                isMouseOverCurrentOrgan && currentHarvestStage === HarvestStage.Liver
                    ? images.operateLiverActive
                    : images.operateLiver
            );
        if (currentHarvestStage <= HarvestStage.Skin) maybeDrawImage(ctx, images.operateSkinCover);

        maybeDrawImage(ctx, images.operateTopCover);
    }, [
        canvasRef.current,
        images,
        currentTarget,
        activeScreen,
        currentHarvestStage,
        isMouseOverCurrentOrgan,
    ]);

    useEffect(draw, [draw, canvasRef.current]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const { current: canvas } = canvasRef;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        const x = Math.round((screenX / rect.width) * canvas.width);
        const y = Math.round((screenY / rect.height) * canvas.height);

        switch (currentHarvestStage) {
            case HarvestStage.Skin:
                setIsMouseOverCurrentOrgan(isPointInRect({ x, y }, SKIN_RECT));
                break;
            case HarvestStage.Liver:
                setIsMouseOverCurrentOrgan(LIVER_POINTS.some((p) => p.x === x && p.y === y));
                break;
            case HarvestStage.Stomach:
                setIsMouseOverCurrentOrgan(STOMACH_POINTS.some((p) => p.x === x && p.y === y));
                break;
            case HarvestStage.LargeIntestine:
                setIsMouseOverCurrentOrgan(
                    LARGE_INTESTINE_POINTS.some((p) => p.x === x && p.y === y)
                );
                break;
            case HarvestStage.SmallIntestine:
                setIsMouseOverCurrentOrgan(isPointInRect({ x, y }, SMALL_INTESTINE_RECT));
                break;
            case HarvestStage.Kidneys:
                setIsMouseOverCurrentOrgan(KIDNEYS_POINTS.some((p) => p.x === x && p.y === y));
                break;
            default:
                break;
        }
    };

    const handleMouseClick = () => {
        if (!isMouseOverCurrentOrgan || currentHarvestStage === HarvestStage.Complete) {
            return;
        }

        setIsMouseOverCurrentOrgan(false);
        setCurrentHarvestStage(currentHarvestStage + 1);

        if (currentHarvestStage === HarvestStage.Kidneys) {
            console.log('Harvest complete!');
        }
    };

    if (activeScreen !== GameScreen.Operating) {
        return null;
    }

    return <Canvas ref={canvasRef} onMouseMove={handleMouseMove} onClick={handleMouseClick} />;
};

export const HarvestCanvas = connectHarvestCanvas(HarvestCanvasBase);
