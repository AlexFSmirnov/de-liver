import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { clearBubbleMessage, getBubbleMessage, StoreProps } from '../../../state';
import { PublicImage } from '../../enums';
import { BubbleMessageContainer, BubbleMessageImage, BubbleMessageTextContainer } from './style';

const connectBubbleMessage = connect(
    createStructuredSelector({
        message: getBubbleMessage,
    }),
    {
        clearBubbleMessage,
    }
);

type BubbleMessageProps = StoreProps<typeof connectBubbleMessage>;

const BubbleMessageBase: React.FC<BubbleMessageProps> = ({ message, clearBubbleMessage }) => {
    const [localMessage, setLocalMessage] = useState('');

    useEffect(() => {
        if (message) {
            setLocalMessage(message);

            const timeout = setTimeout(() => {
                setLocalMessage('');
                clearBubbleMessage();
            }, 3000);

            return () => {
                clearTimeout(timeout);
            };
        }

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return () => {};
    }, [message]);

    return (
        <BubbleMessageContainer visible={localMessage !== ''}>
            <BubbleMessageImage src={`images/${PublicImage.BubbleMessageBackground}`} />
            <BubbleMessageTextContainer>{localMessage}</BubbleMessageTextContainer>
        </BubbleMessageContainer>
    );
};

export const BubbleMessage = connectBubbleMessage(BubbleMessageBase);
