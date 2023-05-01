import { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Organ, OrganQuality, PublicImage } from '../../../../common';
import {
    getShopMoney,
    getShopOrgans,
    removeOrgan,
    sendRandomBubbleMessage,
    setMoney,
    StoreProps,
} from '../../../../state';
import {
    BuyerContainer,
    BuyerContentWrapper,
    BuyerDescription,
    BuyerImage,
    BuyerOffer,
    BuyerProfilePic,
    SellDialogBackgroundImage,
    SellDialogContainer,
    SellDialogContentWrapper,
    SellDialogOptionsContainer,
    SellDialogSubtitle,
    SellDialogTitle,
} from './style';

const connectSellDialog = connect(
    createStructuredSelector({
        shopOrgans: getShopOrgans,
        playerMoney: getShopMoney,
    }),
    {
        removeOrgan,
        setMoney,
        sendRandomBubbleMessage,
    }
);

interface SellDialogProps extends StoreProps<typeof connectSellDialog> {
    organId: string | null;
    onClose: () => void;
}

const qualityText: Record<OrganQuality, string> = {
    [OrganQuality.Bad]: 'low-quality',
    [OrganQuality.Medium]: 'medium-quality',
    [OrganQuality.Good]: 'high-quality',
};

enum ShadyBuyer {
    CrimeBoss,
    UndercoverCop,
    NormalGuy,
}

const hospitalLine = "Doesn't pay as much, but maybe the good cause is worth it?";

