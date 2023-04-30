import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { PublicImage } from '../../common';
import {
    GameScreen,
    getActiveScreen,
    navigateToScreen,
    sendRandomBubbleMessage,
    setCurrentTarget,
    StoreProps,
} from '../../state';
import { getRandomPersonOption, getRangeFromAge, PersonOption, PersonType } from './options';
import {
    HuntBackgroundImage,
    HuntContainer,
    HuntPersonContainer,
    HuntPersonDescriptionContainer,
    HuntPersonImage,
    HuntPersonLongStatContainer,
    HuntPersonStatContainer,
    HuntTitle,
} from './style';

const connectHunt = connect(
    createStructuredSelector({
        activeScreen: getActiveScreen,
    }),
    {
        navigateToScreen,
        sendRandomBubbleMessage,
        setCurrentTarget,
    }
);

type HuntProps = StoreProps<typeof connectHunt>;

const captureToolLevel = 0;
const surveillanceToolLevel = 5;

const HuntBase: React.FC<HuntProps> = ({
    activeScreen,
    navigateToScreen,
    sendRandomBubbleMessage,
    setCurrentTarget,
}) => {
    const [options, setOptions] = useState<PersonOption[]>([]);

    useEffect(() => {
        setOptions([
            getRandomPersonOption(surveillanceToolLevel, captureToolLevel),
            getRandomPersonOption(surveillanceToolLevel, captureToolLevel),
            getRandomPersonOption(surveillanceToolLevel, captureToolLevel),
        ]);
    }, []);

    const handlePersonClick = (index: number) => () => {
        const { captureProbability, organQuality, type } = options[index];

        if (Math.random() < captureProbability) {
            sendRandomBubbleMessage([
                'Another successful hunt, just as planned!',
                'Capture complete, my skills never disappoint!',
                "I've got this down to a science!",
                'Effortless victory, they never saw it coming.',
                'One more target acquired, unstoppable as always!',
            ]);
            setCurrentTarget({
                quality: organQuality,
                isReptiloid: type === PersonType.Reptiloid,
                isCyborg: type === PersonType.Cyborg,
            });
        } else {
            sendRandomBubbleMessage([
                "Slipped away, but I won't give up!",
                "A rare miss, but I'll learn from this.",
                "Escaped today, but they won't be so lucky next time.",
                "A setback, but I'll bounce back stronger.",
                'Temporary defeat, but the hunt continues!',
            ]);
            setCurrentTarget(null);
        }

        navigateToScreen(GameScreen.Main);
    };

    return (
        <HuntContainer visible={activeScreen === GameScreen.Hunt}>
            <HuntBackgroundImage src={`images/${PublicImage.HuntBackground}`} />
            <HuntTitle>Pick a target</HuntTitle>
            {options.map(({ age, weight, items, clothes, comment, captureProbability }, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <HuntPersonContainer key={i} onClick={handlePersonClick(i)}>
                    <HuntPersonImage src={`images/${PublicImage.HuntPersonElement}`} />
                    <HuntPersonDescriptionContainer>
                        <HuntPersonStatContainer>
                            <span>Age:</span>
                            <span style={{ color: '#444' }}>{getRangeFromAge(age)}</span>
                        </HuntPersonStatContainer>
                        <HuntPersonLongStatContainer>
                            <span>Weight:</span>
                            <span>{weight}</span>
                        </HuntPersonLongStatContainer>
                        <HuntPersonLongStatContainer>
                            <span>Clothes:</span>
                            <span>{clothes}</span>
                        </HuntPersonLongStatContainer>
                        <HuntPersonLongStatContainer>
                            <span>Items:</span>
                            <span>{items}</span>
                        </HuntPersonLongStatContainer>
                        <HuntPersonLongStatContainer>
                            <span>Comment:</span>
                            <span>{comment}</span>
                        </HuntPersonLongStatContainer>
                        <div style={{ flex: 1 }} />
                        <HuntPersonLongStatContainer>
                            <span style={{ fontSize: '1.1vw' }}>
                                Capture chance: {Math.round(captureProbability * 100)}%
                            </span>
                        </HuntPersonLongStatContainer>
                    </HuntPersonDescriptionContainer>
                </HuntPersonContainer>
            ))}
        </HuntContainer>
    );
};

export const Hunt = connectHunt(HuntBase);
