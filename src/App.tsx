import { useCallback, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { ASPECT_RATIO, CANVAS_HEIGHT, CANVAS_WIDTH } from './common';
import { GameScreen, getActiveScreen } from './state';
import { StoreProps } from './state/store';
import { AppContainer, GameContainer, GameContainerProps, ZoomContainer } from './style';
import { OperatingRoom } from './views/OperatingRoom';

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

    let zoomContainerTransform;
    if (activeScreen === GameScreen.Operating) {
        const xOffset = (19 / CANVAS_WIDTH) * gameContainerPosition.width;
        const yOffset = (10.5 / CANVAS_HEIGHT) * gameContainerPosition.height;
        zoomContainerTransform = `scale(7) translate(${xOffset}px, -${yOffset}px)`;
    }

    return (
        <AppContainer ref={containerRef}>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <GameContainer {...gameContainerPosition}>
                <ZoomContainer transform={zoomContainerTransform}>
                    <OperatingRoom />
                </ZoomContainer>
            </GameContainer>
        </AppContainer>
    );
};

export const App = connectApp(AppBase);
