import { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { PublicImage } from '../../common';
import { PublicSound } from '../../common/enums/PublicSound';
import {
    GameScreen,
    getActiveScreen,
    getShopCaptureToolsLevel,
    getShopMoney,
    getShopOrgans,
    getShopSurgeryToolsLevel,
    getShopSurveillanceToolsLevel,
    navigateToScreen,
    playSound,
    setCaptureToolsLevel,
    setSurgeryToolsLevel,
    setSurveillanceToolsLevel,
    StoreProps,
} from '../../state';
import { BuyCard, SellDialog } from './components';
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
        shopOrgans: getShopOrgans,
    }),
    {
        setSurgeryToolsLevel,
        setCaptureToolsLevel,
        setSurveillanceToolsLevel,
        navigateToScreen,
        playSound,
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
    shopOrgans,
    navigateToScreen,
    playSound,
}) => {
    const [sellOrganId, setSellOrganId] = useState<string | null>(null);

    const handleBackClick = () => {
        navigateToScreen(GameScreen.Main);
    };

    const playClick = useCallback(() => {
        playSound(PublicSound.MouseClick);
    }, []);

    useEffect(() => {
        if (activeScreen === GameScreen.Shop) {
            window.addEventListener('mousedown', playClick);
        } else {
            window.removeEventListener('mousedown', playClick);
        }

        return () => {
            window.removeEventListener('mousedown', playClick);
        };
    }, [activeScreen]);

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

                        {Object.values(shopOrgans).map(({ id, ...rest }) => (
                            <SellCard key={id} {...rest} onSell={() => setSellOrganId(id)} />
                        ))}
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
                                bought={i < surgeryToolsLevel + 1}
                                hidden={i > surgeryToolsLevel + 1}
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
            <SellDialog organId={sellOrganId} onClose={() => setSellOrganId(null)} />
        </ShopContainer>
    );
};

export const Shop = connectShop(ShopBase);
