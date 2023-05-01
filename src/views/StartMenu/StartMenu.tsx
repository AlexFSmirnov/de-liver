import { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { PublicImage } from '../../common';
import { PublicSound } from '../../common/enums/PublicSound';
import {
    StoreProps,
    resetGame,
    resetShop,
    navigateToScreen,
    getActiveScreen,
    GameScreen,
    setBackgroundMusic,
} from '../../state';
import { StartMenuContainer, StartMenuText, StartMenuTitle } from './style';

const connectStartMenu = connect(
    createStructuredSelector({
        activeScreen: getActiveScreen,
    }),
    {
        navigateToScreen,
        setBackgroundMusic,
    }
);

type StartMenuProps = StoreProps<typeof connectStartMenu>;

const StartMenuBase: React.FC<StartMenuProps> = ({
    activeScreen,
    navigateToScreen,
    setBackgroundMusic,
}) => {
    const [image, setImage] = useState<PublicImage>(PublicImage.NoMoney);
    const [text, setText] = useState<string>('');

    const [waitingForKey, setWaitingForKey] = useState<boolean>(true);
    const [startMenuStage, setStartMenuStage] = useState(0);

    useEffect(() => {
        if (activeScreen !== GameScreen.Start || waitingForKey) {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            return () => {};
        }

        if (startMenuStage === 7) {
            setBackgroundMusic(PublicSound.BackgroundMusic);
        }

        const timeout = setTimeout(() => {
            if (startMenuStage < 9) {
                setStartMenuStage((s) => s + 1);
            } else {
                navigateToScreen(GameScreen.Main);
            }
        }, 500);

        return () => {
            clearTimeout(timeout);
        };
    }, [activeScreen, waitingForKey, startMenuStage]);

    const handleAnyKey = useCallback(() => {
        if (waitingForKey) {
            setWaitingForKey(false);
            setStartMenuStage(0);
        }
    }, [waitingForKey]);

    useEffect(() => {
        window.addEventListener('keydown', handleAnyKey);
        window.addEventListener('mousedown', handleAnyKey);

        return () => {
            window.removeEventListener('keydown', handleAnyKey);
            window.removeEventListener('mousedown', handleAnyKey);
        };
    }, [handleAnyKey]);

    return (
        <StartMenuContainer visible={activeScreen === GameScreen.Start} onKeyDown={handleAnyKey}>
            {waitingForKey ? (
                <StartMenuTitle visible>Press any key</StartMenuTitle>
            ) : (
                <>
                    <StartMenuText visible={startMenuStage >= 2}>
                        What a beautiful day...
                    </StartMenuText>
                    <StartMenuText visible={startMenuStage >= 7}>
                        Time to de-liver some people!
                    </StartMenuText>
                </>
            )}
        </StartMenuContainer>
    );
};

export const StartMenu = connectStartMenu(StartMenuBase);
