import styled, { createGlobalStyle } from 'styled-components';
import JoystixMonospace from './common/assets/JoystixMonospace.otf';

export const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: 'Joystix Monospace';
        src: url(${JoystixMonospace}) format('opentype');
    }

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
    overflow: hidden;
`;

export interface GameContainerProps {
    top: number;
    left: number;
    width: number;
    height: number;
}

export const GameContainer = styled.div.attrs<GameContainerProps>((props) => ({
    style: {
        top: props.top,
        left: props.left,
        width: props.width,
        height: props.height,
    },
}))`
    position: absolute;
    transition: transform 0.5s ease-in-out;

    // TODO: Remove this border
    border: 1px solid red;
    box-sizing: border-box;

    overflow: hidden;
`;
