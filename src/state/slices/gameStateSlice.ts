/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Organ, OrganQuality } from '../../common/enums';
import type { State } from '../store';

export enum GameScreen {
    Main = 'Main',
    Operating = 'Operating',
    Shop = 'Shop',
    Hunt = 'Hunt',
}

interface CurrentTarget {
    quality: OrganQuality;
    isReptiloid?: boolean;
    isCyborg?: boolean;
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

    score: number;
}

const initialState: GameState = {
    activeScreen: GameScreen.Shop,
    currentTarget: null,
    currentMinigameOrgan: null,
    harvestComplete: false,
    score: 0,
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
        setCurrentTarget: (state, action: PayloadAction<CurrentTarget | null>) => {
            state.currentTarget = action.payload;
        },
        increaseScore: (state, action: PayloadAction<number>) => {
            state.score += action.payload;
        },
    },
});

export const {
    navigateToScreen,
    setMinigameOrgan,
    clearMinigameOrgan,
    setHarvestComplete,
    setCurrentTarget,
    increaseScore,
} = gameStateSlice.actions;

export const getGameState = (state: State) => state.gameState;

export const getActiveScreen = createSelector(getGameState, (state) => state.activeScreen);
export const getCurrentTarget = createSelector(getGameState, (state) => state.currentTarget);
export const getCurrentMinigameOrgan = createSelector(
    getGameState,
    (state) => state.currentMinigameOrgan
);

export const getIsHarvestComplete = createSelector(getGameState, (state) => state.harvestComplete);

export const getScore = createSelector(getGameState, (state) => state.score);

export default gameStateSlice.reducer;
