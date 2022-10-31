import commands from "../pages/api/1/vehicles/[vehicleId]/command/[commandName]";

import { createMocks } from "node-mocks-http";
import { getState, setStateValue } from "../lib/utils";

const vehicleId = process.env.SAMPLE_VEHICLE_ID || "1000";
describe("Command Test", () => {
    it("SentryMode_ApiError", async () => {
        const originalState = await getState(
            vehicleId,
            "vehicle_state",
            "sentry_mode"
        );
        const { req, res } = createMocks({
            method: "GET",
            query: {
                vehicleId,
                commandName: "set_sentry_mode",
            },
        });
        await commands(req, res);
        expect(res._getStatusCode()).toBe(200);
        const result = JSON.parse(res._getData());
        expect(result).toHaveProperty("response");
        const response = result.response;
        expect(response).toHaveProperty("result");
        expect(response.result).toEqual(false);
        expect(response).toHaveProperty("reason");

        const state = await getState(vehicleId, "vehicle_state", "sentry_mode");
        expect(originalState.value).toEqual(state.value);
    });
    it("NoVehicleId_500Error", async () => {
        const { req, res } = createMocks({
            method: "POST",
            query: {
                vehicleId: "",
                commandName: "mock_set",
            },
        });
        await commands(req, res);
        expect(res._getStatusCode()).toBe(500);
        const result = JSON.parse(res._getData());
        expect(result).toHaveProperty("response");
        const response = result.response;
        expect(response).toHaveProperty("result");
        expect(response.result).toEqual(false);
        expect(response).toHaveProperty("reason");
    });

    it("wake", async () => {
        const { req, res } = createMocks({
            method: "GET",
            query: {
                vehicleId,
                commandName: "wake",
            },
        });
        await commands(req, res);
        expect(res._getStatusCode()).toBe(200);
        const result = JSON.parse(res._getData());
        expect(result).toHaveProperty("response");
        const response = result.response;
        expect(response).toHaveProperty("state");

        const state = await getState(vehicleId, "data", "state");
        expect(state.value).toBe("online");
    });

    const testDataDoorLock = [
        [
            "Lock Door",
            {
                domain: "vehicle_state",
                item: "locked",
                commandName: "door_lock",
                params: {},
            },
            "true",
        ],
        [
            "Unlock Door",
            {
                domain: "vehicle_state",
                item: "locked",
                commandName: "door_unlock",
                params: {},
            },
            "false",
        ],
    ];

    const testDataSentryMode = [
        [
            "sentryMode ON",
            {
                domain: "vehicle_state",
                item: "sentry_mode",
                commandName: "set_sentry_mode",
                params: { on: "true" },
            },
            "true",
        ],
        [
            "sentryMode OFF",
            {
                domain: "vehicle_state",
                item: "sentry_mode",
                commandName: "set_sentry_mode",
                params: { on: "false" },
            },
            "false",
        ],
    ];

    const testDataVehicleState = [
        [
            "Go Asleep",
            {
                domain: "data",
                item: "state",
                commandName: "sleep",
                params: {},
            },
            "asleep",
        ],
        [
            "Go Offline",
            {
                domain: "data",
                item: "state",
                commandName: "offline",
                params: {},
            },
            "offline",
        ],
    ];

    const testDataShifterState = [
        [
            "Shift: P",
            {
                domain: "drive_state",
                item: "shift_state",
                commandName: "mock_shift",
                params: { state: "P" },
            },
            "P",
        ],
    ];

    const testData = [
        ...testDataDoorLock,
        ...testDataSentryMode,
        ...testDataVehicleState,
        ...testDataShifterState,
        // Mock Set (Sets any state to any value)
        [
            "Mock Set",
            {
                domain: "data",
                item: "display_name",
                commandName: "mock_set",
                params: {
                    domain: "data",
                    item: "display_name",
                    value: "Cyber Truck 4000",
                },
            },
            "Cyber Truck 4000",
        ],
    ];

    it.each(testData)("Testing Command %s", async (_, b: any, expected) => {
        const { domain, item, commandName, params } = b;
        const originalState = await getState(vehicleId, domain, item);

        const { req, res } = createMocks({
            method: "GET",
            query: { vehicleId, commandName },
            body: { ...params },
        });
        await commands(req, res);
        expect(res._getStatusCode()).toBe(200);

        const result = JSON.parse(res._getData());
        expect(result).toHaveProperty("response");

        const response = result.response;
        expect(response).toHaveProperty("result");
        expect(typeof response.result).toBe("boolean");

        const state = await getState(vehicleId, domain, item);
        expect(state.value).toBe(expected);

        // set state back to original
        await setStateValue(vehicleId, domain, item, originalState.value);
    });
});

export {};
