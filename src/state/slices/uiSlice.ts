/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import type { State } from '../store';

interface UIState {
    bubbleMessage?: string | null;
}

const initialState: UIState = {
    bubbleMessage: null,
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
    },
});

export const { sendBubbleMessage, sendRandomBubbleMessage, clearBubbleMessage } = uiSlice.actions;

export const getUIState = (state: State) => state.ui;

export const getBubbleMessage = createSelector(getUIState, (uiState) => uiState.bubbleMessage);

export default uiSlice.reducer;
