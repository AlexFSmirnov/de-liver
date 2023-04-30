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
    sendRandomBubbleMessage,
    setHarvestComplete,
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
        sendRandomBubbleMessage,
        setHarvestComplete,
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
    sendRandomBubbleMessage,
    setHarvestComplete,
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

    const processOrgan = (damage: 0 | 1 | 2 | 3, sendMessage = true) => {
        if (!currentOrgan) {
            return;
        }

        const { organ, quality } = currentOrgan;

        switch (damage) {
            case 0:
                if (sendMessage)
                    sendRandomBubbleMessage([
                        'Nice! That was a clean cut!',
                        "Excellent! I couldn't have made a better incision!",
                        'Perfect! That cut was incredibly precise!',
                    ]);

                addOrgan({ organ, quality });
                break;
            case 1:
                if (quality === OrganQuality.Bad) {
                    if (sendMessage)
                        sendRandomBubbleMessage([
                            "Decent cut, but the organ was terrible to begin with. Can't use it now.",
                            'The cut was alright, but the organ was already in poor condition. Not salvageable.',
                            'Passable incision, but the organ was beyond saving from the start. No use now.',
                        ]);
                } else {
                    if (sendMessage)
                        sendRandomBubbleMessage([
                            "Oops, made a small mistake. It's fine, I can still sell it.",
                            'A minor slip-up, but the organ is still sellable.',
                            'A tiny error, but the organ can still be sold.',
                        ]);
                    addOrgan({ organ, quality: quality - 1 });
                }
                break;
            case 2:
                if (quality === OrganQuality.Good) {
                    if (sendMessage)
                        sendRandomBubbleMessage([
                            "Ouch, that was a really bad cut. This organ won't be worth much now, but I can still sell it.",
                            "That was a terrible incision. The organ's value has dropped, but it can still be sold.",
                            "A poor cut, unfortunately. The organ's worth has diminished, but I can still sell it.",
                        ]);
                    addOrgan({ organ, quality: quality - 2 });
                } else {
                    // eslint-disable-next-line no-lonely-if
                    if (sendMessage)
                        sendRandomBubbleMessage([
                            "Ouch, that was a really bad cut. The organ's ruined now.",
                            'That was a terrible mistake. The organ is completely damaged.',
                            'A disastrous cut. The organ is beyond repair now.',
                        ]);
                }
                break;
            case 3:
                if (sendMessage)
                    sendRandomBubbleMessage([
                        "Wow, I managed to cut the organ in half! Nobody's gonna buy this.",
                        "Unbelievable, I sliced the organ in two! It's unsellable now.",
                        "I accidentally split the organ! There's no way anyone will purchase it.",
                    ]);
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
                    sendRandomBubbleMessage([
                        "I need to cut the whole thing out in one go. This organ's useless now, better be careful with the next one.",
                        'I should have removed it all at once. This organ is no good, I must be more cautious next time.',
                        "I had to extract it in a single motion. The organ is now worthless, I'll need to watch out for the following one.",
                    ]);
                    processOrgan(3, false);
                }
                clearMinigameOrgan();

                if (currentOrgan?.organ === Organ.Kidneys) {
                    sendRandomBubbleMessage([
                        "Nice! That wasn't too bad. What's next?",
                        'Good job! That went well enough. On to the next one.',
                        "Not bad at all! Let's move on to the next task.",
                    ]);
                    setHarvestComplete(true);
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

                    if (currentOrgan?.organ === Organ.Kidneys) {
                        sendRandomBubbleMessage([
                            "Not the best finisher, but I got the job done. What's next?",
                            "It wasn't perfect, but the task is complete. On to the next one.",
                            "Could have been better, but it's done. Let's proceed to the next challenge.",
                        ]);
                        setHarvestComplete(true);
                        navigateToScreen(GameScreen.Main);
                    }
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
        sendRandomBubbleMessage([
            "I need to cut the whole thing out in one go. This organ's useless now, better be careful with the next one.",
            'I should have removed it all at once. This organ is no good, I must be more cautious next time.',
            "I had to extract it in a single motion. The organ is now worthless, I'll need to watch out for the following one.",
        ]);

        clearMinigameOrgan();

        if (currentOrgan?.organ === Organ.Kidneys) {
            sendRandomBubbleMessage([
                "Not the best finisher, but I got the job done. What's next?",
                "It wasn't perfect, but the task is complete. On to the next one.",
                "Could have been better, but it's done. Let's proceed to the next challenge.",
            ]);
            setHarvestComplete(true);
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
};

export const MinigameModal = connectMinigameModal(MinigameModalBase);
