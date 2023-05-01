/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { clearQueuedSound, getBackgroundMusic, getQueuedSound, StoreProps } from '../../../state';
import { PublicSound } from '../../enums/PublicSound';

const connectSoundPlayer = connect(
    createStructuredSelector({
        backgroundMusic: getBackgroundMusic,
        queuedSound: getQueuedSound,
    }),
    {
        clearQueuedSound,
    }
);

type SoundPlayerProps = StoreProps<typeof connectSoundPlayer>;

const SoundPlayerBase: React.FC<SoundPlayerProps> = ({
    backgroundMusic,
    queuedSound,
    clearQueuedSound,
}) => {
    const backgroundAudioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (backgroundMusic) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            backgroundAudioRef.current = new Audio(backgroundMusic);
            backgroundAudioRef.current.loop = true;
            backgroundAudioRef.current.play();
        }
    }, [backgroundMusic]);

    useEffect(() => {
        if (queuedSound) {
            const audio = new Audio(queuedSound);
            audio.play();
            clearQueuedSound();
        }
    }, [queuedSound]);

    return null;
};

export const SoundPlayer = connectSoundPlayer(SoundPlayerBase);
