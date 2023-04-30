/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import type { State } from '../store';

export enum GameScreen {
    Main = 'Main',
    Operating = 'Operating',
    Shop = 'Shop',
    Hunt = 'Hunt',
}

interface CurrentTarget {
    todo: string;
}

interface GameState {
    activeScreen: GameScreen;

    currentTarget: CurrentTarget | null;
}

const initialState: GameState = {
    activeScreen: GameScreen.Main,
    currentTarget: null,
};

export const gameStateSlice = createSlice({
    name: 'gameState',
    initialState,
    reducers: {
        navigateToScreen: (state, action: PayloadAction<GameScreen>) => {
            state.activeScreen = action.payload;
        },
    },
});

export const { navigateToScreen } = gameStateSlice.actions;

export const getGameState = (state: State) => state.gameState;

export const getActiveScreen = createSelector(getGameState, (state) => state.activeScreen);

export default gameStateSlice.reducer;
