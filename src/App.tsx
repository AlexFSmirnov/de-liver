import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { ASPECT_RATIO, BubbleMessage } from './common';
import { SoundPlayer } from './common/components/SoundPlayer';
import { AppContainer, GameContainer, GameContainerProps } from './style';
import { Ending } from './views/Ending';
import { Hunt } from './views/Hunt';
import { OperatingRoom } from './views/OperatingRoom';
import { Shop } from './views/Shop';
import { StartMenu } from './views/StartMenu';

export const App: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [gameContainerPosition, setGameContainerPosition] = useState<GameContainerProps>({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    });

    const handleContainerResize = useCallback(() => {
        const { current: container } = containerRef;
        if (!container) {
            return;
        }

        const { width: containerWidth, height: containerHeight } =
            container.getBoundingClientRect();
        if (containerWidth / containerHeight > ASPECT_RATIO) {
            const height = containerHeight;
            const width = height * ASPECT_RATIO;
            const top = 0;
            const left = (containerWidth - width) / 2;
            setGameContainerPosition({ top, left, width, height });
        } else {
            const width = containerWidth;
            const height = width / ASPECT_RATIO;
            const top = (containerHeight - height) / 2;
            const left = 0;
            setGameContainerPosition({ top, left, width, height });
        }
    }, [containerRef.current]);

    useEffect(handleContainerResize, [handleContainerResize, containerRef.current]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(handleContainerResize);

        const { current: container } = containerRef;
        if (container) {
            resizeObserver.observe(container);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const theme = useMemo(
        () => ({
            container: {
                width: gameContainerPosition.width,
                height: gameContainerPosition.height,
            },
            gameScaled: (scalar: number) => `${(scalar * gameContainerPosition.width) / 100}px`,
        }),
        [gameContainerPosition]
    );

    return (
        <AppContainer ref={containerRef}>
            <ThemeProvider theme={theme}>
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <GameContainer {...gameContainerPosition}>
                    <OperatingRoom containerSize={gameContainerPosition} />
                    <Hunt />
                    <Shop />
                    <BubbleMessage />
                    <SoundPlayer />
                    <Ending />
                    <StartMenu />
                </GameContainer>
            </ThemeProvider>
        </AppContainer>
    );
};
