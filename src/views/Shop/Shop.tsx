import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { PublicImage } from '../../common';
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
                            Boosts chances of successful victim capture
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
