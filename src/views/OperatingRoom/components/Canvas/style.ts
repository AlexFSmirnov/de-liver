import styled from 'styled-components';

export interface CanvasElementProps {
    isCursorPointer?: boolean;
}

export const CanvasElement = styled.canvas<CanvasElementProps>`
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
    ${({ isCursorPointer }) => (isCursorPointer ? 'cursor: pointer;' : '')}

    background-color: yellow;
`;
