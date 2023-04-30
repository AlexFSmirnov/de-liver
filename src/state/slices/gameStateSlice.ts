/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Organ, OrganQuality } from '../../common';
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

interface MinigameOrgan {
    organ: Organ;
    quality: OrganQuality;
}

interface GameState {
    activeScreen: GameScreen;

    currentTarget: CurrentTarget | null;
    currentMinigameOrgan: MinigameOrgan | null;

    harvestComplete: boolean;
}

const initialState: GameState = {
    activeScreen: GameScreen.Main,
    currentTarget: {
        todo: 'todo',
    },
    currentMinigameOrgan: null,
    harvestComplete: false,
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
        setHarvestComplete: (state, action: PayloadAction<boolean>) => {
            state.harvestComplete = action.payload;
        },
    },
});

export const { navigateToScreen, setMinigameOrgan, clearMinigameOrgan, setHarvestComplete } =
    gameStateSlice.actions;

export const getGameState = (state: State) => state.gameState;

export const getActiveScreen = createSelector(getGameState, (state) => state.activeScreen);
export const getCurrentTarget = createSelector(getGameState, (state) => state.currentTarget);
export const getCurrentMinigameOrgan = createSelector(
    getGameState,
    (state) => state.currentMinigameOrgan
);

export const getIsHarvestComplete = createSelector(getGameState, (state) => state.harvestComplete);

export default gameStateSlice.reducer;
