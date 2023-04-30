import styled from 'styled-components';

export interface CanvasElementProps {
    isCursorPointer?: boolean;
}

export const CanvasElement = styled.canvas<CanvasElementProps>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    image-rendering: pixelated;
    ${({ isCursorPointer }) => (isCursorPointer ? 'cursor: pointer;' : '')}
`;
