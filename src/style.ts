import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        outline: none;
    }
    html {
        position: relative;
        width: 100vw;
        height: 100vh;
    }
    body {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        -webkit-tap-highlight-color:  rgba(255, 255, 255, 0); 
    }
    #root {
        width: 100%;
        height: 100%;
    }
`;

export const AppContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #111;
`;

export interface GameContainerProps {
    top: number;
    left: number;
    width: number;
    height: number;
}

export const GameContainer = styled.div<GameContainerProps>`
    position: absolute;
    top: ${(props) => props.top}px;
    left: ${(props) => props.left}px;
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;

    // TODO: Remove this border
    border: 1px solid red;
    box-sizing: border-box;
`;
