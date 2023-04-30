import styled from 'styled-components';

export const ShopContainer = styled.div<{ visible?: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    opacity: ${({ visible }) => (visible ? 1 : 0)};
    transition: opacity 0.5s ease-in-out;
    pointer-events: ${({ visible }) => (visible ? 'all' : 'none')};
`;

export const ShopBackgroundImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
`;

export const ShopWindowWrapper = styled.div`
    position: absolute;
    top: 6.6%;
    left: 1.4%;
    right: 1.8%;
    bottom: 12.5%;

    display: flex;
    flex-direction: column;
`;

export const ShopHeader = styled.div`
    width: 100%;
    height: 8%;

    background-color: grey;
    font-size: 2.5vw;

    padding: 0% 1%;
    box-sizing: border-box;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const ShopHeaderButton = styled.div`
    cursor: pointer;
`;

export const ShopContentWrapper = styled.div`
    height: 92%;
    width: 100%;

    display: flex;
    flex-direction: row;
`;

export const ShopPage = styled.div`
    flex: 1;
    height: 100%;
    max-height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;

    overflow-y: auto;
`;

export const ShopPageDivider = styled.div`
    width: 0.5%;
    height: 100%;

    background-color: grey;
`;

export const ShopPageTitle = styled.div`
    font-size: 2.5vw;
    margin: 2% 0;
`;