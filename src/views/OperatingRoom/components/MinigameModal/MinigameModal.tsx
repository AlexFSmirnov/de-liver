import { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Organ, OrganQuality, PublicImage, usePublicImages } from '../../../../common';
import {
    addOrgan,
    clearMinigameOrgan,
    GameScreen,
    getActiveScreen,
    getCurrentMinigameOrgan,
    getCurrentTarget,
    getShopToolLevel,
    navigateToScreen,
} from '../../../../state';
import { StoreProps } from '../../../../state/store';
import { DangerEffect, MinigameCanvas, MinigameModalContainer, MinigameModalImage } from './style';

const connectMinigameModal = connect(
    createStructuredSelector({
        activeScreen: getActiveScreen,
        currentTarget: getCurrentTarget,
        currentOrgan: getCurrentMinigameOrgan,
        toolsLevel: getShopToolLevel,
    }),
    {
        addOrgan,
        clearMinigameOrgan,
        navigateToScreen,
    }
);

type MinigameModalProps = StoreProps<typeof connectMinigameModal>;

const minigameModalImages = {
    liverTools1: PublicImage.LiverTools1,
    liverTools2: PublicImage.LiverTools2,
    liverTools3: PublicImage.LiverTools3,
    kidneysTools1: PublicImage.KidneysTools1,
    kidneysTools2: PublicImage.KidneysTools2,
    kidneysTools3: PublicImage.KidneysTools3,
    stomachTools1: PublicImage.StomachTools1,
    stomachTools2: PublicImage.StomachTools2,
    stomachTools3: PublicImage.StomachTools3,
    smallIntestineTools1: PublicImage.SmallIntestineTools1,
    smallIntestineTools2: PublicImage.SmallIntestineTools2,
    smallIntestineTools3: PublicImage.SmallIntestineTools3,
    largeIntestineTools1: PublicImage.LargeIntestineTools1,
    largeIntestineTools2: PublicImage.LargeIntestineTools2,
    largeIntestineTools3: PublicImage.LargeIntestineTools3,
};

