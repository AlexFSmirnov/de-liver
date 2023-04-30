import styled from 'styled-components';

export const BubbleMessageContainer = styled.div<{ visible?: boolean }>`
    position: absolute;

    left: 1%;
    bottom: 2%;
    width: 36%;
    height: 40%;

    display: flex;
    justify-content: center;
    align-items: center;

    opacity: ${(props) => (props.visible ? 1 : 0)};
    transition: opacity 0.2s ease-in-out;

    pointer-events: none;
`;

export const BubbleMessageImage = styled.img`
    height: 100%;
    image-rendering: pixelated;
`;

export const BubbleMessageTextContainer = styled.div`
    position: absolute;

    top: 10%;
    left: 6%;
    right: 6%;
    bottom: 27%;

    font-size: 1.7vw;
    font-family: 'Joystix Monospace';
`;
