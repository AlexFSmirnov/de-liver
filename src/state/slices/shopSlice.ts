/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Organ, OrganQuality } from '../../common';
import type { State } from '../store';

export interface InventoryOrgan {
    id: string;
    organ: Organ;
    quality: OrganQuality;
}

interface ShopState {
    money: number;
    toolLevel: 0 | 1 | 2;
    organs: Record<string, InventoryOrgan>;
}

const initialState: ShopState = {
    money: 0,
    toolLevel: 1,
    organs: {},
};

export const shopSlice = createSlice({
    name: 'shop',
    initialState,
    reducers: {
        addOrgan: (state, action: PayloadAction<Pick<InventoryOrgan, 'organ' | 'quality'>>) => {
            const id = `${action.payload.organ}-${Date.now()}`;
            console.log('Organ added!');
            state.organs[id] = {
                id,
                ...action.payload,
            };
        },
        sellOrgan: (state, action: PayloadAction<{ id: string; price: number }>) => {
            delete state.organs[action.payload.id];
            state.money += action.payload.price;
        },
    },
});

export const { addOrgan, sellOrgan } = shopSlice.actions;

export const getShopState = (state: State) => state.shop;

export const getShopMoney = createSelector(getShopState, (shop) => shop.money);
export const getShopToolLevel = createSelector(getShopState, (shop) => shop.toolLevel);
export const getShopOrgans = createSelector(getShopState, (shop) => shop.organs);

export default shopSlice.reducer;
