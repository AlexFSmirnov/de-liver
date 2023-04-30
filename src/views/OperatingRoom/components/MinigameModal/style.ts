import styled from 'styled-components';

export const MinigameModalContainer = styled.div<{ active?: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    opacity: ${({ active }) => (active ? 1 : 0)};
    pointer-events: ${({ active }) => (active ? 'all' : 'none')};
    transition: opacity 0.3s ease-in-out;
`;

export const MinigameModalImage = styled.img`
    height: 90%;
    image-rendering: pixelated;
    user-select: none;
`;

export const MinigameCanvas = styled.canvas`
    position: absolute;
    top: 19%;
    height: 70%;
    left: 20%;
    width: 60%;

    image-rendering: pixelated;
`;

export const DangerEffect = styled.div<{ active?: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: red;
    opacity: ${({ active }) => (active ? 0.5 : 0)};
    transition: opacity 0.1s ease-in-out;
    pointer-events: none;
`;
