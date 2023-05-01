import { useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { PublicImage } from '../../../../common';
import { getShopMoney, sendBubbleMessage, setMoney, StoreProps } from '../../../../state';
import {
    BuyCardActionsWrapper,
    BuyCardContainer,
    BuyCardContentWrapper,
    BuyCardDescription,
    BuyCardImage,
    BuyCardName,
    BuyCardPreviewImage,
    BuyCardTextWrapper,
} from './style';

const connectBuyCard = connect(
    createStructuredSelector({
        playerMoney: getShopMoney,
    }),
    {
        setMoney,
        sendBubbleMessage,
    }
);

interface BuyCardProps extends StoreProps<typeof connectBuyCard> {
    name: string;
    description: string;
    image: PublicImage;
    price: number;
    hidden?: boolean;
    bought?: boolean;
    bubbleMessage?: string;
    onBuy?: () => void;
}

const BuyCardBase: React.FC<BuyCardProps> = ({
    name,
    description,
    image,
    price,
    hidden,
    bought,
    bubbleMessage,
    onBuy,
    playerMoney,
    setMoney,
    sendBubbleMessage,
}) => {
    const disabled = useMemo(() => price > playerMoney, [price, playerMoney]);

    const handleBuyClick = () => {
        if (!hidden && !bought && !disabled && onBuy) {
            setMoney(playerMoney - price);
            onBuy();
            if (bubbleMessage) {
                sendBubbleMessage(bubbleMessage);
            }
        }
    };

    return (
        <BuyCardContainer>
            <BuyCardImage src={`images/${PublicImage.ShopItemBackground}`} />
            <BuyCardContentWrapper>
                <BuyCardPreviewImage unavailable={hidden} src={`images/${image}`} />
                {hidden ? (
                    <BuyCardTextWrapper>
                        <BuyCardName>Not available yet</BuyCardName>
                        <BuyCardDescription>Check back later.</BuyCardDescription>
                    </BuyCardTextWrapper>
                ) : (
                    <>
                        <BuyCardTextWrapper>
                            <BuyCardName>{name}</BuyCardName>
                            <BuyCardDescription>{description}</BuyCardDescription>
                        </BuyCardTextWrapper>
                        {bought ? (
                            <BuyCardActionsWrapper disabled style={{ cursor: 'default' }}>
                                <span style={{ color: '#030' }}>Owned</span>
                            </BuyCardActionsWrapper>
                        ) : (
                            <BuyCardActionsWrapper disabled={disabled} onClick={handleBuyClick}>
                                <span>Buy</span>
                                <span>${price}</span>
                            </BuyCardActionsWrapper>
                        )}
                    </>
                )}
            </BuyCardContentWrapper>
        </BuyCardContainer>
    );
};

export const BuyCard = connectBuyCard(BuyCardBase);
