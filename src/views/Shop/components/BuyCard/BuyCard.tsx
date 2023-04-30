import { PublicImage } from '../../../../common';
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

interface BuyCardProps {
    name: string;
    description: string;
    image: PublicImage;
    hidden?: boolean;
}

export const BuyCard: React.FC<BuyCardProps> = ({ name, description, image, hidden }) => {
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
                        <BuyCardActionsWrapper disabled>
                            <span>Buy</span>
                            <span>$30000</span>
                        </BuyCardActionsWrapper>
                    </>
                )}
            </BuyCardContentWrapper>
        </BuyCardContainer>
    );
};
