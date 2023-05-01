import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { PublicImage } from '../../common';
import {
    Ending,
    GameScreen,
    getActiveScreen,
    getShopCaptureToolsLevel,
    getShopMoney,
    getShopSurveillanceToolsLevel,
    navigateToScreen,
    sendRandomBubbleMessage,
    setCurrentTarget,
    setEnding,
    setMoney,
    StoreProps,
} from '../../state';
import { getRandomPersonOption, getRangeFromAge, PersonOption, PersonType } from './options';
import {
    CaptureChance,
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
        captureToolsLevel: getShopCaptureToolsLevel,
        surveillanceToolsLevel: getShopSurveillanceToolsLevel,
        playerMoney: getShopMoney,
    }),
    {
        navigateToScreen,
        sendRandomBubbleMessage,
        setCurrentTarget,
        setMoney,
        setEnding,
    }
);

type HuntProps = StoreProps<typeof connectHunt>;

const HuntBase: React.FC<HuntProps> = ({
    activeScreen,
    captureToolsLevel,
    surveillanceToolsLevel,
    playerMoney,
    navigateToScreen,
    sendRandomBubbleMessage,
    setCurrentTarget,
    setMoney,
    setEnding,
}) => {
    const [options, setOptions] = useState<PersonOption[]>([]);

    useEffect(() => {
        if (activeScreen === GameScreen.Hunt) {
            setOptions([
                getRandomPersonOption(surveillanceToolsLevel, captureToolsLevel),
                getRandomPersonOption(surveillanceToolsLevel, captureToolsLevel),
                getRandomPersonOption(surveillanceToolsLevel, captureToolsLevel),
            ]);
        }
    }, [activeScreen]);

    const handlePersonClick = (index: number) => () => {
        const { captureProbability, organQuality, type } = options[index];

        if (Math.random() <= captureProbability) {
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
            let fine = 20;
            if (type === PersonType.Sports) {
                fine = 50;
            } else if (type === PersonType.Rich) {
                fine = 100;
            }

            if (playerMoney < fine) {
                setEnding(Ending.NoMoney);
                return;
            }

            setMoney(playerMoney - fine);

            if (type === PersonType.Sports) {
                sendRandomBubbleMessage([
                    "Darn, that sporty victim got away and now I'm out $50 because of the fine. I'll improve my tactics!",
                    "Their athleticism threw me off, lost the capture and $50 to fines. Next time, I'll be ready!",
                    "Missed the sporty target and now I'm down $50 from the fine. Time to up my game!",
                    'That agile one escaped and cost me $50 in fines. I need to adapt and overcome.',
                    "Capture failed due to their sportiness, and it cost me $50. I won't underestimate them again!",
                ]);
            } else if (type === PersonType.Rich) {
                sendRandomBubbleMessage([
                    "Wow, the rich target escaped, sued me, and now I'm out $100. I need a better approach!",
                    "Slick one got away, sued me for $100. I'll be more cautious with wealthy targets next time.",
                    "Lost the rich victim and now I'm down $100 from the lawsuit. Time to reevaluate my strategy!",
                    'That affluent target slipped away and cost me $100 in legal fees. I must refine my tactics.',
                    "Failed to capture the wealthy one and got sued for $100. I won't let them outsmart me again!",
                ]);
            } else {
                sendRandomBubbleMessage([
                    "Ugh, capture failed and now I'm out $20 because of that fine. I'll do better next time!",
                    "So close, but no luck. Lost $20 to fines too, that stings! I'll be more prepared next attempt.",
                    "Missed the mark and now I'm down $20 from the fine. Time to step up my game!",
                    'That one got away and cost me $20. I need to rethink my strategy and bounce back.',
                    "Capture attempt failed, and it cost me $20 in fines. I won't let it happen again!",
                ]);
            }
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
                            <CaptureChance>
                                Capture chance: {Math.round(captureProbability * 100)}%
                            </CaptureChance>
                        </HuntPersonLongStatContainer>
                    </HuntPersonDescriptionContainer>
                </HuntPersonContainer>
            ))}
        </HuntContainer>
    );
};

export const Hunt = connectHunt(HuntBase);
