import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { CANVAS_HEIGHT, CANVAS_WIDTH, PublicImage } from '../../common';
import { GameScreen, getActiveScreen, getScore } from '../../state';
import { StoreProps } from '../../state/store';
import { MainCanvas } from './components';
import { HarvestCanvas } from './components/HarvestCanvas';
import { MinigameModal } from './components/MinigameModal';
import {
    OperatingRoomContainer,
    ScoreCardContainer,
    ScoreCardImage,
    ScoreCardTextContainer,
    ZoomContainer,
} from './style';

const connectOperatingRoom = connect(
    createStructuredSelector({
        activeScreen: getActiveScreen,
        score: getScore,
    })
);

interface OperatingRoomProps extends StoreProps<typeof connectOperatingRoom> {
    containerSize: { width: number; height: number };
}

const OperatingRoomBase: React.FC<OperatingRoomProps> = ({
    activeScreen,
    score,
    containerSize,
}) => {
    let zoomContainerTransform;
    if (activeScreen === GameScreen.Operating) {
        const xOffset = (19 / CANVAS_WIDTH) * containerSize.width;
        const yOffset = (10.5 / CANVAS_HEIGHT) * containerSize.height;
        zoomContainerTransform = `scale(3) translate(${xOffset}px, -${yOffset}px)`;
    } else if (activeScreen === GameScreen.Shop) {
        const xOffset = (1 / CANVAS_WIDTH) * containerSize.width;
        const yOffset = (70 / CANVAS_HEIGHT) * containerSize.height;
        zoomContainerTransform = `scale(3) translate(-${xOffset}px, ${yOffset}px)`;
    }

    return (
        <OperatingRoomContainer>
            <ZoomContainer transform={zoomContainerTransform}>
                <MainCanvas />
                <HarvestCanvas />
                <ScoreCardContainer>
                    <ScoreCardImage src={`images/${PublicImage.ScoreCardBackground}`} />
                    <ScoreCardTextContainer>
                        <span>Score</span>
                        <span>{score}</span>
                    </ScoreCardTextContainer>
                </ScoreCardContainer>
            </ZoomContainer>
            <MinigameModal />
        </OperatingRoomContainer>
    );
};

export const OperatingRoom = connectOperatingRoom(OperatingRoomBase);
