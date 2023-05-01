/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { PublicSound } from '../../common/enums/PublicSound';
import type { State } from '../store';

interface UIState {
    bubbleMessage?: string | null;

    backgroundMusic: PublicSound | null;
    queuedSound: PublicSound | null;
}

const initialState: UIState = {
    bubbleMessage: null,
    backgroundMusic: null,
    queuedSound: null,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        sendBubbleMessage: (state, action: PayloadAction<string>) => {
            state.bubbleMessage = action.payload;
        },
        sendRandomBubbleMessage: (state, action: PayloadAction<string[]>) => {
            const randomIndex = Math.floor(Math.random() * action.payload.length);
            state.bubbleMessage = action.payload[randomIndex];
        },
        clearBubbleMessage: (state) => {
            state.bubbleMessage = null;
        },
        setBackgroundMusic: (state, action: PayloadAction<PublicSound | null>) => {
            state.backgroundMusic = action.payload;
        },
        playSound: (state, action: PayloadAction<PublicSound>) => {
            state.queuedSound = action.payload;
        },
        clearQueuedSound: (state) => {
            state.queuedSound = null;
        },
    },
});

export const {
    sendBubbleMessage,
    sendRandomBubbleMessage,
    clearBubbleMessage,
    setBackgroundMusic,
    playSound,
    clearQueuedSound,
} = uiSlice.actions;

export const getUIState = (state: State) => state.ui;

export const getBubbleMessage = createSelector(getUIState, (uiState) => uiState.bubbleMessage);

export const getBackgroundMusic = createSelector(getUIState, (uiState) => uiState.backgroundMusic);
export const getQueuedSound = createSelector(getUIState, (uiState) => uiState.queuedSound);

export default uiSlice.reducer;
