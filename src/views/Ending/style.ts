import styled from 'styled-components';

export const EndingContainer = styled.div<{ visible?: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    opacity: ${({ visible }) => (visible ? 1 : 0)};
    transition: opacity 0.5s ease-in-out;
    pointer-events: ${({ visible }) => (visible ? 'all' : 'none')};

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background-color: #000;
`;

export const EndingBackgroundImage = styled.img<{ stage: number }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    image-rendering: pixelated;

    opacity: ${({ stage }) => (stage <= 3 ? 1 : 0.3)};
    transition: opacity 0.5s ease-in-out;
`;

export const EndingTitle = styled.div<{ visible?: boolean }>`
    font-size: ${({ theme }) => theme.gameScaled(8)};
    color: white;
    margin-bottom: 3%;

    opacity: ${({ visible }) => (visible ? 1 : 0)};
    transition: opacity 0.5s ease-in-out;

    z-index: 3;
`;

export const EndingText = styled.div<{ visible?: boolean }>`
    font-size: ${({ theme }) => theme.gameScaled(3)};
    color: white;
    text-align: center;
    margin-bottom: 3%;
    padding: 0 6%;

    opacity: ${({ visible }) => (visible ? 1 : 0)};
    transition: opacity 0.5s ease-in-out;

    z-index: 3;
`;
