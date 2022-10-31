import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type VehicleInfo = {
    id: number;
    display_name: string;
    [key: string]: any;
} | null;
export type VehicleData = {
    id: number;
    display_name: string;
    drive_state: any;
    climate_state: any;
    charge_state: any;
    gui_settings: any;
    vehicle_state: any;
    vehicle_config: any;
    [key: string]: any;
} | null;
export type VehicleState = {
    vehicleId: number | string;
    vehicleInfo: VehicleInfo;
    vehicleData: VehicleData;
};

const initialState: VehicleState = {
    vehicleId: 0,
    vehicleInfo: null,
    vehicleData: null,
};

export const vehicleSlice = createSlice({
    name: "vehicle",
    initialState,
    reducers: {
        setId: (state, action: PayloadAction<number | string>) => {
            state.vehicleId = action.payload;
        },
        setVehicleInfo: (state, action: PayloadAction<VehicleInfo>) => {
            state.vehicleInfo = action.payload;
        },
        setVehicleData: (state, action: PayloadAction<VehicleData>) => {
            state.vehicleData = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setId, setVehicleInfo, setVehicleData } = vehicleSlice.actions;

export default vehicleSlice.reducer;
