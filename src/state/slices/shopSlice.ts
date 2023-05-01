/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { Organ, OrganQuality } from '../../common/enums';
import type { State } from '../store';

export interface InventoryOrgan {
    id: string;
    organ: Organ;
    quality: OrganQuality;
}

interface ShopState {
    money: number;
    surgeryToolsLevel: number;
    captureToolsLevel: number;
    surveillanceToolsLevel: number;
    organs: Record<string, InventoryOrgan>;
}

const initialState: ShopState = {
    money: 80,
    surgeryToolsLevel: 1,
    captureToolsLevel: 0,
    surveillanceToolsLevel: 0,
    organs: {
        '1': {
            id: '1',
            organ: Organ.Liver,
            quality: OrganQuality.Bad,
        },
    },
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
        removeOrgan: (state, action: PayloadAction<string>) => {
            delete state.organs[action.payload];
        },
        sellOrgan: (state, action: PayloadAction<{ id: string; price: number }>) => {
            delete state.organs[action.payload.id];
            state.money += action.payload.price;
        },
        setMoney: (state, action: PayloadAction<number>) => {
            state.money = action.payload;
        },
        setSurgeryToolsLevel: (state, action: PayloadAction<number>) => {
            state.surgeryToolsLevel = action.payload;
        },
        setCaptureToolsLevel: (state, action: PayloadAction<number>) => {
            state.captureToolsLevel = action.payload;
        },
        setSurveillanceToolsLevel: (state, action: PayloadAction<number>) => {
            state.surveillanceToolsLevel = action.payload;
        },
        resetShop: () => ({ ...initialState }),
    },
});

export const {
    addOrgan,
    removeOrgan,
    sellOrgan,
    setMoney,
    setSurgeryToolsLevel,
    setCaptureToolsLevel,
    setSurveillanceToolsLevel,
    resetShop,
} = shopSlice.actions;

export const getShopState = (state: State) => state.shop;

export const getShopMoney = createSelector(getShopState, (shop) => shop.money);
export const getShopSurgeryToolsLevel = createSelector(
    getShopState,
    (shop) => shop.surgeryToolsLevel - 1
);
export const getShopCaptureToolsLevel = createSelector(
    getShopState,
    (shop) => shop.captureToolsLevel
);
export const getShopSurveillanceToolsLevel = createSelector(
    getShopState,
    (shop) => shop.surveillanceToolsLevel
);

export const getShopOrgans = createSelector(getShopState, (shop) => shop.organs);

export default shopSlice.reducer;
