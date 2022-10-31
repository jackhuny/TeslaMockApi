import { getState, setStateValue, genStates } from "./utils";

export type commandResponseWarper = {
    response: commandResponse;
};
export type commandResponse = {
    reason: string;
    result: boolean;
};

export const sentryMode = async (
    vehicleId: string,
    on: boolean
): Promise<commandResponseWarper> => {
    const isSentryModeAvail = await getState(
        vehicleId,
        "vehicle_state",
        "sentry_mode_available"
    );
    if (isSentryModeAvail.value === "false") {
        return {
            response: { reason: "sentry mode unavailable", result: false },
        };
    }
    try {
        await setStateValue(
            vehicleId,
            "vehicle_state",
            "sentry_mode",
            String(on)
        );
        return { response: { reason: "", result: true } };
    } catch (e) {
        return {
            response: { reason: "unable to update record", result: false },
        };
    }
};

export const doorLock = async (
    vehicleId: string,
    lock: boolean
): Promise<commandResponseWarper> => {
    try {
        await setStateValue(vehicleId, "vehicle_state", "locked", String(lock));
        return { response: { reason: "", result: true } };
    } catch (e) {
        return {
            response: { reason: "unable to update record", result: false },
        };
    }
};

export const windowControl = async (
    vehicleId: string,
    params: { lat; lon; command }
): Promise<commandResponseWarper> => {
    try {
        const { lat, lon, command } = params;
        let val = "0";
        if (command == "vent") {
            val = "1";
        } else if (command == "close") {
            val = "0";
        } else {
            return { response: { reason: "unknown command", result: false } };
        }

        await setStateValue(vehicleId, "vehicle_state", "fd_window", val);
        await setStateValue(vehicleId, "vehicle_state", "fp_window", val);
        await setStateValue(vehicleId, "vehicle_state", "rd_window", val);
        await setStateValue(vehicleId, "vehicle_state", "rp_window", val);
        return { response: { reason: "", result: true } };
    } catch (e) {
        return {
            response: { reason: "unable to update record", result: false },
        };
    }
};
export const sunRoofControl = async (
    vehicleId: string,
    state: string
): Promise<commandResponseWarper> => {
    try {
        let val = "0";
        if (state == "vent") {
            val = "vent";
        } else if (state == "close") {
            val = "closed";
        } else {
            return {
                response: {
                    reason: "unknown state should be (close or vent)",
                    result: false,
                },
            };
        }

        await setStateValue(vehicleId, "vehicle_state", "sun_roof_state", val);
        await setStateValue(
            vehicleId,
            "vehicle_state",
            "sun_roof_percent_open",
            val == "vent" ? "10" : "0"
        );
        return { response: { reason: "", result: true } };
    } catch (e) {
        return {
            response: { reason: "unable to update record", result: false },
        };
    }
};

export const actuateTrunk = async (
    vehicleId: string,
    which_trunk: string
): Promise<commandResponseWarper> => {
    try {
        if (which_trunk == "front") {
            const currentState = await getState(
                vehicleId,
                "vehicle_state",
                "ft"
            );
            await setStateValue(
                vehicleId,
                "vehicle_state",
                "ft",
                currentState.value == "1" ? "0" : "1"
            );
        } else if (which_trunk == "rear") {
            const currentState = await getState(
                vehicleId,
                "vehicle_state",
                "rt"
            );
            await setStateValue(
                vehicleId,
                "vehicle_state",
                "rt",
                currentState.value == "1" ? "0" : "1"
            );
        } else {
            return {
                response: { reason: "invalid which_trunk", result: false },
            };
        }
        return { response: { reason: "", result: true } };
    } catch (e) {
        return {
            response: { reason: "unable to update record", result: false },
        };
    }
};

export const autoConditioning = async (
    vehicleId: string,
    isOn: boolean
): Promise<commandResponseWarper> => {
    try {
        await setStateValue(
            vehicleId,
            "climate_state",
            "is_climate_on",
            isOn ? "true" : "false"
        );
        await setStateValue(
            vehicleId,
            "climate_state",
            "is_auto_conditioning_on",
            isOn ? "true" : "false"
        );
        return { reason: "", result: true };
    } catch (e) {
        return { reason: "unable to update record", result: false };
    }
};

export const sleep = async (
    vehicleId: string
): Promise<commandResponseWarper> => {
    try {
        await setStateValue(vehicleId, "data", "state", "asleep");
        return { response: { reason: "", result: true } };
    } catch (e) {
        return {
            response: { reason: "unable to update record", result: false },
        };
    }
};
export const wake = async (vehicleId: string): Promise<{}> => {
    try {
        await setStateValue(vehicleId, "data", "state", "online");
    } catch (e) {
        return {
            response: { result: false, reason: "unable to wake vehicle" },
        };
    }
    return { response: await genStates(vehicleId, "data") };
};

export const mock_shift = async (
    vehicleId: string,
    shift: string
): Promise<commandResponseWarper> => {
    try {
        await setStateValue(vehicleId, "drive_state", "shift_state", shift);
        return { response: { reason: "", result: true } };
    } catch (e) {
        return {
            response: { reason: "unable to update record", result: false },
        };
    }
};

export const isOnline = async (vehicleId: string): Promise<boolean> => {
    const state = await getState(vehicleId, "data", "state");
    return state.value === "online" ? true : false;
};
