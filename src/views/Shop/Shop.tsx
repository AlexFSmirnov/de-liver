import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Organ, OrganQuality, PublicImage } from '../../common';
import {
    GameScreen,
    getActiveScreen,
    getShopCaptureToolsLevel,
    getShopMoney,
    getShopSurgeryToolsLevel,
    getShopSurveillanceToolsLevel,
    navigateToScreen,
    sendRandomBubbleMessage,
    setCaptureToolsLevel,
    setCurrentTarget,
    setSurgeryToolsLevel,
    setSurveillanceToolsLevel,
    StoreProps,
} from '../../state';
import { BuyCard } from './components';
import { SellCard } from './components/SellCard/SellCard';
import { captureItems, surgeryItems, surveillanceItems } from './content';
import {
    ShopBackgroundImage,
    ShopBuyDivider,
    ShopBuyDividerContainer,
    ShopBuyDividerDescription,
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
        surgeryToolsLevel: getShopSurgeryToolsLevel,
        captureToolsLevel: getShopCaptureToolsLevel,
        surveillanceToolsLevel: getShopSurveillanceToolsLevel,
    }),
    {
        setSurgeryToolsLevel,
        setCaptureToolsLevel,
        setSurveillanceToolsLevel,
        navigateToScreen,
        sendRandomBubbleMessage,
        setCurrentTarget,
    }
);

type ShopProps = StoreProps<typeof connectShop>;

const ShopBase: React.FC<ShopProps> = ({
    activeScreen,
    availableMoney,
    surgeryToolsLevel,
    setSurgeryToolsLevel,
    setCaptureToolsLevel,
    setSurveillanceToolsLevel,
    captureToolsLevel,
    surveillanceToolsLevel,
    navigateToScreen,
    sendRandomBubbleMessage,
    setCurrentTarget,
}) => {
    const handleBackClick = () => {
        navigateToScreen(GameScreen.Main);
    };

    return (
        <ShopContainer visible={activeScreen === GameScreen.Shop}>
            <ShopBackgroundImage src={`images/${PublicImage.ShopBackground}`} />
            <ShopWindowWrapper>
                <ShopHeader>
                    <ShopHeaderButton onClick={handleBackClick}>{'< '}Back</ShopHeaderButton>
                    <span>${availableMoney}</span>
                </ShopHeader>
                <ShopContentWrapper>
                    <ShopPage>
                        <ShopPageTitle>Sell</ShopPageTitle>

                        <SellCard organ={Organ.Liver} quality={OrganQuality.Good} />
                        <SellCard organ={Organ.Liver} quality={OrganQuality.Bad} />
                        <SellCard organ={Organ.Liver} quality={OrganQuality.Medium} />

                        <SellCard organ={Organ.Kidneys} quality={OrganQuality.Medium} />
                        <SellCard organ={Organ.Stomach} quality={OrganQuality.Medium} />
                        <SellCard organ={Organ.LargeIntestine} quality={OrganQuality.Medium} />
                        <SellCard organ={Organ.SmallIntestine} quality={OrganQuality.Medium} />
                    </ShopPage>
                    <ShopPageDivider />
                    <ShopPage>
                        <ShopPageTitle>Buy</ShopPageTitle>

                        <ShopBuyDividerContainer>
                            <ShopBuyDivider />
                            <span>Surgery tools</span>
                            <ShopBuyDivider />
                        </ShopBuyDividerContainer>
                        <ShopBuyDividerDescription>
                            Simplify and improve surgical procedures
                        </ShopBuyDividerDescription>

                        {surgeryItems.map(({ id, ...rest }, i) => (
                            <BuyCard
                                key={id}
                                bought={i < surgeryToolsLevel}
                                hidden={i > surgeryToolsLevel}
                                onBuy={() => setSurgeryToolsLevel(i + 1)}
                                {...rest}
                            />
                        ))}

                        <div style={{ height: '3vh' }} />

                        <ShopBuyDividerContainer>
                            <ShopBuyDivider />
                            <span>Capture tools</span>
                            <ShopBuyDivider />
                        </ShopBuyDividerContainer>
                        <ShopBuyDividerDescription>
                            Boost chances of successful victim capture
                        </ShopBuyDividerDescription>

                        {captureItems.map(({ id, ...rest }, i) => (
                            <BuyCard
                                key={id}
                                bought={i < captureToolsLevel}
                                hidden={i > captureToolsLevel}
                                onBuy={() => setCaptureToolsLevel(i + 1)}
                                {...rest}
                            />
                        ))}

                        <ShopBuyDividerContainer>
                            <ShopBuyDivider />
                            <span>Surveillance tools</span>
                            <ShopBuyDivider />
                        </ShopBuyDividerContainer>
                        <ShopBuyDividerDescription>
                            Enhance the selection of potential victims
                        </ShopBuyDividerDescription>

                        {surveillanceItems.map(({ id, ...rest }, i) => (
                            <BuyCard
                                key={id}
                                bought={i < surveillanceToolsLevel}
                                hidden={i > surveillanceToolsLevel}
                                onBuy={() => setSurveillanceToolsLevel(i + 1)}
                                {...rest}
                            />
                        ))}
                    </ShopPage>
                </ShopContentWrapper>
            </ShopWindowWrapper>
        </ShopContainer>
    );
};

export const Shop = connectShop(ShopBase);
