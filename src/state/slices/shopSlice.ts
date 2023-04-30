/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Organ, OrganQuality } from '../../common/enums';
import type { State } from '../store';

// Category 1: Items to help capture a victim (cheapest to most expensive)
// 1. Stun Gun: Handheld device delivering electric shock.
// 2. Pocket Net Launcher: Quickly traps victims in a net.
// 3. Grappling Hook: Reaches and captures distant victims.
// 4. Tranquilizer Rifle: Quietly incapacitate victims from Long-range.
// 5. Time-Freezing Device: Freeze time for effortless capture.

// Category 2: Items for a better selection of victims (cheapest to most expensive)
// 1. Disguise Kit: Blend in for closer access to victims.
// 2. Social Media Monitoring: Gathers online information on victims.
// 3. Night Vision Goggles: See clearly in low light situations.
// 4. Black Van: Expands search area for potential victims.
// 5. Satellite Surveillance: Advanced global victim tracking technology.

// Category 1: Items to help capture a victim (cheapest to most expensive)
// 1. Stun Gun: Compact handheld device delivering a powerful electric shock, ideal for close-range incapacitation.
// 2. Pocket Net Launcher: Lightweight and easily concealed, this launcher quickly ensnares victims in a durable net.
// 3. Grappling Hook: Versatile tool for reaching and capturing victims in hard-to-reach locations or from a distance.
// 4. Tranquilizer Sniper Rifle: Silent and precise, this long-range weapon stealthily incapacitates victims with tranquilizer darts.
// 5. Time-Freezing Device: Highly advanced technology that momentarily freezes time, allowing for effortless and flawless capture.

// Category 2: Items for a better selection of victims (cheapest to most expensive)
// 1. Disguise Kit: Comprehensive set of disguises and props for blending in and gaining closer access to victims.
// 2. Social Media Monitoring: Cutting-edge software that gathers valuable information on potential victims through their online activity.
// 3. Night Vision Goggles: High-tech goggles that provide exceptional visibility in low light, perfect for nocturnal operations.
// 4. Black Van: Inconspicuous vehicle with tinted windows and ample interior space, designed to expand search areas for potential victims.
// 5. Satellite Surveillance System: State-of-the-art global tracking technology that enables efficient and accurate victim location and monitoring.

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
    money: 50,
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
