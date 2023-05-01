import styled from 'styled-components';

export const SellDialogContainer = styled.div<{ active?: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;

    background-color: rgba(0, 0, 0, 0.7);

    opacity: ${({ active }) => (active ? 1 : 0)};
    pointer-events: ${({ active }) => (active ? 'all' : 'none')};
    transition: opacity 0.3s ease-in-out;
`;

export const SellDialogBackgroundImage = styled.img`
    margin-top: 4%;
    height: 80%;
    image-rendering: pixelated;
    user-select: none;
    box-shadow: 0 0 10px 10px rgba(0, 0, 0, 0.5);
`;

export const SellDialogContentWrapper = styled.div`
    position: absolute;
    top: 10.4%;
    height: 73.5%;
    left: 19.5%;
    width: 61%;

    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const SellDialogTitle = styled.div`
    font-size: ${({ theme }) => theme.gameScaled(3)};
    margin-top: 1%;
`;

export const SellDialogSubtitle = styled.div`
    font-size: ${({ theme }) => theme.gameScaled(1)};
    margin-bottom: 1%;
`;

export const SellDialogOptionsContainer = styled.div`
    width: 100%;
    flex: 1;

    display: flex;
    justify-content: space-evenly;
    align-items: center;

    margin-bottom: 10%;
`;

export const BuyerContainer = styled.div`
    position: relative;
    width: 20%;
    height: 57.5%;
    user-select: none;
    cursor: pointer;
`;

export const BuyerImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    image-rendering: pixelated;
    opacity: 0.9;
    pointer-events: none;

    filter: brightness(0.5);
`;

export const BuyerContentWrapper = styled.div`
    position: absolute;
    top: 2%;
    left: 4%;
    right: 4%;
    bottom: 5%;

    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const BuyerProfilePic = styled.img`
    margin-top: 5%;
    margin-bottom: 2%;
    width: 80%;
    image-rendering: pixelated;
`;

export const BuyerDescription = styled.div`
    font-size: ${({ theme }) => theme.gameScaled(0.8)};
    text-align: center;
`;

export const BuyerOffer = styled.div`
    text-align: center;
    font-size: ${({ theme }) => theme.gameScaled(1)};
    color: #030;
`;
