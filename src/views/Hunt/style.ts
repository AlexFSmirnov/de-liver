import styled from 'styled-components';

export const HuntContainer = styled.div<{ visible?: boolean }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    opacity: ${({ visible }) => (visible ? 1 : 0)};
    transition: opacity 0.5s ease-in-out;
    pointer-events: ${({ visible }) => (visible ? 'all' : 'none')};

    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
`;

export const HuntBackgroundImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
`;

export const HuntTitle = styled.div`
    position: absolute;
    top: 7%;
    left: 0;
    width: 100%;
    height: 10%;

    text-align: center;
    font-size: ${({ theme }) => theme.gameScaled(5)};
    font-family: 'Joystix Monospace';
    color: white;
`;

export const HuntPersonContainer = styled.div`
    position: relative;
    width: 20%;
    height: 47.8%;
    user-select: none;
    cursor: pointer;
`;

export const HuntPersonImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    image-rendering: pixelated;
    opacity: 0.9;
    pointer-events: none;
`;

export const HuntPersonDescriptionContainer = styled.div`
    position: absolute;
    top: 2%;
    left: 4%;
    right: 4%;
    bottom: 2%;

    display: flex;
    flex-direction: column;

    font-family: 'Joystix Monospace';
`;

export const HuntPersonStatContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: ${({ theme }) => theme.gameScaled(1.7)};
    margin-bottom: 6%;
`;

export const HuntPersonLongStatContainer = styled.div`
    display: flex;
    flex-direction: column;
    font-size: ${({ theme }) => theme.gameScaled(1.2)};
    margin-bottom: 2%;
    color: #800;

    & > *:nth-child(2) {
        color: #444;
    }
`;

export const CaptureChance = styled.div`
    font-size: ${({ theme }) => theme.gameScaled(1.1)};
`;
