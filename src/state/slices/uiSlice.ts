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
        clearBubbleMessage: (state) => {
            state.bubbleMessage = null;
        },
    },
});

export const { sendBubbleMessage, clearBubbleMessage } = uiSlice.actions;

export const getUIState = (state: State) => state.ui;

export const getBubbleMessage = createSelector(getUIState, (uiState) => uiState.bubbleMessage);

export default uiSlice.reducer;
