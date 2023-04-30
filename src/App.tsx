import { useCallback, useEffect, useRef, useState } from 'react';
import { ASPECT_RATIO } from './common';
import { AppContainer, GameContainer, GameContainerProps } from './style';
import { OperatingRoom } from './views/OperatingRoom';

export const App = () => {
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
        console.log('handleContainerResize');

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

    return (
        <AppContainer ref={containerRef}>
            <GameContainer {...gameContainerPosition}>
                <OperatingRoom />
            </GameContainer>
        </AppContainer>
    );
};