const MinigameModalBase: React.FC<MinigameModalProps> = ({
    activeScreen,
    currentTarget,
    currentOrgan,
    toolsLevel,
    addOrgan,
    clearMinigameOrgan,
    navigateToScreen,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const linePreviewCanvasRef = useRef<HTMLCanvasElement>(null);

    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const [isMouseDown, setIsMouseDown] = useState(false);
    const [linePoints, setLinePoints] = useState<{ x: number; y: number }[]>([]);
    const [crossedSegments, setCrossedSegments] = useState<{
        top?: boolean;
        bottom?: boolean;
        left?: boolean;
        right?: boolean;
    }>({});

    // Danger 0 - no damage, <40 - light damage, <90 - high damage, >50 - fail
    const [isDangerActive, setIsDangerActive] = useState(false);
    const [dangerCounter, setDangerCounter] = useState(0);

    const images = usePublicImages(minigameModalImages);

    useEffect(() => {
        setIsMouseDown(false);
        setLinePoints([]);
        setCrossedSegments({});
        setIsDangerActive(false);
        setDangerCounter(0);

        setTimeout(() => {
            const { current: lineCanvas } = linePreviewCanvasRef;
            const pctx = lineCanvas?.getContext('2d');
            pctx?.clearRect(0, 0, lineCanvas?.width ?? 0, lineCanvas?.height ?? 0);
        }, 400);
    }, [currentOrgan]);

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
        switch (currentOrgan?.organ) {
            case Organ.Liver:
                image = [images.liverTools1, images.liverTools2, images.liverTools3][toolsLevel];
                break;
            case Organ.Kidneys:
                image = [images.kidneysTools1, images.kidneysTools2, images.kidneysTools3][
                    toolsLevel
                ];
                break;
            case Organ.Stomach:
                image = [images.stomachTools1, images.stomachTools2, images.stomachTools3][
                    toolsLevel
                ];
                break;
            case Organ.SmallIntestine:
                image = [
                    images.smallIntestineTools1,
                    images.smallIntestineTools2,
                    images.smallIntestineTools3,
                ][toolsLevel];
                break;
            case Organ.LargeIntestine:
                image = [
                    images.largeIntestineTools1,
                    images.largeIntestineTools2,
                    images.largeIntestineTools3,
                ][toolsLevel];
                break;
            default:
                return;
        }

        if (!image) {
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

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

        const { current: lineCanvas } = linePreviewCanvasRef;
        const pctx = lineCanvas?.getContext('2d');
        if (!lineCanvas || !pctx) return;

        pctx.strokeStyle = 'red';
        pctx.lineWidth = 2;
        pctx.lineCap = 'round';
        pctx.lineJoin = 'round';
        pctx.beginPath();
        linePoints.forEach(({ x, y }, i) => {
            if (i === 0) {
                pctx.moveTo(x, y);
            } else {
                pctx.lineTo(x, y);
            }
        });
        pctx.stroke();
    }, [
        canvasRef.current,
        images,
        currentTarget,
        activeScreen,
        canvasSize,
        linePoints,
        isMouseDown,
    ]);

    useEffect(draw, [draw, canvasRef.current]);

    const processOrgan = (damage: 0 | 1 | 2 | 3) => {
        if (!currentOrgan) {
            return;
        }

        const { organ, quality } = currentOrgan;

        switch (damage) {
            case 0:
                addOrgan({ organ, quality });
                break;
            case 1:
                if (quality === OrganQuality.Bad) {
                    console.log('Organ destroyed');
                } else {
                    console.log('Organ damaged');
                    addOrgan({ organ, quality: quality - 1 });
                }
                break;
            case 2:
                if (quality === OrganQuality.Good) {
                    console.log('Organ damaged');
                    addOrgan({ organ, quality: quality - 2 });
                } else {
                    console.log('Organ destroyed');
                }
                break;
            case 3:
                console.log('Organ destroyed');
                break;
            default:
                break;
        }

        clearMinigameOrgan();
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        const { current: canvas } = canvasRef;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const rect = canvas.getBoundingClientRect();
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;

        const x = (screenX / rect.width) * canvas.width;
        const y = (screenY / rect.height) * canvas.height;

        if (!isMouseDown) {
            return;
        }

        if (Math.abs(x - canvas.width / 2) < 10 && y < (canvas.height / 2) * 0.9) {
            setCrossedSegments({ ...crossedSegments, top: true });
        }

        if (Math.abs(x - canvas.width / 2) < 10 && y > (canvas.height / 2) * 1.1) {
            setCrossedSegments({ ...crossedSegments, bottom: true });
        }

        if (Math.abs(y - canvas.height / 2) < 10 && x < canvas.width / 2) {
            setCrossedSegments({ ...crossedSegments, left: true });
        }

        if (Math.abs(y - canvas.height / 2) < 10 && x > (canvas.width / 2) * 0.9) {
            setCrossedSegments({ ...crossedSegments, right: true });
        }

        for (let i = 0; i < Math.min(20, linePoints.length - 20); i++) {
            const { x: x1, y: y1 } = linePoints[i];
            if (Math.sqrt((x - x1) ** 2 + (y - y1) ** 2) < 1) {
                if (
                    crossedSegments.top &&
                    crossedSegments.bottom &&
                    crossedSegments.left &&
                    crossedSegments.right
                ) {
                    let damage: 0 | 1 | 2 | 3 = 0;
                    if (dangerCounter === 0) {
                        damage = 0;
                    } else if (dangerCounter < 40) {
                        damage = 1;
                    } else if (dangerCounter < 90) {
                        damage = 2;
                    } else {
                        damage = 3;
                    }

                    processOrgan(damage);
                } else {
                    console.log('cut fail, organ destroyed');
                    processOrgan(3);
                }
                clearMinigameOrgan();

                if (currentOrgan?.organ === Organ.Kidneys) {
                    console.log('Harvest complete!');
                    navigateToScreen(GameScreen.Main);
                }

                break;
            }
        }

        const [r, g, b, a] = ctx.getImageData(x, y, 1, 1).data;
        if (r !== 255 || g !== 255 || b !== 255 || a !== 255) {
            setIsDangerActive(true);
            setDangerCounter(dangerCounter + 1);

            if (currentOrgan) {
                const { quality } = currentOrgan;
                if (
                    (quality === OrganQuality.Good && dangerCounter > 90) ||
                    (quality === OrganQuality.Medium && dangerCounter > 40) ||
                    (quality === OrganQuality.Bad && dangerCounter > 0)
                ) {
                    processOrgan(3);
                }
            }
        } else {
            setIsDangerActive(false);
        }

        setLinePoints([...linePoints, { x, y }]);
    };

    const handleMouseDown = () => {
        setIsMouseDown(true);
        setLinePoints([]);
    };

    const handleMouseUp = () => {
        console.log('I must finish the cut, organ destroyed!');
        clearMinigameOrgan();

        if (currentOrgan?.organ === Organ.Kidneys) {
            console.log('Harvest complete!');
            navigateToScreen(GameScreen.Main);
        }

        setIsMouseDown(false);
    };

    return (
        <MinigameModalContainer active={currentOrgan !== null}>
            <MinigameModalImage src={`images/${PublicImage.MinigameBackground}`} />
            <MinigameCanvas
                ref={canvasRef}
                {...canvasSize}
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
            />
            <MinigameCanvas
                {...canvasSize}
                ref={linePreviewCanvasRef}
                style={{ pointerEvents: 'none' }}
            />
            <DangerEffect active={isDangerActive} />
        </MinigameModalContainer>
    );
    // <Canvas ref={canvasRef} onMouseMove={handleMouseMove} onClick={handleMouseClick} />;
};

export const MinigameModal = connectMinigameModal(MinigameModalBase);
