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
                        {Array.from({ length: 30 }).map((_, index) => (
                            <BuyCard key={index} name={`Item ${index}`} hidden={index % 2 === 0} />
                        ))}
                    </ShopPage>
                </ShopContentWrapper>
            </ShopWindowWrapper>
        </ShopContainer>
    );
};

export const Shop = connectShop(ShopBase);
