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

export enum MinigameOrgan {
    Liver,
    Stomach,
    LargeIntestine,
    SmallIntestine,
    Kidneys,
}

interface CurrentTarget {
    todo: string;
}

interface GameState {
    activeScreen: GameScreen;

    currentTarget: CurrentTarget | null;
    currentMinigameOrgan: MinigameOrgan | null;
}

const initialState: GameState = {
    activeScreen: GameScreen.Operating,
    currentTarget: {
        todo: 'todo',
    },
    currentMinigameOrgan: MinigameOrgan.Liver,
};

export const gameStateSlice = createSlice({
    name: 'gameState',
    initialState,
    reducers: {
        navigateToScreen: (state, action: PayloadAction<GameScreen>) => {
            state.activeScreen = action.payload;
        },
        setMinigameOrgan: (state, action: PayloadAction<MinigameOrgan>) => {
            state.currentMinigameOrgan = action.payload;
        },
        clearMinigameOrgan: (state) => {
            state.currentMinigameOrgan = null;
        },
    },
});

export const { navigateToScreen, setMinigameOrgan, clearMinigameOrgan } = gameStateSlice.actions;

export const getGameState = (state: State) => state.gameState;

export const getActiveScreen = createSelector(getGameState, (state) => state.activeScreen);
export const getCurrentTarget = createSelector(getGameState, (state) => state.currentTarget);
export const getCurrentMinigameOrgan = createSelector(
    getGameState,
    (state) => state.currentMinigameOrgan
);

export default gameStateSlice.reducer;
