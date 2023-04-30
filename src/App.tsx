import { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ASPECT_RATIO, BubbleMessage, CANVAS_HEIGHT, CANVAS_WIDTH } from './common';
import { GameScreen, getActiveScreen } from './state';
import { StoreProps } from './state/store';
import { AppContainer, GameContainer, GameContainerProps } from './style';
import { Hunt } from './views/Hunt';
import { OperatingRoom } from './views/OperatingRoom';
import { Shop } from './views/Shop';

const connectApp = connect(
    createStructuredSelector({
        activeScreen: getActiveScreen,
    })
);

type AppProps = StoreProps<typeof connectApp>;

const AppBase: React.FC<AppProps> = ({ activeScreen }) => {
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

    return (
        <AppContainer ref={containerRef}>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <GameContainer {...gameContainerPosition}>
                <OperatingRoom containerSize={gameContainerPosition} />
                <Hunt />
                <Shop />
                <BubbleMessage />
            </GameContainer>
        </AppContainer>
    );
};

export const App = connectApp(AppBase);
