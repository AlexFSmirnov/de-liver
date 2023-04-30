import { PublicImage } from '../../../../common';
import {
    BuyButton,
    BuyCardActionsWrapper,
    BuyCardContainer,
    BuyCardContentWrapper,
    BuyCardDescription,
    BuyCardImage,
    BuyCardName,
    BuyCardPreviewImage,
    BuyCardTextWrapper,
    Price,
} from './style';

interface BuyCardProps {
    name: string;
    hidden?: boolean;
}

export const BuyCard: React.FC<BuyCardProps> = ({ name, hidden }) => {
    return (
        <BuyCardContainer>
            <BuyCardImage src={`images/${PublicImage.ShopItemBackground}`} />
            <BuyCardContentWrapper>
                <BuyCardPreviewImage
                    unavailable={hidden}
                    src={`images/${PublicImage.RandomSquare}`}
                />
                {hidden ? (
                    <BuyCardTextWrapper>
                        <BuyCardName>Not available yet</BuyCardName>
                        <BuyCardDescription>Come back later.</BuyCardDescription>
                    </BuyCardTextWrapper>
                ) : (
                    <>
                        <BuyCardTextWrapper>
                            <BuyCardName>Social Media Monitoring</BuyCardName>
                            <BuyCardDescription>
                                State-of-the-art global tracking technology that enables efficient
                                and accurate victim location monitoring.
                            </BuyCardDescription>
                        </BuyCardTextWrapper>
                        <BuyCardActionsWrapper disabled>
                            <span>Buy</span>
                            <span>$300000</span>
                        </BuyCardActionsWrapper>
                    </>
                )}
            </BuyCardContentWrapper>
        </BuyCardContainer>
    );
};
