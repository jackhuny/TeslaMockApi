import prisma from "../lib/prisma";
import { State } from "@prisma/client";

export const domainList: string[] = [
    "drive_state",
    "climate_state",
    "charge_state",
    "gui_settings",
    "vehicle_state",
    "vehicle_config",
];

export const genStates = async (
    vehicleId: string,
    state_category: string
): Promise<{}> => {
    return dataTypeConverter(
        await prisma.state.findMany({
            where: {
                AND: [{ vehicleId }, { domain: state_category }],
            },
        })
    );
};

export const dataTypeConverter = (states: State[]) => {
    let response = {};
    states.map((e: State) => {
        if (e.value === "null") {
            response[e.item] = null;
        } else {
            switch (e.dataType) {
                case "float":
                    response[e.item] = parseFloat(e.value);
                    break;
                case "int":
                    response[e.item] = parseInt(e.value);
                    break;
                case "boolean":
                    response[e.item] = e.value === "true" ? true : false;
                    break;
                case "json":
                    response[e.item] = JSON.parse(e.value);
                    break;
                default:
                    response[e.item] = String(e.value);
            }
        }
    });
    return response;
};

export const getState = async (
    vehicleId: string,
    domain: string,
    item: string
): Promise<State | null> => {
    const state = await prisma.state.findUnique({
        where: {
            vehicleState: {
                vehicleId,
                domain,
                item,
            },
        },
    });
    return state;
};

/**
 * Set a vehicle state manually
 * @param vehicleId ID of the vehicle
 * @param domain
 * @param item
 * @param value
 * @returns Updated State Obj
 */
export const setStateValue = async (
    vehicleId: string,
    domain: string,
    item: string,
    value: string
) => {
    const updateState = await prisma.state.update({
        where: {
            vehicleState: {
                vehicleId,
                domain,
                item,
            },
        },
        data: {
            value: value,
        },
    });

    return updateState;
};

// Helper Funcs
export const getRandomArbitrary = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
};
