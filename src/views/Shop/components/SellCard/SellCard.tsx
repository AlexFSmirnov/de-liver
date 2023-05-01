import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Organ, OrganQuality, PublicImage } from '../../../../common';
import { getShopMoney, sendBubbleMessage, setMoney, StoreProps } from '../../../../state';
import {
    SellCardActionsWrapper,
    SellCardContainer,
    SellCardContentWrapper,
    SellCardDescription,
    SellCardImage,
    SellCardName,
    SellCardPreviewImage,
    SellCardTextWrapper,
} from './style';

const connectSellCard = connect(
    createStructuredSelector({
        playerMoney: getShopMoney,
    }),
    {
        setMoney,
        sendBubbleMessage,
    }
);

interface SellCardProps extends StoreProps<typeof connectSellCard> {
    organ: Organ;
    quality: OrganQuality;
    bubbleMessage?: string;
    onSell?: () => void;
}

const imageByOrgan: Record<Organ, PublicImage> = {
    [Organ.Kidneys]: PublicImage.KidneysSquare,
    [Organ.Liver]: PublicImage.LiverSquare,
    [Organ.LargeIntestine]: PublicImage.LargeIntestineSquare,
    [Organ.SmallIntestine]: PublicImage.SmallIntestineSquare,
    [Organ.Stomach]: PublicImage.StomachSquare,
};

const qualityText: Record<OrganQuality, string> = {
    [OrganQuality.Bad]: 'Bad quality',
    [OrganQuality.Medium]: 'Medium quality',
    [OrganQuality.Good]: 'Good quality',
};

const SellCardBase: React.FC<SellCardProps> = ({
    organ,
    quality,
    bubbleMessage,
    onSell,
    playerMoney,
    setMoney,
    sendBubbleMessage,
}) => {
    const handleSellClick = () => {};

    return (
        <SellCardContainer>
            <SellCardImage src={`images/${PublicImage.ShopItemBackground}`} />
            <SellCardContentWrapper>
                <SellCardPreviewImage quality={quality} src={`images/${imageByOrgan[organ]}`} />
                <SellCardTextWrapper>
                    <SellCardName>{organ}</SellCardName>
                    <SellCardDescription quality={quality}>
                        {qualityText[quality]}
                    </SellCardDescription>
                </SellCardTextWrapper>
                <SellCardActionsWrapper onClick={handleSellClick}>
                    <span>Sell</span>
                </SellCardActionsWrapper>
            </SellCardContentWrapper>
        </SellCardContainer>
    );
};

export const SellCard = connectSellCard(SellCardBase);
