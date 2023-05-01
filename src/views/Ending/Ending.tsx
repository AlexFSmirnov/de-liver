import { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { PublicImage } from '../../common';
import {
    getEnding,
    StoreProps,
    Ending as EndingType,
    getScore,
    resetGame,
    resetShop,
} from '../../state';
import { EndingBackgroundImage, EndingContainer, EndingText, EndingTitle } from './style';

const connectEnding = connect(
    createStructuredSelector({
        ending: getEnding,
        score: getScore,
    }),
    {
        resetGame,
        resetShop,
    }
);

type EndingProps = StoreProps<typeof connectEnding>;

const imageByEnding = {
    [EndingType.CrimeBoss]: PublicImage.CrimeBoss,
    [EndingType.Cyborg]: PublicImage.Cyborg,
    [EndingType.Reptiloid]: PublicImage.Reptiloid,
    [EndingType.NoMoney]: PublicImage.NoMoney,
    [EndingType.UndercoverCop]: PublicImage.UndercoverCop,
};

const textByEnding = {
    [EndingType.CrimeBoss]: 'The local crime boss does not take kindly to low-quality goods.',
    [EndingType.Cyborg]: "Oops! Kidnapping a cyborg - that's going to cause some trouble.",
    [EndingType.Reptiloid]: 'Yikes! Caught a reptiloid by mistake - brace for consequences.',
    [EndingType.NoMoney]: 'Empty pockets! No funds left - the end of this journey.',
    [EndingType.UndercoverCop]: 'Unlucky! Traded with an undercover cop - handcuffs and jail time.',
};

const EndingBase: React.FC<EndingProps> = ({ ending, score, resetGame, resetShop }) => {
    const [image, setImage] = useState<PublicImage>(PublicImage.NoMoney);
    const [text, setText] = useState<string>('');

    const [endingStage, setEndingStage] = useState(0);

    useEffect(() => {
        if (!ending) {
            setEndingStage(0);
        }

        if (ending) {
            setImage(imageByEnding[ending]);
            setText(textByEnding[ending]);
            setEndingStage(1);
        }
    }, [ending]);

    useEffect(() => {
        if (!ending) {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            return () => {};
        }

        const timeout = setTimeout(() => {
            if (endingStage < 13) {
                setEndingStage((s) => s + 1);
            }
        }, 500);

        return () => {
            clearTimeout(timeout);
        };
    }, [ending, endingStage]);

    const handleAnyKey = useCallback(() => {
        if (endingStage < 13) {
            return;
        }

        resetGame();
        resetShop();
        setEndingStage(0);
    }, [endingStage]);

    useEffect(() => {
        window.addEventListener('keydown', handleAnyKey);
        window.addEventListener('mousedown', handleAnyKey);

        return () => {
            window.removeEventListener('keydown', handleAnyKey);
            window.removeEventListener('mousedown', handleAnyKey);
        };
    }, [handleAnyKey]);

    return (
        <EndingContainer visible={ending !== null} onKeyDown={handleAnyKey}>
            <EndingBackgroundImage stage={endingStage} src={`images/${image}`} />
            <EndingTitle visible={endingStage >= 4}>Game over</EndingTitle>
            <EndingText visible={endingStage >= 7}>{text}</EndingText>
            <EndingText visible={endingStage >= 10}>Score: {score}</EndingText>
            <EndingText visible={endingStage >= 13}>Press any key to try again</EndingText>
        </EndingContainer>
    );
};

export const Ending = connectEnding(EndingBase);
