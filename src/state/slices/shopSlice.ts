/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Organ, OrganQuality } from '../../common/enums';
import type { State } from '../store';

// Category 1: Items to help capture a victim (cheapest to most expensive)
// 1. Stun Gun: Handheld device delivering electric shock.
// 2. Pocket Net Launcher: Quickly traps victims in a net.
// 3. Grappling Hook: Reaches and captures distant victims.
// 4. Tranquilizer Sniper Rifle: Quietly incapacitate victims from Long-range.
// 5. Time-Freezing Device: Freeze time for effortless capture.

// Category 2: Items for a better selection of victims (cheapest to most expensive)
// 1. Disguise Kit: Blend in for closer access to victims.
// 2. Social Media Monitoring: Gathers online information on victims.
// 3. Night Vision Goggles: See clearly in low light situations.
// 4. Black Van: Expands search area for potential victims.
// 5. Satellite Surveillance System: Advanced global victim tracking technology.

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
