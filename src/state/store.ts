import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { InferableComponentEnhancerWithProps } from 'react-redux';
import gameStateReducer from './slices/gameStateSlice';

const rootReducer = combineReducers({
    gameState: gameStateReducer,
});

export const store = configureStore({
    reducer: rootReducer,
});

export type State = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;

export type StoreProps<Connect> = Connect extends InferableComponentEnhancerWithProps<
    infer Props,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    infer _
>
    ? Props
    : Record<string, unknown>;
