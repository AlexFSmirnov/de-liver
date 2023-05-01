import { Organ, OrganQuality, PublicImage } from '../../../../common';
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

interface SellCardProps {
    organ: Organ;
    quality: OrganQuality;
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

export const SellCard: React.FC<SellCardProps> = ({ organ, quality, onSell }) => {
    const handleSellClick = () => {
        if (onSell) {
            onSell();
        }
    };

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
