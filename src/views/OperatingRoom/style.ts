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
