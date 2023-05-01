import { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
    isPointInRect,
    maybeDrawImage,
    Organ,
    PublicImage,
    usePublicImages,
} from '../../../../common';
import {
    Ending,
    GameScreen,
    getActiveScreen,
    getCurrentTarget,
    getIsHarvestComplete,
    sendBubbleMessage,
    setEnding,
    setMinigameOrgan,
} from '../../../../state';
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
        isHarvestComplete: getIsHarvestComplete,
    }),
    {
        setMinigameOrgan,
        sendBubbleMessage,
        setEnding,
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
    operateCyborg: PublicImage.OperateCyborg,
    operateReptiloid: PublicImage.OperateReptiloid,
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
    isHarvestComplete,
    setMinigameOrgan,
    sendBubbleMessage,
    setEnding,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [currentHarvestStage, setCurrentHarvestStage] = useState(HarvestStage.Skin);
    const [isMouseOverCurrentOrgan, setIsMouseOverCurrentOrgan] = useState(false);

    const images = usePublicImages(harvestCanvasImages);

    useEffect(() => {
        setCurrentHarvestStage(HarvestStage.Skin);
    }, [currentTarget]);

    const draw = useCallback(() => {
        const { current: canvas } = canvasRef;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        maybeDrawImage(ctx, images.operateBackground);
        maybeDrawImage(ctx, images.operateSpine);

        if (
            currentHarvestStage === HarvestStage.Liver &&
            (currentTarget?.isReptiloid || currentTarget?.isCyborg)
        ) {
            if (currentTarget?.isCyborg) {
                maybeDrawImage(ctx, images.operateCyborg);
                maybeDrawImage(ctx, images.operateTopCover);
                sendBubbleMessage('Uhhh... What?');
                setTimeout(() => {
                    setEnding(Ending.Cyborg);
                }, 2000);
                return;
            }

            if (currentTarget?.isReptiloid) {
                maybeDrawImage(ctx, images.operateReptiloid);
                maybeDrawImage(ctx, images.operateTopCover);
                sendBubbleMessage('Uhhh... What?');
                setTimeout(() => {
                    setEnding(Ending.Reptiloid);
                }, 2000);
                return;
            }
        }

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
        if (currentHarvestStage <= HarvestStage.Liver) {
            maybeDrawImage(
                ctx,
                isMouseOverCurrentOrgan && currentHarvestStage === HarvestStage.Liver
                    ? images.operateLiverActive
                    : images.operateLiver
            );
        }
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
        if (
            !currentTarget ||
            !isMouseOverCurrentOrgan ||
            currentHarvestStage === HarvestStage.Complete
        ) {
            return;
        }

        setIsMouseOverCurrentOrgan(false);

        // TODO: Add visuals for reptiloids and cyborgs
        const { quality } = currentTarget;
        switch (currentHarvestStage) {
            case HarvestStage.Liver:
                setMinigameOrgan({ organ: Organ.Liver, quality });
                break;
            case HarvestStage.Stomach:
                setMinigameOrgan({ organ: Organ.Stomach, quality });
                break;
            case HarvestStage.LargeIntestine:
                setMinigameOrgan({ organ: Organ.LargeIntestine, quality });
                break;
            case HarvestStage.SmallIntestine:
                setMinigameOrgan({ organ: Organ.SmallIntestine, quality });
                break;
            case HarvestStage.Kidneys:
                setMinigameOrgan({ organ: Organ.Kidneys, quality });
                break;
            default:
                break;
        }

        if (currentHarvestStage === HarvestStage.Skin) {
            setCurrentHarvestStage(currentHarvestStage + 1);
        } else {
            setTimeout(() => {
                setCurrentHarvestStage(currentHarvestStage + 1);
            }, 400);
        }
    };

    if (currentTarget && (activeScreen === GameScreen.Operating || isHarvestComplete)) {
        return (
            <Canvas
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onClick={handleMouseClick}
                style={{
                    pointerEvents: activeScreen === GameScreen.Operating ? 'auto' : 'none',
                }}
            />
        );
    }

    return null;
};

export const HarvestCanvas = connectHarvestCanvas(HarvestCanvasBase);
