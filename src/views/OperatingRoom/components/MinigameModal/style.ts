import styled from 'styled-components';

export const MinigameModalContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
`;

export const MinigameModalImage = styled.img`
    height: 90%;
    image-rendering: pixelated;
`;

export const MinigameCanvas = styled.canvas`
    position: absolute;
    top: 19%;
    height: 70%;
    left: 20%;
    width: 60%;

    image-rendering: pixelated;
`;
