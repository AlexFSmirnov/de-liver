import { combineReducers, configureStore } from '@reduxjs/toolkit';
import gameStateReducer from './slices/gameStateSlice';

const rootReducer = combineReducers({
    gameState: gameStateReducer,
});

export const store = configureStore({
    reducer: rootReducer,
});

export type State = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;