const SellDialogBase: React.FC<SellDialogProps> = ({
    organId,
    shopOrgans,
    playerMoney,
    removeOrgan,
    setMoney,
    sendRandomBubbleMessage,
    onClose,
}) => {
    const [shadyBuyer, setShadyBuyer] = useState<ShadyBuyer | null>(null);

    const [organ, setOrgan] = useState(Organ.Liver);
    const [quality, setQuality] = useState(OrganQuality.Good);

    useEffect(() => {
        if (organId && shopOrgans[organId]) {
            setOrgan(shopOrgans[organId].organ);
            setQuality(shopOrgans[organId].quality);
        }
    }, [organId, shopOrgans]);

    const organPrice = useMemo(() => {
        switch (quality) {
            case OrganQuality.Bad:
                return Math.round(Math.random() * 5 + 7);
            case OrganQuality.Medium:
                return Math.round(Math.random() * 10 + 15);
            case OrganQuality.Good:
            default:
                return Math.round(Math.random() * 20 + 40);
        }
    }, [organId, quality]);

    useEffect(() => {
        if (organId === null) {
            return;
        }

        // if (Math.random() < 0.9) {
        //     setShadyBuyer(null);
        //     return;
        // }

        if (Math.random() < 0.1) {
            setShadyBuyer(ShadyBuyer.UndercoverCop);
            return;
        }

        if (Math.random() < 0.5) {
            setShadyBuyer(ShadyBuyer.CrimeBoss);
            return;
        }

        setShadyBuyer(ShadyBuyer.NormalGuy);
    }, [organId]);

    const handleJakeClick = () => {
        if (!organId) return;

        removeOrgan(organId);
        if (Math.random() < 0.1) {
            sendRandomBubbleMessage([
                "Can't believe Jake didn't pay this time, his usual reliability must be slipping. I'll have to be cautious.",
                "Jake failed to pay up, quite unexpected from him. It's frustrating when trustworthy contacts let you down.",
                "Disappointed that Jake didn't come through with the payment. I guess even decent people can falter.",
                "Jake's non-payment took me by surprise. I'll need to reevaluate my dealings with him in the future.",
                "Usually, I can count on Jake, but he didn't pay for the organs this time. Trust is shaken.",
            ]);
            onClose();
            return;
        }

        setMoney(playerMoney + organPrice);
        sendRandomBubbleMessage([
            'Jake pulled through as usual, always great to have a reliable contact for these transactions.',
            "Deal went smoothly with Jake, he's consistently dependable when it comes to organ sales.",
            "Another successful trade with Jake, it's reassuring to have someone trustworthy in this business.",
            'Jake came through with the payment, his reliability continues to make our dealings a breeze.',
            "As expected, Jake didn't disappoint. It's good to know I can count on him for organ deals.",
        ]);
        onClose();
    };

    const handleHospitalClick = () => {
        if (!organId) return;

        removeOrgan(organId);
        setMoney(playerMoney + Math.round(organPrice * 0.6));
        sendRandomBubbleMessage([
            'Sold the organs to the hospital, feels great to contribute to a good cause and help save lives.',
            'Another successful deal with the hospital, always satisfying to know these organs are going to help others.',
            "The hospital came through as always, it's comforting to see the organs being put to good use.",
            'Great dealing with the hospital, knowing the organs will be used for medical treatments is rewarding.',
            "Once again, the hospital paid up and the organs will genuinely help people. It's a nice change of pace.",
        ]);
        onClose();
    };

    const handleShadyClick = () => {
        if (!organId) return;

        if (shadyBuyer === ShadyBuyer.UndercoverCop) {
            console.log('Game over!');
            return;
        }

        if (shadyBuyer === ShadyBuyer.CrimeBoss && quality !== OrganQuality.Good) {
            console.log('Crime boss is not happy with the organ!');
            return;
        }

        sendRandomBubbleMessage([
            'Phew, that deal with the weird guy went smoothly, glad there were no surprises this time.',
            'Thankfully, the transaction with that odd dude was a success, no unexpected hiccups.',
            "Pulled off that deal with the mysterious fellow, it's a relief when things go without a hitch.",
            "That strange guy came through, and I'm just happy to have avoided any trouble in the process.",
            "Sold the organs to that peculiar person without a problem, glad that's over and done with.",
        ]);
        removeOrgan(organId);
        setMoney(playerMoney + Math.round(organPrice * 2.5));
        onClose();
    };

    return (
        <SellDialogContainer active={organId !== null}>
            <SellDialogBackgroundImage src={`images/${PublicImage.ShopSellBackground}`} />
            <SellDialogContentWrapper>
                <SellDialogTitle>Choose buyer</SellDialogTitle>
                {organ !== undefined && quality !== undefined ? (
                    <SellDialogSubtitle>
                        Selling {qualityText[quality]} {organ}
                    </SellDialogSubtitle>
                ) : null}
                <SellDialogOptionsContainer>
                    <BuyerContainer onClick={handleJakeClick}>
                        <BuyerImage src={`images/${PublicImage.HuntPersonElement}`} />
                        <BuyerContentWrapper>
                            <BuyerProfilePic src={`images/${PublicImage.BuyerJake}`} />
                            <BuyerDescription>
                                Jake. Always available, but not always reliable.
                            </BuyerDescription>
                            <div style={{ flex: 1 }} />
                            <BuyerOffer>Offers ${organPrice}</BuyerOffer>
                        </BuyerContentWrapper>
                    </BuyerContainer>
                    <BuyerContainer onClick={handleHospitalClick}>
                        <BuyerImage src={`images/${PublicImage.HuntPersonElement}`} />
                        <BuyerContentWrapper>
                            <BuyerProfilePic src={`images/${PublicImage.BuyerHospital}`} />
                            <BuyerDescription>{hospitalLine}</BuyerDescription>
                            <div style={{ flex: 1 }} />
                            <BuyerOffer>Offers ${Math.round(organPrice * 0.6)}</BuyerOffer>
                        </BuyerContentWrapper>
                    </BuyerContainer>
                    {shadyBuyer !== null ? (
                        <BuyerContainer onClick={handleShadyClick}>
                            <BuyerImage src={`images/${PublicImage.HuntPersonElement}`} />
                            <BuyerContentWrapper>
                                <BuyerProfilePic src={`images/${PublicImage.BuyerShady}`} />
                                <BuyerDescription>
                                    Good product means good payment. No questions asked. Right?
                                </BuyerDescription>
                                <div style={{ flex: 1 }} />
                                <BuyerOffer>Offers ${Math.round(organPrice * 2.5)}</BuyerOffer>
                            </BuyerContentWrapper>
                        </BuyerContainer>
                    ) : null}
                </SellDialogOptionsContainer>
            </SellDialogContentWrapper>
        </SellDialogContainer>
    );
};

export const SellDialog = connectSellDialog(SellDialogBase);
