import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { PublicImage } from '../../common';
import {
    GameScreen,
    getActiveScreen,
    getShopMoney,
    navigateToScreen,
    sendRandomBubbleMessage,
    setCurrentTarget,
    StoreProps,
} from '../../state';
import { BuyCard } from './components';
import {
    ShopBackgroundImage,
    ShopContainer,
    ShopContentWrapper,
    ShopHeader,
    ShopHeaderButton,
    ShopPage,
    ShopPageDivider,
    ShopPageTitle,
    ShopWindowWrapper,
} from './style';

const connectShop = connect(
    createStructuredSelector({
        activeScreen: getActiveScreen,
        availableMoney: getShopMoney,
    }),
    {
        navigateToScreen,
        sendRandomBubbleMessage,
        setCurrentTarget,
    }
);

type ShopProps = StoreProps<typeof connectShop>;

const ShopBase: React.FC<ShopProps> = ({
    activeScreen,
    availableMoney,
    navigateToScreen,
    sendRandomBubbleMessage,
    setCurrentTarget,
}) => {
    return (
        <ShopContainer visible={activeScreen === GameScreen.Shop}>
            <ShopBackgroundImage src={`images/${PublicImage.ShopBackground}`} />
            <ShopWindowWrapper>
                <ShopHeader>
                    <ShopHeaderButton>{'< '}Back</ShopHeaderButton>
                    <span>${availableMoney}</span>
                </ShopHeader>
                <ShopContentWrapper>
                    <ShopPage>
                        <ShopPageTitle>Sell</ShopPageTitle>
                    </ShopPage>
                    <ShopPageDivider />
                    <ShopPage>
                        <ShopPageTitle>Buy</ShopPageTitle>
                        <BuyCard
                            name="Stun Gun"
                            description="Compact handheld device delivering a powerful electric shock, ideal for close-range incapacitation."
                            image={PublicImage.Taser}
                        />
                        <BuyCard
                            name="Pocket Net Launcher"
                            description="Lightweight and easily concealed, this launcher quickly ensnares victims in a durable net."
                            image={PublicImage.NetLauncher}
                        />
                        <BuyCard
                            name="Grappling Hook"
                            description="Versatile tool for reaching and capturing victims in hard-to-reach locations or from a distance."
                            image={PublicImage.GrapplingHook}
                        />
                        <BuyCard
                            name="Tranquilizer Rifle"
                            description="Silent and precise, this long-range weapon stealthily incapacitates victims with tranquilizer darts."
                            image={PublicImage.TranquilizerRifle}
                        />
                        <BuyCard
                            name="Time-Freezing Device"
                            description="Highly advanced technology that momentarily freezes time, allowing for effortless and flawless capture."
                            image={PublicImage.TimeStop}
                        />

                        <BuyCard
                            name="Disguise Kit"
                            description="Comprehensive set of disguises and props for blending in and gaining closer access to victims."
                            image={PublicImage.DisguiseKit}
                        />
                        <BuyCard
                            name="Social Media Monitoring"
                            description="Cutting-edge software that gathers valuable information on potential victims through their online activity."
                            image={PublicImage.SocialMedia}
                        />
                        <BuyCard
                            name="Night Vision Goggles"
                            description="High-tech goggles that provide exceptional visibility in low light, perfect for nocturnal operations."
                            image={PublicImage.NightVision}
                        />
                        <BuyCard
                            name="Black Van"
                            description="Inconspicuous vehicle with tinted windows and ample interior space, designed to expand search areas for potential victims."
                            image={PublicImage.BlackVan}
                        />
                        <BuyCard
                            name="Satellite Surveillance"
                            description="State-of-the-art global tracking technology that enables efficient and accurate victim location monitoring."
                            image={PublicImage.SatelliteSurveillance}
                        />
                    </ShopPage>
                </ShopContentWrapper>
            </ShopWindowWrapper>
        </ShopContainer>
    );
};

export const Shop = connectShop(ShopBase);
