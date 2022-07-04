import {configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {MapLayer, Product} from '@app/api/avalanche/Types';

const initialMapLayers: Record<string, MapLayer> = {};

export const mapLayers = createSlice({
  name: 'mapLayers',
  initialState: initialMapLayers,
  reducers: {
    updateMapLayers: (
      state,
      action: PayloadAction<Record<string, MapLayer>>,
    ) => {
      for (const name in action.payload) {
        if (action.payload.hasOwnProperty(name)) {
          state[name] = action.payload[name];
        }
      }
    },
  },
});

export const selectMapLayers = (state: RootState) => state.mapLayers;
export const {updateMapLayers} = mapLayers.actions;

const initialProducts: Record<string, Product> = {};

export const products = createSlice({
  name: 'products',
  initialState: initialProducts,
  reducers: {
    updateProducts: (state, action: PayloadAction<Record<string, Product>>) => {
      for (const name in action.payload) {
        if (action.payload.hasOwnProperty(name)) {
          state[name] = action.payload[name];
        }
      }
    },
  },
});

export const selectProducts = (state: RootState) => state.products;
export const {updateProducts} = products.actions;

export const store = configureStore({
  reducer: {
    mapLayers: mapLayers.reducer,
    products: products.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
