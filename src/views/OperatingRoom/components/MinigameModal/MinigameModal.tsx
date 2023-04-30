import { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { isPointInRect, maybeDrawImage, PublicImage, usePublicImages } from '../../../../common';
import {
    GameScreen,
    getActiveScreen,
    getCurrentMinigameOrgan,
    getCurrentTarget,
    MinigameOrgan,
    navigateToScreen,
} from '../../../../state';
import { StoreProps } from '../../../../state/store';
import { Canvas } from '../Canvas';
import { MinigameCanvas, MinigameModalContainer, MinigameModalImage } from './style';

const connectMinigameModal = connect(
    createStructuredSelector({
        activeScreen: getActiveScreen,
        currentTarget: getCurrentTarget,
        currentOrgan: getCurrentMinigameOrgan,
    }),
    {
        navigateToScreen,
    }
);

// TODO: This will depend on the tools that are purchased
const TOOLS_LEVEL = 2;

type MinigameModalProps = StoreProps<typeof connectMinigameModal>;

const minigameModalImages = {
    kidneysCutout: PublicImage.KidneysCutout,
    largeIntestineCutout: PublicImage.LargeIntestineCutout,
    liverCutout: PublicImage.LiverCutout,
    smallIntestineCutout: PublicImage.SmallIntestineCutout,
    stomachCutout: PublicImage.StomachCutout,
    liverTools1: PublicImage.LiverTools1,
    liverTools2: PublicImage.LiverTools2,
    liverTools3: PublicImage.LiverTools3,
};

const MinigameModalBase: React.FC<MinigameModalProps> = ({
    activeScreen,
    currentTarget,
    currentOrgan,
    navigateToScreen,
}) => {
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const images = usePublicImages(minigameModalImages);

    useEffect(() => {
        const { current: canvas } = canvasRef;
        if (!canvas) return;

        const { width, height } = canvas.getBoundingClientRect();
        setCanvasSize({ width, height });
    }, [canvasRef.current]);

    const draw = useCallback(() => {
        const { current: canvas } = canvasRef;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let image;
        switch (currentOrgan) {
            case MinigameOrgan.Liver:
                image = [images.liverTools1, images.liverTools2, images.liverTools3][TOOLS_LEVEL];
                break;
            case MinigameOrgan.Kidneys:
                image = images.kidneysCutout;
                break;
            case MinigameOrgan.Stomach:
                image = images.stomachCutout;
                break;
            case MinigameOrgan.SmallIntestine:
                image = images.smallIntestineCutout;
                break;
            case MinigameOrgan.LargeIntestine:
                image = images.largeIntestineCutout;
                break;
            default:
                return;
        }

        if (!image) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        console.log(image.width, image.height);

        const targetHeight = canvas.height * 0.9;
        const targetWidth = (image.width / image.height) * targetHeight;

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(
            image,
            0,
            0,
            image.width,
            image.height,
            (canvas.width - targetWidth) / 2,
            (canvas.height - targetHeight) / 2,
            targetWidth,
            targetHeight
        );
    }, [canvasRef.current, images, currentTarget, activeScreen, canvasSize]);

    useEffect(draw, [draw, canvasRef.current]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const { current: canvas } = canvasRef;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        const x = (screenX / rect.width) * canvas.width;
        const y = (screenY / rect.height) * canvas.height;
    };

    const handleMouseClick = () => {};

    return (
        <MinigameModalContainer>
            <MinigameModalImage src={`images/${PublicImage.MinigameBackground}`} />
            <MinigameCanvas ref={canvasRef} {...canvasSize} />
        </MinigameModalContainer>
    );
    // <Canvas ref={canvasRef} onMouseMove={handleMouseMove} onClick={handleMouseClick} />;
};

export const MinigameModal = connectMinigameModal(MinigameModalBase);
