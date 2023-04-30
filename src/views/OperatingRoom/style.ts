import styled from 'styled-components';

export const OperatingRoomContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
`;

export const ZoomContainer = styled.div<{ transform?: string }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    transform: ${({ transform }) => transform};
    transition: transform 0.5s ease-in-out;
`;

export const ScoreCardContainer = styled.div`
    position: absolute;
    top: 2%;
    right: 1%;
    width: 25%;
    height: 7.5%;
    pointer-events: none;
    user-select: none;
`;

export const ScoreCardImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    image-rendering: pixelated;
`;

export const ScoreCardTextContainer = styled.div`
    position: absolute;
    top: 10%;
    left: 3%;
    right: 3%;
    bottom: 10%;

    overflow: none;

    font-family: 'Joystix Monospace';
    font-size: 1.5vw;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;
